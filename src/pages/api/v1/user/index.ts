import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === "GET") {
    const { username } = req.query as { id: string, username : string };

    if (!username) {
      res.status(400).json({ success: false, message: "Bad request" });
      return;
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB as string);
    const findOptions = {projection: { _id: 0 }};
    const users = await db
      .collection("users")
      .find({ username: username }, findOptions)
      .toArray();
    res.status(200).json({ success: true, data: users });
  } else {
    res.status(400).json({ success: false, message: "Bad request" });
  }
};

export default handler;
