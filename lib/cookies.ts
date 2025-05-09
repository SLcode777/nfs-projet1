import { cookies } from "next/headers";

export async function createCookieSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "token",
    value: token,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  console.log("cookie created : ", cookieStore.get("token"));
  return cookieStore;
}

export async function deleteCookieSession() {
  const cookieStore = await cookies();
  cookieStore.delete({
    name: "token",
  });

  console.log("cookie session has been deleted !");
  return cookieStore;
}
