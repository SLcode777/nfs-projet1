import { verifyPassword } from "@/lib/hash";
import { addNewUser, searchUserByMail } from "@/lib/queries";
import console from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("body in route: ", body);

    if (!body.userMail || !body.userPw) {
      return NextResponse.json(
        { error: "champs requis manquants" },
        { status: 400 }
      );
    }

    const newUser = {
      sessionId: 0,
      email: body.userMail,
      password: body.userPw,
    };

    console.log("newUser avant invocation de prisma", newUser);

    const existingUser = await searchUserByMail(newUser.email);

    console.log("existing User : ", existingUser);

    if (existingUser) {
      const existingUserPassword = existingUser?.searchUser.password;

      const isValidPassword = await verifyPassword(
        newUser.password,
        existingUserPassword
      );

      if (isValidPassword) {
        return NextResponse.json(
          { message: "connexion réussie !", user: existingUser },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            error:
              "User already exist but password is incorrect. Redirection to signin page... ",
          },
          { status: 409 }
        );
      }
    } else {
      addNewUser(newUser);
      console.log("utilisateur créé dans la Database !", newUser);
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
