// src/context/UserContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  name: string;
  email: string;
  avatar: string;
};

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
};

const defaultUser: User = {
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
    const storedUser = localStorage.getItem("myportal-user");
    if (storedUser) setUserState(JSON.parse(storedUser));
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
