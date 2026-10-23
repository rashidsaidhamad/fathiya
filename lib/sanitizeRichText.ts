import sanitizeHtml from "sanitize-html";
import { toRichHtml } from "./richText";

// Only the formatting the admin editor can produce is kept.
const options: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "blockquote", "hr"],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
  },
};

export function sanitizeRichText(value: string | undefined | null) {
  return sanitizeHtml(toRichHtml(value), options);
}
