import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminCredentials, isValidAdminLogin } from "../../../../lib/adminAuth";

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string };
  const username = body.username ?? "";
  const password = body.password ?? "";

  if (!isValidAdminLogin(username, password)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: getAdminCredentials().sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
