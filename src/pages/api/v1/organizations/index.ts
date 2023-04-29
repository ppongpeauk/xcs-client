import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "GET") {
    // request parameters & headers
    const { authorization } = req.headers as { authorization: string };

    // refuse request if an illegally formatted authorization header is provided (before validating it)
    if (authorization && !authorization.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    // get user id from token
    const uid = await tokenToID(authorization?.split('Bearer ')[1] || "");

    // refuse request if the user id is not found
    if (!uid) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    // connect to mongodb
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB as string);
    const findOptions = {projection: { _id: 0 }};

    // get user
    const users = await db
      .collection("users")
      .find({ id: uid }, findOptions)
      .toArray();

    // if the user exists, return the organizations they are a member of
    if (users.length > 0) {
      res.status(200).json({ success: true, data: users[0].organizations });
      return;
    }
    res.status(404).json({ success: false, error: "User not found" });
  } else {
    res.status(400).json({ success: false, error: "Bad request" });
  }
};

export default handler;