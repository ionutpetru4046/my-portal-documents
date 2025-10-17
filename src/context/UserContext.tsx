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
  user: User;
  setUser: (user: User) => void;
};

const defaultUser: User = {
  id: "",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://i.pravatar.cc/100",
};

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User>(defaultUser);

  useEffect(() => {
    async function syncUser() {
      const storedUser = localStorage.getItem("myportal-user");
      if (storedUser) setUserState(JSON.parse(storedUser));
      // Fetch Supabase user
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const newUser = {
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email || "",
          email: data.user.email,
          avatar: data.user.user_metadata?.avatar || "https://i.pravatar.cc/100",
        };
        setUserState(newUser);
        localStorage.setItem("myportal-user", JSON.stringify(newUser));
      }
    }
    syncUser();
  }, []);

  const setUser = (newUser: User) => {
    setUserState(newUser);
    localStorage.setItem("myportal-user", JSON.stringify(newUser));
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
