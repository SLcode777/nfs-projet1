"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    setIsLoading(true);

    const payload = {
      email,
      password,
      name: "anonymous",
    };

    console.log("🚀 Signup payload:", payload);

    const { data, error } = await authClient.signUp.email(payload, {
      onRequest: () => {
        console.log("📡 Sending signup request...");
      },
      onSuccess: (ctx) => {
        console.log("✅ Signup success:", ctx);
        router.replace("/posts");
      },
      onError: (ctx) => {
        console.error("❌ Signup error:", ctx, ctx.error, ctx.response);
        alert(ctx.error.message);
      },
    });

    setIsLoading(false);
  };

  return (
    <div className="container">
      <div className="text-2xl font-bold mb-2">THIS IS MY NFS-PROJET1 APP</div>
      <hr className="mb-10 border-0 h-0.5 rounded bg-gradient-to-r from-purple-700 to-blue-500" />
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="gap-3 flex flex-col">
          <Input
            placeholder="your email"
            onChange={(e) => setEmail(e.target.value)}
          ></Input>
          <Input
            placeholder="your password"
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <Button onClick={handleSignUp} disabled={isLoading}>
            {isLoading
              ? "Creating account, please wait..."
              : "Create my account"}
          </Button>
          <Button variant={"outline"} onClick={() => router.replace("signin")}>
            I already have an accout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
