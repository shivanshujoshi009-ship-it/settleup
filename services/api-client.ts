import { auth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

function getCurrentUser(): Promise<User> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();

        if (!user) {
          reject(
            new Error("User is not authenticated.")
          );
          return;
        }

        resolve(user);
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
}

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  const user =
    auth.currentUser ?? (await getCurrentUser());

  const token = await user.getIdToken();

  const headers = new Headers(init.headers);

  headers.set(
    "Authorization",
    `Bearer ${token}`
  );

  if (
    init.body &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  return fetch(input, {
    ...init,
    headers,
  });
}