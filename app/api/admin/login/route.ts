import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminCredentials, isAdminSecurityConfigured } from "../../../../lib/adminAuth";
import { verifyAdminPassword } from "../../../../lib/adminPasswordStore";

export async function POST(request: Request) {
  if (!isAdminSecurityConfigured()) {
    return NextResponse.json(
      { error: "Admin security is not configured for production. Set secure admin environment variables." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { username?: string; password?: string };
  const username = body.username ?? "";
  const password = body.password ?? "";
  const creds = getAdminCredentials();
  const passwordValid = await verifyAdminPassword(password);

  if (username !== creds.username || !passwordValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: creds.sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
