import { prisma } from "@/lib/prisma";

export async function syncUser(data: {
  firebaseId: string;
  name: string;
  email: string;
  photoUrl?: string;
}) {
  const existing = await prisma.user.findUnique({
    where: {
      firebaseId: data.firebaseId,
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.user.create({
    data,
  });
}

export async function getUser(firebaseId: string) {
  return prisma.user.findUnique({
    where: {
      firebaseId,
    },
  });
}