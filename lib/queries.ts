import prisma from "./prisma";


//RECUPERER TOUS LES POSTS CLASSES PAR DATE DECROISSANTE

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

//RECUPERER UN POST EN FONCTION DU SLUG

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

//RECUPERER TOUS LES COMMENTAIRES ASSOCIES A UN ID DE POST

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


//AJOUTER UN NOUVEAU COMMENTAIRE 

export type NewCommentType = {
  email: string;
  name: string;
  content: string;
  postId: number;
};

export async function addNewComment(comment: NewCommentType) {
  const newPost = await prisma.comment.create({
    data: {
      email: comment.email,
      name: comment.name,
      content: comment.content,
      postId: comment.postId,
    },
  });

  console.log("new comment created : ", newPost);
}
