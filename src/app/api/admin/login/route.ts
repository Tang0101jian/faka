import { cookies } from "next/headers";
import { z } from "zod";
import { createAdminToken, adminSessionCookieName } from "@/lib/auth";
import { adminUsername, validateAdminPassword } from "@/lib/env";
import { jsonError, jsonSuccess } from "@/lib/responses";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return jsonError("登录参数无效");
  }

  const { username, password } = parsed.data;

  if (username !== adminUsername) {
    return jsonError("账号或密码错误", 401);
  }

  const passwordValid = await validateAdminPassword(password);

  if (!passwordValid) {
    return jsonError("账号或密码错误", 401);
  }

  const token = await createAdminToken(username);
  const cookieStore = await cookies();

  cookieStore.set(adminSessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return jsonSuccess({ username });
}
