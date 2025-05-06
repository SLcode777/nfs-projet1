import { verifyPassword } from "@/lib/hash";
import { searchUserByMail } from "@/lib/queries";
import console from "console";
import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/queries";
import { createCookieSession } from "@/lib/cookies";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userMail, userPw } = body;

    console.log("body in route: ", body);
    console.log("userMail in body in signin route : ", body.userMail);

    const existingUser = await searchUserByMail(userMail);

    console.log("existing User : ", existingUser);

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "User does not exist",
        },
        { status: 404 }
      );
    }

    const passwordMatch = await verifyPassword(
      userPw,
      existingUser.searchUser.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    const token = nanoid();

    await createSession(existingUser.searchUser.id, token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    await createCookieSession(token);

    return NextResponse.json({
      message: "connexion reussie",
      user: existingUser,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "erreur serveur lors de la connexion de l utilisateur",
      },
      { status: 500 }
    );
  }
}
