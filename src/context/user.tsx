"use client";

import { getUserDataFromUid } from "@/lib/database";
import { getAuth } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import {
  useAuthState
} from "react-firebase-hooks/auth";

const AppContext = createContext(null);

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const auth = getAuth();
  const [firebaseUser] = useAuthState(auth);

  const [user, setUser] = useState<Object>({
    name: "",
    id: "",
    role: "",
    avatar: "",
    email: "",
    isPremium: false,
  });
  
  useEffect(() => {
    if (!firebaseUser) return;
    async function syncUserData() {
      const userData = await getUserDataFromUid(firebaseUser!.uid);
      if (userData) {
        setUser({
            name: userData.fullName,
            id: firebaseUser!.uid,
            isPremium: userData.isPremium,
            avatar: userData.avatar,
            email: userData.email,
            role: userData.role,
            customerId: userData.customerId,
          });
        }
    }
    syncUserData();
  }, [firebaseUser]);

  let sharedState: any = { user, setUser };

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAuthContext(): any {
  return useContext(AppContext);
}
