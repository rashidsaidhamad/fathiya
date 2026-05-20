import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { addContactSubmission, getContactSubmissions } from "../../../lib/contentStore";
import type { ContactSubmission } from "../../../lib/siteContent";
import { isAdminRequest } from "../../../lib/adminAuth";
import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";

const COMPANY_EMAIL = process.env.NOTIFY_EMAIL || process.env.COMPANY_EMAIL || "archipelagoproperties.zanzibar@gmail.com";

function isValidEmail(value?: string): value is string {
  return typeof value === "string" && /^\S+@\S+\.\S+$/.test(value);
}

type EmailRoutingInfo = {
  to: string;
  from: string;
  replyTo?: string;
  sent: boolean;
};

function getEmailRoutingInfo(submission: ContactSubmission, recipientEmail?: string): Omit<EmailRoutingInfo, "sent"> {
  const smtpUser = process.env.SMTP_USER;
  const smtpFromAddress = process.env.SMTP_FROM || process.env.SMTP_FROM_EMAIL || smtpUser || "SMTP not configured";
  const clientEmail = submission.email.includes("@") ? submission.email : undefined;
  const fromAddress = clientEmail
    ? `"${submission.name} via Archipelago Website" <${smtpFromAddress}>`
    : smtpFromAddress;
  const replyToAddress = clientEmail;
  return {
    to: isValidEmail(recipientEmail) ? recipientEmail : COMPANY_EMAIL,
    from: fromAddress,
    replyTo: replyToAddress,
  };
}

async function sendContactNotification(submission: ContactSubmission, recipientEmail?: string): Promise<EmailRoutingInfo> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const routing = getEmailRoutingInfo(submission, recipientEmail);

  if (!smtpHost || !smtpUser || !smtpPass) {
    return {
      ...routing,
      sent: false,
    };
  }

  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const hearAboutLine = submission.hearAboutUs.length > 0 ? submission.hearAboutUs.join(", ") : "-";

  await transport.sendMail({
    from: routing.from,
    to: routing.to,
    replyTo: routing.replyTo,
    subject: `New contact submission (${submission.source})`,
    text: [
      `Source: ${submission.source}`,
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      `Phone: ${submission.phone || "-"}`,
      `How did you hear about us: ${hearAboutLine}`,
      "",
      "Message:",
      submission.message,
    ].join("\n"),
  });

  return {
    ...routing,
    sent: true,
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getContactSubmissions();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  let data: {
    source?: "home" | "contact" | "company";
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    hearAboutUs?: string[];
    recipientEmail?: string;
  };

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    data = (await request.json()) as typeof data;
  } else {
    const formData = await request.formData();
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const derivedName = [firstName, lastName].filter(Boolean).join(" ");

    data = {
      source: (formData.get("source") as "home" | "contact" | "company") ?? "company",
      name: String(formData.get("name") ?? derivedName),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
      hearAboutUs: formData.getAll("hearAboutUs").map((item) => String(item).trim()).filter(Boolean),
      recipientEmail: String(formData.get("recipientEmail") ?? ""),
    };
  }

  const cleanHearAboutUs = Array.isArray(data.hearAboutUs)
    ? data.hearAboutUs.map((item) => String(item).trim()).filter(Boolean)
    : [];

  const isHearAboutOnlySubmission =
    cleanHearAboutUs.length > 0 &&
    !String(data.name ?? "").trim() &&
    !String(data.email ?? "").trim() &&
    !String(data.message ?? "").trim();

  if (isHearAboutOnlySubmission) {
    data = {
      ...data,
      source: data.source ?? "contact",
      name: "Website Visitor",
      email: "visitor@local",
      message: "How did you hear about us submission",
      hearAboutUs: cleanHearAboutUs,
    };
  }

  if (!data.name || !data.email || !data.message) {
    return NextResponse.json({ error: "name, email and message are required" }, { status: 400 });
  }

  const submission: ContactSubmission = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    source: data.source ?? "home",
    name: data.name,
    email: data.email,
    phone: data.phone ?? "",
    message: data.message,
    hearAboutUs: cleanHearAboutUs,
  };

  await addContactSubmission(submission);
  let emailRouting: EmailRoutingInfo = {
    ...getEmailRoutingInfo(submission, data.recipientEmail),
    sent: false,
  };

  try {
    emailRouting = await sendContactNotification(submission, data.recipientEmail);
  } catch (error) {
    console.error("Failed to send contact notification email", error);
  }
  return NextResponse.json({ ok: true, submission, emailRouting }, { status: 201 });
}
