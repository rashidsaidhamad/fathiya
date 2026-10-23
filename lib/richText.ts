import type { FaqItem } from "./siteContent";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

// Older content was saved as plain text with blank lines between paragraphs.
// Convert it to HTML so it renders the same way and loads cleanly into the editor.
export function toRichHtml(value: string | undefined | null) {
  const text = (value ?? "").trim();
  if (!text) return "";
  if (looksLikeHtml(text)) return text;

  return text
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function isRichHtmlEmpty(value: string | undefined | null) {
  return (value ?? "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length === 0;
}

export function normalizeFaqs(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Partial<FaqItem> => Boolean(item) && typeof item === "object")
    .map((item, index) => ({
      id: typeof item.id === "number" ? item.id : index + 1,
      question: typeof item.question === "string" ? item.question : "",
      answer: typeof item.answer === "string" ? item.answer : "",
    }));
}
