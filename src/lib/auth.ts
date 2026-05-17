import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "card_admin_session";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET 未配置");
  }

  return new TextEncoder().encode(secret);
};

export const adminSessionCookieName = SESSION_COOKIE;

export async function createAdminToken(username: string) {
  return new SignJWT({ username, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string) {
  const verified = await jwtVerify(token, getJwtSecret());
  return verified.payload;
}
