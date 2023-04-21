import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === "GET") {
    const { id, username } = req.query as { id: string, username : string };

    if (!username && !id) {
      res.status(400).json({ success: false, message: "Bad request" });
      return;
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB as string);
    const findOptions = {projection: { _id: 0 }};
    const users = await db
      .collection("users")
      .find({ $or: [{username: username}, {id: id}] }, findOptions)
      .toArray();
    if (users.length > 0) {
      res.status(200).json({ success: true, data: users[0] });
      return;
    } else {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
  } else {
    res.status(400).json({ success: false, message: "Bad request" });
  }
};

export default handler;
