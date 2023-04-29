import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "GET") {
    // request parameters & headers
    const { user_id } = req.query as { user_id: string };
    const { authorization } = req.headers as { authorization: string };
    
    try {
      // validate bearer tokens before proceeding
      const uid = await tokenToID(authorization.split('Bearer ')[1]);
      // check if the token is valid and if the user is the same as the one in the request
      if (uid !== user_id) {
        res.status(401).json({ success: false, error: "Unauthorized" });
        return;
      }

      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB as string);
      
      // get the organizations
      const organizations = await db
        .collection("organizations")
        .find({ members: {$all: [user_id]} })
        .toArray();

      // return the organizations
      res.status(200).json({ success: true, organizations: organizations });

    } catch {
      // return an internal server error if there was an unexpected exception
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    // return a method not allowed error if the request method is not POST
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
};

export default handler;
