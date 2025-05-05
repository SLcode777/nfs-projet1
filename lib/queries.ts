import { hashPassword } from "./hash";
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

//CHERCHER UN UTILISATEUR PAR SON EMAIL

export async function searchUserByMail(mailToFind: string) {
  const searchUser = await prisma.user.findUnique({
    where: {
      email: mailToFind,
    },
    select: {
      email: true,
      password: true,
    },
  });

  if (!searchUser) {
    console.log("this user does not exist");
    return;
  }

  return { searchUser };
}

//AJOUTER UN NOUVEL UTILISATEUR

export type NewUserType = {
  sessionId: number;
  email: string;
  password: string;
};

export async function addNewUser(user: NewUserType) {
  const hashedPassword = await hashPassword(user.password);

  const newUser = await prisma.user.create({
    data: {
      sessionId: 0,
      email: user.email,
      password: hashedPassword,
    },
  });

  console.log("new user dans prisma query : ", newUser);
}
