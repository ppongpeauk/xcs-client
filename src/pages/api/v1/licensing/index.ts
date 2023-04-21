import clientPromise from "@/lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const bv = (v: string) => {
  switch (v) {
    case "0":
      return false;
    case "1":
      return true;
    default:
      return false;
  }
};

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
    const findOptions = { projection: { _id: 0 } };
    const licenses = await db
      .collection("licenses")
      .find({ subjectId: id }, findOptions)
      .toArray();
      if (licenses.length > 0) {
        const license = licenses[0];
        let ret = {
          success: true,
          subjectId: id,
          groupId: "-1",
          productsOwned: {
            monospace0: bv(license.monospace0),
            polaris0: bv(license.polaris0),
            hera0: bv(license.hera0)
          }
        };
        res.status(200).json(ret);
      } else {
        res.status(400).json({ success: true, subjectId: id, groupId: "-1", productsOwned: { monospace0: false, polaris0: false, hera0: false }});
      }
  } else {
    res.status(400).json({ success: false, message: "Bad request" });
  }
};

export default handler;
