import bcrypt from "bcryptjs";

export const adminUsername = process.env.ADMIN_USERNAME ?? "admin";

export async function validateAdminPassword(password: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD ?? "admin123456";

  if (configuredPassword.startsWith("$2")) {
    return bcrypt.compare(password, configuredPassword);
  }

  return password === configuredPassword;
}
