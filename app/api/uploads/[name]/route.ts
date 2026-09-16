import { NextResponse } from "next/server";
import { readBinaryBlob } from "../../../../lib/blobStore";

const UPLOADS_STORE = "site-uploads";

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const blob = await readBinaryBlob(UPLOADS_STORE, name);

  if (!blob) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(blob.data, {
    headers: {
      "Content-Type": blob.metadata.contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
