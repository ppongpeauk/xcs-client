import { Location } from "@/interfaces";
import clientPromise from "@/lib/mongodb";
import { tokenToID } from "@/pages/api/firebase";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== "PUT") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }
  // request parameters & headers
  const { location_id, data } = req.query as {
    location_id: string;
    data: string;
  };
  const { authorization } = req.headers as { authorization: string };

  // parse data
  const parsedData = JSON.parse(data);

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

  // placeIds cannot be changed once set
  
  if (parsedData.roblox["placeId"] !== null) {
    parsedData.roblox.placeId = parsedData.roblox.placeId.trim().replace(/\D/g,'');
    if (parsedData.roblox.placeId.length === 0) {
      res.status(200).json({ success: false, error: "The Place ID cannot be empty if specified." });
      return;
    }
    if (parsedData.roblox.placeId == 0) {
      res.status(200).json({ success: false, error: "The Place ID cannot be zero." });
      return;
    }
    if (
      location.roblox.placeId !== null && parsedData.roblox.placeId !== location.roblox.placeId
    ) {
      res.status(200).json({ success: false, error: "Place ID mismatch. The place ID cannot be changed once set." });
      return;
    }
  }

  // naming guidelines
  parsedData.name = parsedData.name.trim();
  if (parsedData.name !== undefined) {
    if (parsedData.name.length > 32) {
      res.status(200).json({ success: false, error: "Name cannot be more than 32 characters." });
      return;
    } else if (parsedData.name.length < 4) {
      res.status(200).json({ success: false, error: "Name cannot be less than 4 characters." });
      return;
    }
  }

  // get organization from location
  const organization = await organizations.findOne({
    id: location.organizationId,
  });

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

  const time = new Date();
  const timestamp = time.getTime();

  parsedData.lastUpdatedDate = timestamp;

  // update location
  await locations.updateOne({ id: location_id }, { $set: parsedData });

  // log the update
  await organizations.updateOne(
    { id: organization.id },
    {
      $push: {
        logs: {
          type: "location_updated",
          date: timestamp,
          location_id: location_id,
          performer: user_id,
        },
      },
    }
  );

  res.status(200).json({ success: true });
};

export default handler;
