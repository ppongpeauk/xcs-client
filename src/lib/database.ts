import { db } from "@/firebase/firebaseApp";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

export async function setUserSubscription(userEmail: string, customerId: string, premiumStatus: boolean) {
  const q = query(collection(db, "users"), where("email", "==", userEmail));
  const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      console.info("doc", doc.data());
      // doc.data() is never undefined for query doc snapshots
      await updateDoc(doc.ref as any, {
        isPremium: premiumStatus,
        customerId: customerId
      });

    }
  );
}

export async function updateUserSubscription(customerId: string, premiumStatus: boolean) {
  const q = query(collection(db, "users"), where("customerId", "==", customerId));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (doc) => {
      console.info("doc", doc.data());
      // doc.data() is never undefined for query doc snapshots
      await updateDoc(doc.ref as any, {
        isPremium: premiumStatus,
        // customerId: (premiumStatus ? customerId : null)
      }); 
    }
  );
}

export async function getUserDataFromUid(uid: string) {
  const docRef = await doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.info(docSnap.data());
    return docSnap.data();
  } else {
    return null;
  }
}