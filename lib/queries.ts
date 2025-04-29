import prisma from "./prisma";

export async function getAllPosts() {
  const postsList = await prisma.post.findMany({
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return postsList;
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug: slug,
    },
    include: {
      comments: true,
    },
  });
  return post;
}

export async function getCommentByPostSlug(slug: string) {
  const post = await getPostBySlug(slug);
  const id = post?.id;

  const comments = await prisma.comment.findMany({
    where: {
      postId: id,
    },
  });

  return comments;
}
