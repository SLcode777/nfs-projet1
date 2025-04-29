import { addNewComment } from "@/lib/queries";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("body in route: ", body);

    if (!body.email || !body.name || !body.content) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    const newComment = {
      email: body.email,
      name: body.name,
      content: body.content,
      postId: body.postId,
    };

    addNewComment(newComment);

    console.log("json body request ", body);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "erreur serveur" });
  }
}
