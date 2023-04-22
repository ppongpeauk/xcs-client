"use client";

import { auth } from "@/firebase/firebaseApp";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const AppContext = createContext(null);

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  // const auth = getAuth();
  const [firebaseUser] = useAuthState(auth);

  const [user, setUser] = useState<Object>({
    name: "",
    id: "",
    role: "",
    avatarURI: "",
    email: "",
    isPremium: false,
  });

  async function syncUserData() {
    if (!auth.currentUser) return;
    auth.currentUser
      .getIdToken()
      .then(function (idToken: string) {
        axios
          .post(
            "/api/v1/user",
            { },
            { params: { id: firebaseUser!.uid }, headers: { Authorization: `Bearer ${idToken}` } }
          )
          .then((res) => {
            if (res.data) {
              setUser(res.data);
              console.info("User data synced", res.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch(function (error: string) {
        // Handle error
      });
  }

  useEffect(() => {
    if (!firebaseUser) return;
    syncUserData();
  }, [firebaseUser]);

  let sharedState: any = { user, setUser, auth: auth, syncUserData };

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAuthContext(): any {
  return useContext(AppContext);
}
