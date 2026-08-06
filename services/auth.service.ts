import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

const provider =
  new GoogleAuthProvider();

export async function loginWithGoogle() {
  const result =
    await signInWithPopup(auth, provider);

  const firebaseUser = result.user;

  const response = await fetch(
    "/api/users/sync",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        firebaseId: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photoUrl: firebaseUser.photoURL,
      }),
    }
  );

  const data = await response.json();

  return {
    firebaseUser,
    dbUser: data.user,
  };
}

export function logout() {
  return auth.signOut();
}