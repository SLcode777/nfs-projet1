import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { PrismaClient } from "../generated/prisma";
import { resend } from "../resend";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "magic link",
          text: `Hello, click here to validate your login : ${url}`,
        });
      },
    }),
    nextCookies(),
  ],
});
