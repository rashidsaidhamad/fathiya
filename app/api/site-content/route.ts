import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "../../../lib/contentStore";
import type { SiteContent } from "../../../lib/siteContent";
import { isAdminRequest } from "../../../lib/adminAuth";
import type { NextRequest } from "next/server";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SiteContent;
  const saved = await saveSiteContent(body);
  return NextResponse.json(saved);
}
