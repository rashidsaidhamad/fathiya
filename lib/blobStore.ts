import { getStore } from "@netlify/blobs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.join(process.cwd(), "data");

function localJsonPath(key: string) {
  return path.join(dataDir, `${key}.json`);
}

function getBlobStore(storeName: string) {
  try {
    return getStore(storeName);
  } catch {
    return null;
  }
}

export function isBlobStoreAvailable(storeName: string) {
  return getBlobStore(storeName) !== null;
}

export async function readJsonBlob<T>(storeName: string, key: string): Promise<T | null> {
  const store = getBlobStore(storeName);
  if (store) {
    const value = await store.get(key, { type: "json" });
    return (value as T | null) ?? null;
  }

  try {
    const raw = await readFile(localJsonPath(key), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function writeJsonBlob(storeName: string, key: string, value: unknown): Promise<void> {
  const store = getBlobStore(storeName);
  if (store) {
    await store.setJSON(key, value);
    return;
  }

  await mkdir(dataDir, { recursive: true });
  await writeFile(localJsonPath(key), JSON.stringify(value, null, 2), "utf8");
}

export async function readBinaryBlob(
  storeName: string,
  key: string,
): Promise<{ data: ArrayBuffer; metadata: Record<string, string> } | null> {
  const store = getBlobStore(storeName);
  if (!store) return null;

  const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
  if (!result) return null;

  return { data: result.data, metadata: result.metadata as Record<string, string> };
}

export async function writeBinaryBlob(
  storeName: string,
  key: string,
  data: Buffer,
  metadata: Record<string, string>,
): Promise<void> {
  const store = getBlobStore(storeName);
  if (!store) {
    throw new Error("Blob storage is not available in this environment");
  }

  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
  await store.set(key, arrayBuffer, { metadata });
}
