"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  User,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

export interface DbUser {
  id: string;
  firebaseId: string;
  name: string;
  email: string;
  photoUrl?: string;
}

type AuthContextType = {
  user: User | null;
  dbUser: DbUser | null;
  loading: boolean;
  setDbUser: (user: DbUser | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  loading: true,
  setDbUser: () => {},
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);
        console.log("Firebase user:", currentUser);

        if (currentUser) {
          try {
            const response = await fetch(
              "/api/users/sync",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  firebaseId: currentUser.uid,
                  name: currentUser.displayName,
                  email: currentUser.email,
                  photoUrl: currentUser.photoURL,
                }),
              }
            );

            const data = await response.json();

            setDbUser(data.user);
            console.log("dbUser restored:", data.user);
            
          }
           catch (error) {
            console.error("Failed to restore dbUser", error);
          }
        } else {
          setDbUser(null);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        loading,
        setDbUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);