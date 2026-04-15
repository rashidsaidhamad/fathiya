import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { getAdminCredentials } from "./adminAuth";

type StoredAdminCredentials = {
  username: string;
  passwordHash: string;
  passwordSalt: string;
  updatedAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const adminCredentialsPath = path.join(dataDir, "admin-credentials.json");
const keyLength = 64;

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, keyLength).toString("hex");
}

async function readStoredAdminCredentials(): Promise<StoredAdminCredentials | null> {
  try {
    const raw = await readFile(adminCredentialsPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<StoredAdminCredentials>;

    if (
      typeof parsed.username !== "string" ||
      typeof parsed.passwordHash !== "string" ||
      typeof parsed.passwordSalt !== "string"
    ) {
      return null;
    }

    return {
      username: parsed.username,
      passwordHash: parsed.passwordHash,
      passwordSalt: parsed.passwordSalt,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function writeStoredAdminCredentials(record: StoredAdminCredentials) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(adminCredentialsPath, JSON.stringify(record, null, 2), "utf8");
}

export async function verifyAdminPassword(password: string) {
  const stored = await readStoredAdminCredentials();

  if (!stored) {
    return password === getAdminCredentials().password;
  }

  const expected = Buffer.from(stored.passwordHash, "hex");
  const actual = Buffer.from(hashPassword(password, stored.passwordSalt), "hex");

  if (expected.length !== actual.length) {
    return false;
  }

  return timingSafeEqual(expected, actual);
}

export async function updateAdminPassword(newPassword: string) {
  const username = getAdminCredentials().username;
  const salt = randomBytes(16).toString("hex");
  const passwordHash = hashPassword(newPassword, salt);

  const record: StoredAdminCredentials = {
    username,
    passwordHash,
    passwordSalt: salt,
    updatedAt: new Date().toISOString(),
  };

  await writeStoredAdminCredentials(record);
}
