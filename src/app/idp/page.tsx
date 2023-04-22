"use client";

import { auth } from "@/firebase/firebaseApp";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { initFirebase } from "../../firebase/firebaseApp";

export default function Auth() {
  const app = initFirebase();
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  // redirect to /idp/login if the user is not logged in
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/idp/login");
    } else {
      router.push("/platform/home");
    }
  }, [loading, router, user]);

  return (
    <div>
      <h1>Loading..</h1>
    </div>
  );
}
