import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== "POST") {
    res.status(400).json({ success: false, error: "Bad request" });
    return;
  }

  const { username } = req.query as { username: string };

  if (!username) {
    res.status(200).json({ success: false, email: "" });
    return;
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB as string);
  const findOptions = { projection: { _id: 0 } };
  const user = await db
    .collection("users")
    .findOne({ username: username }, findOptions);

  if (!user) {
    res.status(200).json({ success: false, email: "" });
    return;
  }

  res.status(200).json({ success: true, email: user.email.value });
};

export default handler;
