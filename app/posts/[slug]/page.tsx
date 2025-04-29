import { NewCommentForm } from "@/components/new-comment-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCommentByPostSlug, getPostBySlug } from "@/lib/queries";
import Link from "next/link";

type PostPageProps = {
  params: { slug: string };
};

export default async function PostPage({ params }: PostPageProps) {
  const slug = await params.slug;
  console.log("slug : ", slug);

  const post = await getPostBySlug(slug);
  console.log("post", post);
  console.log("post id", post?.id);

  const comments = await getCommentByPostSlug(slug);

  return (
    <div className="container">
      <div className="text-2xl font-bold mb-2">
        {post?.title} & {post?.id}
      </div>
      <hr className="mb-10 border-0 h-0.5 rounded bg-gradient-to-r from-purple-700 to-blue-500" />
      <div className="flex flex-row gap-2 justify-end mb-2 text-sm px-2 text-gray-500">
        <div>Publié le : </div>
        <div>{post?.createdAt?.toLocaleDateString()}</div>
      </div>
      <Card className="mb-10">
        <CardContent>{post?.content}</CardContent>
      </Card>
      <div className="mb-10">
        <p className="text-xl mb-4">Commentaires</p>
        {comments.map((comment) => (
          <Card key={comment.id} className="mb-2">
            <CardHeader>
              <CardTitle>{comment.name}</CardTitle>
            </CardHeader>
            <CardContent>{comment.content}</CardContent>
          </Card>
        ))}
      </div>
      {post ? <NewCommentForm postId={post.id} /> : <p>erreur</p>}
      <Button className="w-full" variant={"secondary"}>
        <Link href={"/posts"}>Back </Link>
      </Button>
    </div>
  );
}
