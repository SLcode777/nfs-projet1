import {
  inferAdditionalFields,
  magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000",
  plugins: [magicLinkClient(), inferAdditionalFields<typeof auth>()],
});

// const { data, error } = await authClient.forgetPassword({
//   email: "test@example.com",
//   redirectTo: "/reset-password",
// });

// const token = new URLSearchParams(window.location.search).get("token");
// if (!token) {
//   // Handle the error
// }
// const { data, error } = await authClient.resetPassword({
//   newPassword: "password1234",
//   token,
// });
