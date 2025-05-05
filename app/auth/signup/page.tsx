"use client";

//IL RESTE A METTRE EN PLACE LA CREATION DE SESSION ET LES COOKIES

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignupPage() {
  const params = useSearchParams();
  const emailFromParams = params.get("email") ?? "";

  const [userPw, setUserPw] = useState("");
  const [userMail, setUserMail] = useState("");
  const sessionId = 0;
  const router = useRouter();

  useEffect(() => {
    if (emailFromParams) setUserMail(emailFromParams);
  }, [emailFromParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!userPw || !userMail) {
      console.error("champs manquants, merci de remplir tous les champs");
      return;
    }

    const res = await fetch("/api/custom-auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, userMail, userPw }),
    });

    console.log(
      "nouvel utilisateur à créer : ",
      JSON.stringify({ sessionId, userMail, userPw })
    );

    if (res.ok) {
      console.log("utilisateur envoyé dans la route !!!", res.body);
      router.push("/posts");
      setUserMail("");
      setUserPw("");
    } else if (res.status === 409) {
      const data = await res.json();
      alert(
        "L'utilisateur existe déjà, redirection vers la page de connexion. Veuillez entrer un mot de passe correct."
      );
      router.push(`/auth/signin?email=${userMail}`);
    } else {
      console.error("erreur client lors de la création de l'utilisateur");
    }
  }

  return (
    <div className="container">
      <div className="text-2xl font-bold mb-2">CREER UN COMPTE</div>
      <hr className="my-8 border-0 h-1 rounded bg-gradient-to-r from-teal-400 to-blue-500" />
      <Card>
        <CardHeader>
          <CardTitle>Custom Auth</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
              value={userMail}
              placeholder="votre email"
              onChange={(e) => setUserMail(e.target.value)}
            />
            <Input
              placeholder="votre mot de passe"
              onChange={(e) => setUserPw(e.target.value)}
            />
            <Button type="submit">Créer mon compte</Button>
            <Link
              className="text-sm text-muted-foreground hover:underline"
              href={"/auth/signin"}
            >
              J'ai déjà un compte
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
