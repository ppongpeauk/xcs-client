// generate kit download for a location

import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  // request parameters & headers
  const { location_id } = req.query as { location_id: string };
  const { authorization } = req.headers as { authorization: string };

  // w.i.p.
  res.status(200).json({ success: true });
};
