import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "POST") {
    const { id, username } = req.query as { id: string, username : string };

    // refuse request if an illegally formatted authorization header is provided (before validating it)
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    // refuse request if no id or username is provided
    if (!username && !id) {
      res.status(400).json({ success: false, error: "Bad request" });
      return;
    }

    
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB as string);
    const findOptions = {projection: { _id: 0 }};
    const users = await db
      .collection("users")
      .find({ $or: [{username: username}, {id: id}] }, findOptions)
      .toArray();
    if (users.length > 0) {
      let getData = users[0];
      // process data
      const tokenUser = await tokenToID(idToken || "");
      if (tokenUser == id) {
        getData.isCurrentUser = true;
      }
      res.status(200).json({ success: true, data: users[0] });
      return;
    } else {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }
  } else {
    res.status(400).json({ success: false, error: "Bad request" });
  }
};

export default handler;
