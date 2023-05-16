import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import fileSystem from 'fs';
import { NextApiRequest, NextApiResponse } from "next";
import path from 'path';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== "GET") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  res.status(200).json({ success: true });
};

export default handler;