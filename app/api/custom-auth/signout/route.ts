import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  console.log("cookie will be deleted : ", token);

  if (token) {
    await prisma.session.deleteMany({
      where: { token },
    });
  }

  const res = NextResponse.json({ message: "custom session disconnected ! " });
  res.cookies.set("token", "", { maxAge: 0 });

  return res;
}
