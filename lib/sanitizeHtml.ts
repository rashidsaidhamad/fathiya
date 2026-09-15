/**
 * Dependency-free allowlist HTML sanitizer for the property description
 * WYSIWYG field. Runs both in the browser (cleaning editor output before it
 * is saved) and on the server (defensive re-sanitize right before render),
 * so no dependency on DOMParser/jsdom is needed either side.
 *
 * Only a small set of formatting tags survive; every attribute is stripped
 * except a validated `href` on `<a>`. Anything else (scripts, styles,
 * iframes, event handlers, inline styles, images...) is removed. Disallowed
 * tags are unwrapped rather than deleted, so their text content is kept.
 */

const ALLOWED_TAGS = new Set(["b", "strong", "i", "em", "u", "ul", "ol", "li", "br", "p", "a"]);
const SAFE_URL_SCHEME = /^(https?:|mailto:|tel:)/i;

function extractHref(attrs: string): string {
  const match = attrs.match(/href\s*=\s*"([^"]*)"/i) ?? attrs.match(/href\s*=\s*'([^']*)'/i);
  if (!match) return "";
  const href = match[1].trim();
  return SAFE_URL_SCHEME.test(href) ? href : "";
}

export function sanitizeRichHtml(html: string): string {
  if (!html) return "";

  let out = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed|form|svg|noscript)[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|svg|noscript|img|input|button|meta|link|source|track)[^>]*\/?>/gi, "")
    .replace(/<div(\s[^>]*)?>/gi, "<p>")
    .replace(/<\/div>/gi, "</p>");

  out = out.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g, (match, tagRaw: string, attrs: string) => {
    const tag = tagRaw.toLowerCase();
    const isClosing = match.startsWith("</");

    if (!ALLOWED_TAGS.has(tag)) return "";
    if (isClosing) return `</${tag}>`;
    if (tag === "br") return "<br>";

    if (tag === "a") {
      const href = extractHref(attrs);
      return href ? `<a href="${href.replace(/"/g, "&quot;")}" target="_blank" rel="noreferrer">` : "<a>";
    }

    return `<${tag}>`;
  });

  return out;
}

/** True if the string looks like it contains any markup at all (vs. legacy plain/marker text). */
export function looksLikeHtml(text: string): boolean {
  return /<\/?[a-zA-Z][^>]*>/.test(text);
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inlineMarkersToHtml(text: string): string {
  return escapeHtml(text).replace(/(\*\*.+?\*\*|__.+?__|\*.+?\*)/g, (token) => {
    if (token.startsWith("**")) return `<strong>${token.slice(2, -2)}</strong>`;
    if (token.startsWith("__")) return `<u>${token.slice(2, -2)}</u>`;
    return `<em>${token.slice(1, -1)}</em>`;
  });
}

/**
 * Converts legacy "markdown-lite" marker text (**bold**, *italic*,
 * __underline__, "- " bullets, plain newlines) into the equivalent safe
 * HTML, so descriptions saved before the WYSIWYG editor existed still show
 * their real line breaks and formatting instead of literal asterisks the
 * first time they're opened in it.
 */
export function legacyTextToHtml(text: string): string {
  if (!text) return "";

  const lines = text.split("\n");
  const blocks: string[] = [];
  let bulletBuffer: string[] = [];

  function flushBullets() {
    if (bulletBuffer.length === 0) return;
    blocks.push(`<ul>${bulletBuffer.map((item) => `<li>${inlineMarkersToHtml(item)}</li>`).join("")}</ul>`);
    bulletBuffer = [];
  }

  lines.forEach((line) => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("- ")) {
      bulletBuffer.push(trimmed.slice(2));
      return;
    }

    flushBullets();

    if (line.trim().length === 0) {
      blocks.push("<p><br></p>");
    } else {
      blocks.push(`<p>${inlineMarkersToHtml(line)}</p>`);
    }
  });

  flushBullets();

  return blocks.join("");
}
