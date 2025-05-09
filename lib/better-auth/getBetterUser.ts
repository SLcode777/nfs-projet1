//get current user with better-auth

import { headers } from "next/headers";
import { auth } from "./auth";

export const getBetterAuthSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  return session?.user;
};
