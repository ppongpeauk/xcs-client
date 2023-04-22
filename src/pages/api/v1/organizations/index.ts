import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "POST") {
    // refuse request if an illegally formatted authorization header is provided (before validating it)
    if (req.headers.authorization && !req.headers.authorization.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const uid = await tokenToID(req.headers.authorization?.split('Bearer ')[1] || "");
    if (!uid) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB as string);
    const findOptions = {projection: { _id: 0 }};
    const users = await db
      .collection("users")
      .find({ id: uid }, findOptions)
      .toArray();
    if (users.length > 0) {
      res.status(200).json({ success: true, data: users[0].organizations });
      return;
    }
    res.status(404).json({ success: false, message: "User not found" });
  } else {
    res.status(400).json({ success: false, message: "Bad request" });
  }
};

export default handler;