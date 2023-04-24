import clientPromise from "@/lib/mongodb";
import axios from "axios";

export async function setUserSubscription(userEmail: string, customerId: string, premiumStatus: boolean) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB as string);
  await db.
    collection("users")
    .updateOne({"payment.customerId": customerId}, {$set: {platform: {
      membership: premiumStatus ? "premium" : "free"
    }}});
  return true;
}

export async function updateUserSubscription(customerId: string, premiumStatus: boolean) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB as string);
  const findOptions = {projection: { _id: 0 }};
  const users = await db
    .collection("users")
    .find({ "payment.customerId": customerId }, findOptions)
    .toArray();
  await db.
    collection("users")
    .updateOne({"payment.customerId": customerId}, {$set: {platform: {
      membership: premiumStatus ? "premium" : "free"
    }}});
  return true;
}

export async function updateUserCustomerID(customerId: string, uid: string) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB as string);
  const findOptions = {projection: { _id: 0 }};
  const users = await db
    .collection("users")
    .find({ id: uid }, findOptions)
    .toArray();
  await db.
    collection("users")
    .updateOne({id: uid}, {$set: {payment: {
      customerId: customerId
    }}});
  return true;
}

export async function getUserDataFromUid(uid: string) {
  const client = await clientPromise;
  axios.post(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/user`, {}, {params: {id: uid}}).then((res) => {
    console.info(res.data);
    return res.data;
  }
  ).catch((err) => {
    console.info(err);
    return null;
  });
}