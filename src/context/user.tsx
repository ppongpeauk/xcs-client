"use client";

import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<Object>({
    name: "John Doe",
    role: "Admin",
    avatar: "https://i.pravatar.cc/512?img=12",
    id: "5d21989728d7a",
    email: "kurtsiberg@gmail.com",
  });

  let sharedState: any = { user, setUser };

  return (
    <AppContext.Provider value={sharedState}>{children}</AppContext.Provider>
  );
}

export function useAuthContext(): any {
  return useContext(AppContext);
}
