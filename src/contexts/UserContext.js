/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useEffect, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const UserContext = React.createContext();
export function useUser() { return useContext(UserContext); }
export function UserProvider({ children }) {
  // main user credential state
  const [userProfile, setUserProfile] = useState();
  const { userCredential, database } = useAuth();

  // loading state, halts render until user authentication is loaded in
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = () => {
    return new Promise((resolve, reject) => {
      if (userCredential) {
        const userProfileRef = database.doc(`users/${userCredential.uid}`);
        userProfileRef.get().then((user) => {
          if (user.exists) {
            setUserProfile(user.data());
            resolve();
          }
        }).catch((err) => {
          reject(err);
        });
      } else {
        resolve();
      }
    });
  }

  // main user entry point
  useEffect(() => {
    refreshUserProfile().then(() => {
      setLoading(false);
    });
  }, []);

  // values for the auth context
  const value = {
    userProfile,
    setUserProfile,
    refreshUserProfile
  }

  // render everything
  return (
    <UserContext.Provider value={value}>
      {/* only render everything under authcontext once authentication gets fully instantiated */}
      {!loading && children}
    </UserContext.Provider>
  )
}