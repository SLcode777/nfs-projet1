import { cookies } from "next/headers";
import prisma from "./prisma";

//get current User with custom-auth

export async function getCurrentUser() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || new Date() > session.expiresAt) return null;

  return session.user;
}

export async function deleteCustomCookie() {
  (await cookies()).delete("token");
}
