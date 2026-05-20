import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "../../../../lib/adminAuth";

function sanitizeBaseName(fileName: string) {
  const base = path.basename(fileName, path.extname(fileName));
  return base
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "asset";
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const fileEntry = formData.get("file");

    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const isImage = fileEntry.type.startsWith("image/");
    const isVideo = fileEntry.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: "Only image or video files are allowed" }, { status: 400 });
    }

    const maxBytes = isVideo ? 200 * 1024 * 1024 : 10 * 1024 * 1024;
    if (fileEntry.size > maxBytes) {
      return NextResponse.json(
        { error: isVideo ? "Video too large (max 200MB)" : "Image too large (max 10MB)" },
        { status: 400 },
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const extension = path.extname(fileEntry.name) || (isVideo ? ".mp4" : ".jpg");
    const base = sanitizeBaseName(fileEntry.name);
    const uniqueName = `${Date.now()}-${base}${extension}`;
    const targetPath = path.join(uploadsDir, uniqueName);

    const buffer = Buffer.from(await fileEntry.arrayBuffer());
    await writeFile(targetPath, buffer);

    return NextResponse.json({
      url: `/uploads/${uniqueName}`,
      contentType: fileEntry.type,
      size: fileEntry.size,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[upload] Error:", message);
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
