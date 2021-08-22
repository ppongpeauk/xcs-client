/*
  @author Pete Pongpeauk (restrafes) <pete@restrafes.co>
  @author Evelyn Holloway <eholl2004@gmail.com>

  Copyright (c) 2021 EVE
  All rights reserved.
  
*/

// core imports
import React, { useEffect, useContext, useState } from "react";

// authentication
import { auth, firestore } from "firebase.js";

const AuthContext = React.createContext();
export function useAuth() { return useContext(AuthContext); }
export function AuthProvider({ children }) {
  // main user credential state
  const [userCredential, setCurrentUserCredential] = useState();

  // loading state, halts render until user authentication is loaded in
  const [loading, setLoading] = useState(true);

  // point basic variables to its respective auth functions
  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(
      email,
      password,
    );
  }
  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }
  function logout() {
    return auth.signOut();
  }
  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }
  function confirmPasswordReset(email) {
    return auth.confirmPasswordReset(email);
  }
  const sendEmailVerification = auth.sendPasswordResetEmail; // w.i.p.
  const verifyPasswordResetCode = auth.verifyPasswordResetCode; // w.i.p.
  const database = firestore;

  // main auth entry point
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUserCredential(user);
      setLoading(false);
    })
    return unsubscribe
  }, []);

  // values for the auth context
  const value = {
    userCredential,
    login, signup, logout,
    resetPassword, confirmPasswordReset,
    sendEmailVerification, verifyPasswordResetCode,
    database
  }

  // render everything
  return (
    <AuthContext.Provider value={value}>
      {/* only render everything under authcontext once authentication gets fully instantiated */}
      {!loading && children}
    </AuthContext.Provider>
  )
}