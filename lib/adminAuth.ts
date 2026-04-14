import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "arch_admin_session";

const defaultCreds = {
  username: "admin",
  password: "change-me-now",
  sessionToken: "change-me-now",
};

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? defaultCreds.username,
    password: process.env.ADMIN_PASSWORD ?? defaultCreds.password,
    sessionToken: process.env.ADMIN_SESSION_TOKEN ?? defaultCreds.sessionToken,
  };
}

export function isValidAdminLogin(username: string, password: string) {
  const creds = getAdminCredentials();
  return username === creds.username && password === creds.password;
}

export function isAdminRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return token === getAdminCredentials().sessionToken;
}
