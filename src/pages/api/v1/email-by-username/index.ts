import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === "POST") {
    const { username } = req.query as { username: string };
    if (!username) {
      res.status(200).json({ success: false, email: "" });
      return;
    }
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB as string);
    const user = await db
      .collection("users")
      .findOne({ username: username }, { projection: { _id: 0 } });
    console.info(user)
    if (user) {
      res.status(200).json({ success: true, email: user.email.value });
      return;
    } else {
      res.status(200).json({ success: false, email: "" });
      return;
    }
  } else {
    res.status(400).json({ success: false, error: "Bad request" });
    return;
  }
};

export default handler;
