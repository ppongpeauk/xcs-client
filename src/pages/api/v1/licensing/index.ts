import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === "GET") {
    const { id } = req.query as { id: string };

    if (!id) {
      res.status(400).json({ success: false, message: "Bad request" });
      return;
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB as string);
    const findOptions = {projection: { _id: 0 }};
    const licenses = await db
      .collection("licenses")
      .find({ subjectId: id }, findOptions)
      .toArray();
    res.status(200).json({ success: true, data: licenses[0] });
  }
}

export default handler;