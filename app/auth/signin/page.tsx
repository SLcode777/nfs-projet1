"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="container">
      <div className="text-2xl font-bold mb-2">THIS IS MY NFS-PROJET1 APP</div>
      <hr className="mb-10 border-0 h-0.5 rounded bg-gradient-to-r from-purple-700 to-blue-500" />
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent className="gap-3 flex flex-col">
          <Input placeholder="your email"></Input>
          <Input placeholder="your password"></Input>
          <Button>Log In</Button>
          <Button variant={"outline"} onClick={() => router.replace("signup")}>
            I don't have an account yet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
