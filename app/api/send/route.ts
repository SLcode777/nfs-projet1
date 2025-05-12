//ROUTE CREATED TO TEST IF RESEND IS WORKING PROPERLY

import { EmailTemplate } from "@/components/magic-link-email-template";
import { NextRequest } from "next/server";
import React from "react";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.data.email;
    const firstname = "body.data.firstname";
    console.log("body in send route : ", body);
    console.log("email in send route : ", email);

    const { data, error } = await resend.emails.send({
      from: "TestResend <onboarding@resend.dev>",
      to: email,
      subject: "Hello world !!",
      react: React.createElement(EmailTemplate, { firstName: firstname }),
    });

    console.log("data in send route : ", data);

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
