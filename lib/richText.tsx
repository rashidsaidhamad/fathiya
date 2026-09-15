import type { ReactNode } from "react";

/**
 * Minimal "markdown-lite" formatting used by the property description field:
 *   **bold**, *italic*, __underline__, and "- " bullet lines.
 * Deliberately renders to React elements (never dangerouslySetInnerHTML), so
 * arbitrary HTML typed by an editor can never execute as markup.
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
