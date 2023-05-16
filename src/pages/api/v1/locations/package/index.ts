// generate kit download for a location

import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== "GET") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }
  // request parameters & headers
  const { location_id } = req.query as { location_id: string };
  const { authorization } = req.headers as { authorization: string };

  // return sample file
  res.setHeader("Content-Disposition", "attachment; filename=sample.zip");
  res.setHeader("Content-Type", "application/zip");
  res.status(200).send("sample_file.txt");

};
