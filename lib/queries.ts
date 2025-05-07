import { randomUUID } from "crypto";
import { nanoid } from "nanoid";
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
      custompass: true,
      id: true,
      sessions: true,
    },
  });

  if (!searchUser) {
    console.log("this user does not exist");
    return;
  }

  return { searchUser };
}

// CREATE SESSION

export type SessionType = {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
};

export async function createSession(
  userId: string,
  token: string,
  expiresAt: Date
) {
  const newSession = await prisma.session.create({
    data: {
      id: randomUUID(),
      userId: userId,
      token: token,
      expiresAt: expiresAt,
      updatedAt: new Date(),
    },
  });

  console.log("new session created : ", newSession);
  return newSession;
}

//AJOUTER UN NOUVEL UTILISATEUR

export type NewUserType = {
  email: string;
  password: string;
};

export async function addNewUser(user: NewUserType) {
  const token = nanoid();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const newUser = await prisma.user.create({
    data: {
      id: randomUUID(),
      email: user.email,
      custompass: user.password,
      name: "anonyme",
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      sessions: {
        create: {
          token: token,
          expiresAt: expiresAt,
          createdAt: new Date(),
          id: randomUUID(),
          updatedAt: new Date(),
          ipAddress: null,
          userAgent: null,
        },
      },
    },
  });

  console.log("new user dans prisma query : ", newUser);

  return newUser;
}

//RECUPERER LA SESSION D'UN UTILISATEUR

export async function getSessionByUserId(userId: string) {
  const session = await prisma.session.findFirst({
    where: {
      userId: userId,
      expiresAt: {
        gte: new Date(),
      },
    },
    select: {
      token: true,
    },
  });

  return session;
}
