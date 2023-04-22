import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === "POST") {
    // request parameters & headers
    const { organization_id } = req.query as { organization_id: string };
    const { authorization } = req.headers as { authorization: string };
    
    try {
      // validate bearer tokens before proceeding
      const uid = await tokenToID(authorization.split('Bearer ')[1]);
      // check if the token is valid
      if (!uid) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      // now let's check if the user is a member of the organization
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB as string);
      const organization = await db
        .collection("organizations")
        .find({ id: organization_id })
        .toArray();

      // check if the organization exists
      if (organization.length === 0) {
        res.status(404).json({ success: false, message: "Organization not found" });
        return;
      } else {
        // check if the user is a member of the organization
        if (!organization[0].members.includes(uid)) {
          res.status(401).json({ success: false, message: "Unauthorized" });
          return;
        }
      }

      // get the locations
      const locations = await db
        .collection("locations")
        .find({ organizationId: organization_id })
        .toArray();

      // return the locations
      res.status(200).json({ success: true, locations: locations });

    } catch {
      // return an internal server error if there was an unexpected exception
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  } else {
    // return a method not allowed error if the request method is not POST
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
};

export default handler;
