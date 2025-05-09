import { Button } from "@/components/ui/button";
import { getBetterAuthSession } from "@/lib/better-auth/getBetterUser";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Link from "next/link";

export default async function Home() {
  //get session info with betterauth

  const currentBetterUser = await getBetterAuthSession();
  console.log("session info : ", currentBetterUser);

  //get session info with custom code

  const currentUser = await getCurrentUser();
  console.log("getSessionByToken : ", currentUser);

  return (
    <div className="container">
      <div className="flex flex-row justify-between">
        <div className="text-2xl font-bold mb-2">
          THIS IS MY NFS-PROJET1 APP
        </div>
        <div className="flex flex-col">
          <div>Hello, custom user : {currentUser?.email}</div>
          <div>Hello, betterauth user : {currentBetterUser?.email} </div>
        </div>
      </div>
      <hr className="mb-10 border-0 h-0.5 rounded bg-gradient-to-r from-purple-700 to-blue-500" />
      <div className="flex flex-col gap-4">
        <Button className="w-full">
          <Link href={"/posts"}>Voir les posts</Link>
        </Button>{" "}
        <Button className="w-full" variant="outline">
          <Link href={"/auth/signin"}>Se connecter</Link>
        </Button>
      </div>
    </div>
  );
}
