"use client";

import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<string>("ah");

  let sharedState: any = { user, setUser };

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAuthContext(): any {
  return useContext(AppContext);
}
