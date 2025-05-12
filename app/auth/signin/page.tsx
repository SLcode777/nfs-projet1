"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/better-auth/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";

export default function SigninPage() {
  const params = useSearchParams();
  const emailFromParams = params.get("email") ?? "";

  const [userPw, setUserPw] = useState("");
  const [userMail, setUserMail] = useState("");
  const sessionId = 0;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // const { data: session } = await authClient.getSession();
  // const betterUser = session?.user.email;

  // console.log(customUser);

  // if (customUser || betterUser) {
  //   throw redirect("/posts");
  // }

  useEffect(() => {
    if (emailFromParams) {
      setUserMail(emailFromParams);
    } else return;
  }, [emailFromParams]);

  const handleCustomAuthSubmit = async (e: React.FormEvent) => {
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

    await authClient.signIn.email(
      {
        email: userMail,
        password: userPw,
        callbackURL: "/posts",
      },
      {
        onRequest: (ctx) => {
          setIsLoading(true);
        },
        onSuccess: (ctx) => {
          router.push("/posts");
        },
        onError: (ctx) => {
          setIsLoading(false);
          setIsError(true);
          alert(ctx.error.message);
        },
      }
    );
  }

  const handleMagicLinkSignIn: FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    authClient.signIn.magicLink(
      {
        email,
        callbackURL: "/posts",
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          router.push("/verify");
        },
        onerror: (ctx: { error: { message: string } }) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div className="container">
      <div className="text-2xl font-bold mb-2">SE CONNECTER</div>
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
        <Card>
          <CardHeader>
            <CardTitle>Better-Auth with Magic Link</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-2"
              onSubmit={handleMagicLinkSignIn}
            >
              <Input
                type="firstname"
                name="firstname"
                placeholder="votre prénom"
              />
              <Input type="email" name="email" placeholder="votre email" />
              <Button>Se connecter avec Magic Link</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
