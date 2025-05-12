import { createCookieSession } from "@/lib/cookies";
import { verifyPassword } from "@/lib/hash";
import {
  addNewUser,
  createSession,
  getSessionByUserId,
  searchUserByMail,
} from "@/lib/queries";
import console from "console";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("body in route: ", body);

    //VERIFICATION DES CHAMPS

    if (!body.userMail || !body.userPw) {
      return NextResponse.json(
        { error: "champs requis manquants" },
        { status: 400 }
      );
    }

    const newUser = {
      id: 0,
      sessionId: "",
      email: body.userMail,
      password: body.userPw,
    };

    console.log("newUser avant invocation de prisma", newUser);

    //VERIFICATION DE L'EXISTENCE DE L'UTILISATEUR

    const existingUser = await searchUserByMail(newUser.email);

    console.log("existing User in signup route : ", existingUser);

    if (existingUser) {
      const existingUserPassword = existingUser.searchUser.custompass;

      //IF USER EXISTS CHECK PASSWORD

      const isValidPassword = await verifyPassword(
        newUser.password,
        existingUserPassword
      );

      //IF PASSWORD IS VALID CREATE SESSION AND COOKIE
      if (isValidPassword) {
        const token = nanoid();

        await createSession(
          existingUser.searchUser.id,
          token,
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        );

        await createCookieSession(token);

        return NextResponse.json(
          { message: "connexion réussie !", user: existingUser },
          { status: 200 }
        );
      } else {
        //IF USER EXISTS BUT PASSWORD IS NOT VALID REDIRECT TO SIGNIN AND ASK FOR PASSWORD AGAIN
        return NextResponse.json(
          {
            error:
              "User already exist but password is incorrect. Redirection to signin page... ",
          },
          { status: 409 }
        );
      }
    } else {
      //IF USER DOES NOT EXIST CREATE NEW USER

      await addNewUser(newUser);

      console.log("utilisateur créé dans la Database !", newUser);

      //GET NEWLY CREATED USER ID

      const newlyCreatedUser = await searchUserByMail(newUser.email);

      const newlyCreatedUserId = newlyCreatedUser?.searchUser.id;

      if (newlyCreatedUserId) {
        //CREATE SESSION AND COOKIE

        const session = await getSessionByUserId(newlyCreatedUserId);

        console.log("session recupérée dans route signup : ", session);

        if (session) {
          const token = session?.token;

          console.log("token dans route signup: ", token);

          const cookie = await createCookieSession(token);

          console.log("cookie dans route signup: ", cookie);

          return NextResponse.json(cookie, { status: 201 });
        }
      }

      return NextResponse.json(newUser, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "erreur serveur lors de la création de l utilisateur",
      },
      { status: 500 }
    );
  }
}
