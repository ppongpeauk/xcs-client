import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== "DELETE") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }
  
  // request parameters & headers
  const { location_id } = req.query as { location_id: string };
  const { authorization } = req.headers as { authorization: string };

  // get user id from token
  const user_id = await tokenToID(authorization.split("Bearer ")[1]);

  // connect to mongodb
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB as string);
  const locations = db.collection("locations");
  const organizations = db.collection("organizations");
  
  // get location
  const location = await locations.findOne({ id: location_id });

  // location doesn't exist
  if (!location) {
    res.status(404).json({ success: false, error: "Location not found" });
    return;
  }

  // get organization from location
  const organization = await organizations.findOne({ id: location.organizationId });

  // the organization linked to the location doesn't exist? (shouldn't happen)
  if (!organization) {
    res.status(404).json({ success: false, error: "Organization not found" });
    return;
  }

  // check if user is member of organization
  if (!organization.members.includes(user_id)) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  // delete location
  await locations.deleteOne({ id: location_id });

  // log the deletion
  const time = new Date();
  const timestamp = time.getTime();
  await organizations.updateOne(
    { id: organization.id },
    { $push: { logs: { type: "location_deleted", date: timestamp, location_id: location_id, performer: user_id } } }
  );
  
  res.status(200).json({ success: true });

};

export default handler;