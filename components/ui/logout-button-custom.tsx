"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";

export const CustomLogoutButton = () => {
  const router = useRouter();

  const handleClick = async () => {
    await fetch("/api/custom-auth/signout", { method: "POST" });
    router.push("/");
  };
  return <Button onClick={handleClick}>Custom Auth Logout</Button>;
};
