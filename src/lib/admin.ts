import { cookies } from "next/headers";
import { adminSessionCookieName, verifyAdminToken } from "@/lib/auth";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminSessionCookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAdminToken(token);
    return payload;
  } catch {
    return null;
  }
}
