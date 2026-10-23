import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent } from "../../../lib/contentStore";
import type { SiteContent } from "../../../lib/siteContent";
import { isAdminRequest } from "../../../lib/adminAuth";
import type { NextRequest } from "next/server";
import { sanitizeRichText } from "../../../lib/sanitizeRichText";
import { normalizeFaqs } from "../../../lib/richText";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SiteContent;
  const saved = await saveSiteContent({
    ...body,
    properties: (body.properties ?? []).map((item) => ({
      ...item,
      description: sanitizeRichText(item.description),
      faqs: normalizeFaqs(item.faqs),
    })),
    companyFaqSection: {
      title: typeof body.companyFaqSection?.title === "string" ? body.companyFaqSection.title : "",
      description: typeof body.companyFaqSection?.description === "string" ? body.companyFaqSection.description : "",
      items: normalizeFaqs(body.companyFaqSection?.items),
    },
    articles: (body.articles ?? []).map((item) => ({
      ...item,
      content: sanitizeRichText(item.content),
      faqs: normalizeFaqs(item.faqs),
    })),
  });
  return NextResponse.json(saved);
}
