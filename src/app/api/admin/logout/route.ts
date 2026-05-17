import { cookies } from "next/headers";
import { adminSessionCookieName } from "@/lib/auth";
import { jsonSuccess } from "@/lib/responses";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(adminSessionCookieName);
  return jsonSuccess({ loggedOut: true });
}
