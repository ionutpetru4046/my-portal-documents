// src/context/UserContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    async function syncUser() {
      // Fetch Supabase user
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const newUser = {
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email || "",
          email: data.user.email || "",
          avatar: data.user.user_metadata?.avatar || "https://i.pravatar.cc/100",
        };
        setUserState(newUser);
        localStorage.setItem("myportal-user", JSON.stringify(newUser));
      } else {
        setUserState(null);
        localStorage.removeItem("myportal-user");
      }
    }
    syncUser();
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("myportal-user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("myportal-user");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
