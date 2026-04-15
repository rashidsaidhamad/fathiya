import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "../../../../lib/adminAuth";
import { updateAdminPassword, verifyAdminPassword } from "../../../../lib/adminPasswordStore";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    currentPassword?: string;
    newPassword?: string;
  };

  const currentPassword = (body.currentPassword ?? "").trim();
  const newPassword = (body.newPassword ?? "").trim();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
  }

  const currentPasswordValid = await verifyAdminPassword(currentPassword);
  if (!currentPasswordValid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  await updateAdminPassword(newPassword);
  return NextResponse.json({ ok: true });
}
