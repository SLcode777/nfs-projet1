"use client";

import { authClient } from "@/lib/better-auth/auth-client";
import { redirect } from "next/navigation";
import { Button } from "./button";

export const BetterLogoutButton = () => {
  const handleClick = async () => {
    await authClient.signOut();
    redirect("/");
  };
  return <Button onClick={handleClick}>Better Auth Logout</Button>;
};
