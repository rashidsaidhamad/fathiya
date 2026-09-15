"use client";

import { useEffect, useRef } from "react";
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaLink, FaEraser } from "react-icons/fa";
import { legacyTextToHtml, looksLikeHtml, sanitizeRichHtml } from "../../lib/sanitizeHtml";

/** Legacy marker text needs converting to real HTML; anything already HTML just gets sanitized. */
function toEditableHtml(value: string): string {
  if (!value) return "";
  return looksLikeHtml(value) ? sanitizeRichHtml(value) : legacyTextToHtml(value);
}

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
};

export default function RichTextEditor({ value, onChange, rows = 4, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  // The HTML we last reported to the parent. Lets us tell "the parent changed
  // `value` from outside" (e.g. switching to a different property) apart from
  // "we just emitted this ourselves" (a keystroke), so typing never gets its
  // cursor reset by re-writing innerHTML on every render. Starts as `null`
  // (which can never equal a string `value`) so the very first effect run
  // always populates the editor from the initial prop.
  const lastEmittedRef = useRef<string | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (value !== lastEmittedRef.current) {
      editor.innerHTML = toEditableHtml(value);
      lastEmittedRef.current = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function emitChange() {
    const editor = editorRef.current;
    if (!editor) return;
    const cleaned = sanitizeRichHtml(editor.innerHTML);
    lastEmittedRef.current = cleaned;
    onChange(cleaned);
  }

  function exec(command: string, arg?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    emitChange();
  }

  function handleLink() {
    editorRef.current?.focus();
    const url = window.prompt("Link URL (https://, mailto:, or tel:)", "https://");
    if (!url || !url.trim()) return;
    exec("createLink", url.trim());
  }

  const buttons = [
    { label: "Bold", icon: <FaBold size={12} />, action: () => exec("bold") },
    { label: "Italic", icon: <FaItalic size={12} />, action: () => exec("italic") },
    { label: "Underline", icon: <FaUnderline size={12} />, action: () => exec("underline") },
    { label: "Bullet list", icon: <FaListUl size={12} />, action: () => exec("insertUnorderedList") },
    { label: "Numbered list", icon: <FaListOl size={12} />, action: () => exec("insertOrderedList") },
    { label: "Link", icon: <FaLink size={12} />, action: handleLink },
    { label: "Clear formatting", icon: <FaEraser size={12} />, action: () => exec("removeFormat") },
  ];

  const minHeight = Math.max(96, rows * 24);

  return (
    <div style={{ border: "1px solid #d1d5db", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb", flexWrap: "wrap" }}>
        {buttons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            // Keep focus (and the live selection) inside the editor instead of
            // letting the browser's default mousedown behavior move it to the
            // button — without this, execCommand acts on the wrong (or no)
            // selection.
            onMouseDown={(e) => e.preventDefault()}
            onClick={btn.action}
            title={btn.label}
            aria-label={btn.label}
            style={{
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              backgroundColor: "#fff",
              color: "#374151",
              cursor: "pointer",
            }}
          >
            {btn.icon}
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={emitChange}
        onPaste={(e) => {
          // Force plain text on paste, then let the normal formatting toolbar
          // (and emitChange's sanitizer) handle everything else — this avoids
          // pulling in messy styled markup from Word/web pages.
          e.preventDefault();
          const text = e.clipboardData.getData("text/plain");
          document.execCommand("insertText", false, text);
        }}
        data-placeholder={placeholder}
        className="wysiwyg-editor"
        style={{
          width: "100%",
          minHeight: `${minHeight}px`,
          padding: "10px",
          fontSize: "13px",
          lineHeight: 1.6,
          outline: "none",
          fontFamily: "inherit",
          color: "#111827",
          backgroundColor: "#fff",
        }}
      />
      <p style={{ margin: 0, padding: "6px 10px", fontSize: "11px", color: "#9ca3af", borderTop: "1px solid #f3f4f6" }}>
        Type directly, select text, then click a button to format — what you see here is what visitors will see.
      </p>
    </div>
  );
}
