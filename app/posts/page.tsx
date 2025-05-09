import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BetterLogoutButton } from "@/components/ui/logout-button";
import { CustomLogoutButton } from "@/components/ui/logout-button-custom";
import { getBetterAuthSession } from "@/lib/better-auth/getBetterUser";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Link from "next/link";
import { getAllPosts } from "../../lib/queries";

const posts = await getAllPosts();

console.log("liste des posts : ", posts);

export default async function BlogPage() {
  const customUser = await getCurrentUser();
  console.log("customUser : ", customUser);

  const session = await getBetterAuthSession();
  const betterUser = session?.email;
  console.log("betterUser : ", betterUser);

  // if (!customUser || !betterUser) {
  //   throw redirect("/auth/signin");
  // }

  return (
    <div className="container">
      <div className="flex flex-row justify-between">
        <div className="text-2xl font-bold mb-2">Welcome to my blog</div>
        <div className="flex flex-col">
          <div>Hello, custom user : {customUser?.email}</div>
          <div>Hello, betterauth user : {betterUser} </div>
          <div className="flex flex-row justify-end">
            {customUser ? <CustomLogoutButton /> : <BetterLogoutButton />}
          </div>
        </div>
      </div>
      <hr className="my-8 border-0 h-1 rounded bg-gradient-to-r from-teal-400 to-blue-500" />
      <Card>
        <CardHeader>
          <CardTitle>Liste des posts</CardTitle>
        </CardHeader>

        <CardContent>
          {posts ? (
            <ul className="flex flex-col gap-3">
              {posts.map((post) => (
                <li
                  key={post.id}
                  className="border border-accent rounded-lg p-4 shadow"
                >
                  <Link href={`/posts/${post.slug}`}>
                    <div>
                      <div className="text-lg font-bold">{post.title}</div>
                      <div className="flex flex-row text-xs text-foreground/35 gap-2">
                        <div>{post.createdAt.toLocaleDateString()}</div>
                        <div>-</div>
                        <div>{post._count.comments} commentaires</div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            "Aucun post plublié ! reviens plus tard :)"
          )}
        </CardContent>
      </Card>
    </div>
  );
}
