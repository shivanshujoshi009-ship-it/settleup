import { NextRequest } from "next/server";
import { getAuth } from "firebase-admin/auth";

import { firebaseAdminApp } from "@/lib/firebase-admin";

export async function getAuthenticatedUser(
  request: NextRequest
) {
  const authHeader = request.headers.get(
    "authorization"
  );

  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const idToken = authHeader.slice(7);

  return getAuth(firebaseAdminApp).verifyIdToken(
    idToken
  );
}