import type { ReactNode } from "react";
import { looksLikeHtml, sanitizeRichHtml } from "./sanitizeHtml";

/**
 * Property descriptions can be in one of two formats:
 *  - New WYSIWYG HTML (from RichTextEditor), sanitized through an allowlist
 *    before it's ever saved, and re-sanitized here as defense-in-depth.
 *  - Legacy "markdown-lite" marker text (**bold**, *italic*, __underline__,
 *    "- " bullets) from before the WYSIWYG editor existed, still rendered to
 *    plain React elements for any descriptions saved before this change.
 */
function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*.+?\*\*|__.+?__|\*.+?\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let tokenIndex = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-${tokenIndex++}`;

    if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("__")) {
      nodes.push(<u key={key}>{token.slice(2, -2)}</u>);
    } else {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function renderRichText(text: string): ReactNode {
  if (!text || !text.trim()) return null;

  if (looksLikeHtml(text)) {
    return <div className="rich-text-html" dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(text) }} />;
  }

  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let bulletBuffer: string[] = [];

  function flushBullets(keyBase: string) {
    if (bulletBuffer.length === 0) return;
    blocks.push(
      <ul key={`ul-${keyBase}`} style={{ margin: "10px 0", paddingLeft: "22px" }}>
        {bulletBuffer.map((item, i) => (
          <li key={`li-${keyBase}-${i}`} style={{ marginBottom: "4px" }}>
            {parseInline(item, `li-${keyBase}-${i}`)}
          </li>
        ))}
      </ul>
    );
    bulletBuffer = [];
  }

  lines.forEach((line, index) => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("- ")) {
      bulletBuffer.push(trimmed.slice(2));
      return;
    }

    flushBullets(String(index));

    if (line.trim().length === 0) {
      blocks.push(<br key={`br-${index}`} />);
    } else {
      blocks.push(
        <span key={`line-${index}`}>
          {parseInline(line, `line-${index}`)}
          <br />
        </span>
      );
    }
  });

  flushBullets("end");

  return blocks;
}
