"use client";

import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase } from "../../../firebase/firebaseApp";

export default function Page() {
  const app = initFirebase();
  const router = useRouter();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!user) {
    router.push("/idp/login");
  }

  return (
    <>
      <h1>Home</h1>
    </>
  );
}
