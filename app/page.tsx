import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <div className="text-2xl font-bold mb-2">THIS IS MY NFS-PROJET1 APP</div>
      <hr className="mb-10 border-0 h-0.5 rounded bg-gradient-to-r from-purple-700 to-blue-500" />
      <Button className="w-full">
        <Link href={"/auth/signin"}>Se connecter</Link>
      </Button>
    </div>
  );
}
