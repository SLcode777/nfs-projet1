"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/better-auth/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

export default function SignupPage() {
  const params = useSearchParams();
  const emailFromParams = params.get("email") ?? "";

  const [userPw, setUserPw] = useState("");
  const [userMail, setUserMail] = useState("");
  const sessionId = 0;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (emailFromParams) setUserMail(emailFromParams);
  }, [emailFromParams]);

  async function handleCustomAuthSubmit(e: React.FormEvent) {
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

  async function handleBetterAuthSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log(
      "user mail in better-auth-submit : : ",
      userMail,
      "user pw in better-auth-submit : : ",
      userPw
    );

    if (!userPw || !userMail) {
      console.error("champs manquants, merci de remplir tous les champs");
      return;
    }

    await authClient.signUp.email(
      {
        email: userMail,
        password: userPw,
        name: "anonyme",
        callbackURL: "/posts",
      },
      {
        onRequest: (ctx) => {
          setIsLoading(true);
          console.log("onRequest context : ", ctx);
          console.log(
            "user mail in onRequest : : ",
            userMail,
            "user pw in onRequest : : ",
            userPw
          );
        },
        onSuccess: (ctx) => {
          setIsLoading(false);
          console.log("onSuccess ctx : ", ctx);
          router.push("/posts");
        },
        onError: (ctx) => {
          setIsLoading(false);
          setIsError(true);
          toast.error(ctx.error.message);
        },
      }
    );
  }

  return (
    <div className="container">
      <div className="text-2xl font-bold mb-2">CREER UN COMPTE</div>
      <hr className="my-8 border-0 h-1 rounded bg-gradient-to-r from-teal-400 to-blue-500" />
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Custom Auth</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleCustomAuthSubmit}
              className="flex flex-col gap-2"
            >
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
        <Card>
          <CardHeader>
            <CardTitle>Better-Auth</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleBetterAuthSubmit}
              className="flex flex-col gap-2"
            >
              <Input
                value={userMail}
                placeholder="votre email"
                onChange={(e) => setUserMail(e.target.value)}
              />
              <Input
                placeholder="votre mot de passe"
                onChange={(e) => setUserPw(e.target.value)}
              />
              {isLoading ? (
                <Button type="submit" className="disabled">
                  Creation du compte en cours...
                </Button>
              ) : (
                <Button type="submit">Créer mon compte</Button>
              )}
              <Link
                className="text-sm text-muted-foreground hover:underline"
                href={"/auth/signin"}
              >
                J'ai déjà un compte
              </Link>
            </form>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    </div>
  );
}
