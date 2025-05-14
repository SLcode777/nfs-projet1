"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/better-auth/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEventHandler, useState } from "react";
import { toast, Toaster } from "sonner";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;
  const router = useRouter();

  const handleSubmitPassword: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password") as string;

    authClient.resetPassword(
      {
        token: token,
        newPassword: newPassword,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          router.push("/auth/signin");
        },
        onError: (ctx: { error: { message: string } }) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  const handleSubmitEmail: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    authClient.forgetPassword(
      {
        email: email,
        redirectTo: "/auth/reset-password",
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          router.push("/auth/signin");
        },
        onError: (ctx: { error: { message: string } }) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Reçois un lien pour réinitialiser ton mot de passe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action="submit"
            onSubmit={handleSubmitEmail}
            className="flex flex-col gap-1"
          >
            <label className="text-sm">Ton email</label>
            <Input placeholder="monmail@mail.com" name="email" type="email" />
            <Button disabled={isLoading}>Recevoir le lien par email</Button>
          </form>
        </CardContent>
        <Toaster />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Definis ton nouveau mot de passe</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          action="submit"
          onSubmit={handleSubmitPassword}
          className="flex flex-col gap-1"
        >
          <label className="text-sm">Nouveau mot de passe</label>
          <Input placeholder="******" name="password" type="password" />
          <Button disabled={isLoading}>Mettre à jour mon mot de passe</Button>
        </form>
      </CardContent>
      <Toaster />
    </Card>
  );
}
