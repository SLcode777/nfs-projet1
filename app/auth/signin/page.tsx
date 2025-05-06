"use client";

//IL RESTE A METTRE EN PLACE LA CREATION DE SESSION ET LES COOKIES

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SigninPage() {
  const params = useSearchParams();
  const emailFromParams = params.get("email") ?? "";

  const [userPw, setUserPw] = useState("");
  const [userMail, setUserMail] = useState("");
  const sessionId = 0;
  const router = useRouter();

  useEffect(() => {
    if (emailFromParams) setUserMail(emailFromParams);
  }, [emailFromParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userPw || !userMail) {
      alert("merci de remplir tous les champs");
    }

    const res = await fetch("/api/custom-auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, userMail, userPw }),
    });

    if (res.ok) {
      router.push("/posts");
      setUserMail("");
      setUserPw("");
      
    } else if (res.status === 404) {
      const data = await res.json();
      alert(
        "ce compte n'existe pas. Redirection vers la page de création de compte"
      );
      router.push(`/auth/signup?email=${userMail}`);
    } else {
      console.error("erreur client lors de la connexion");
    }
  };

  return (
    <div className="container">
      <div className="text-2xl font-bold mb-2">SE CONNECTER</div>
      <hr className="my-8 border-0 h-1 rounded bg-gradient-to-r from-teal-400 to-blue-500" />
      <Card>
        <CardHeader>
          <CardTitle>Custom Auth</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
              type="email"
              name="email"
              value={userMail}
              placeholder="votre email"
              onChange={(e) => setUserMail(e.target.value)}
            />
            <Input
              placeholder="votre mot de passe"
              onChange={(e) => setUserPw(e.target.value)}
            />
            <Button type="submit">Se connecter</Button>
            <Link
              className="text-sm text-muted-foreground hover:underline"
              href={"/auth/signup"}
            >
              Je n'ai pas encore de compte
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
