"use client";

import { useRef, useState } from "react";
import { FaBold, FaItalic, FaUnderline, FaListUl } from "react-icons/fa";
import { renderRichText } from "../../lib/richText";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
};

export default function RichTextEditor({ value, onChange, rows = 4, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Tracks the last selection the user actually made inside the textarea, so a
  // toolbar click can act on it even if the browser has since moved focus away.
  const selectionRef = useRef({ start: 0, end: 0 });
  const [showPreview, setShowPreview] = useState(false);

  function captureSelection() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    selectionRef.current = { start: textarea.selectionStart, end: textarea.selectionEnd };
  }

  function wrapSelection(marker: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end } = selectionRef.current;
    const selected = value.slice(start, end) || "text";
    const newValue = value.slice(0, start) + marker + selected + marker + value.slice(end);

    onChange(newValue);

    const nextStart = start + marker.length;
    const nextEnd = nextStart + selected.length;
    selectionRef.current = { start: nextStart, end: nextEnd };

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextStart, nextEnd);
    });
  }

  function toggleBulletList() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end } = selectionRef.current;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const nextBreak = value.indexOf("\n", end);
    const lineEnd = nextBreak === -1 ? value.length : nextBreak;

    const block = value.slice(lineStart, lineEnd);
    const lines = block.split("\n");
    const allBulleted = lines.every((line) => line.trim() === "" || line.trimStart().startsWith("- "));

    const newLines = lines.map((line) => {
      if (line.trim() === "") return line;
      return allBulleted ? line.replace(/^(\s*)-\s?/, "$1") : `- ${line}`;
    });
    const newBlock = newLines.join("\n");
    const newValue = value.slice(0, lineStart) + newBlock + value.slice(lineEnd);

    onChange(newValue);
    selectionRef.current = { start: lineStart, end: lineStart + newBlock.length };

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart, lineStart + newBlock.length);
    });
  }

  const buttons = [
    { label: "Bold", icon: <FaBold size={12} />, action: () => wrapSelection("**") },
    { label: "Italic", icon: <FaItalic size={12} />, action: () => wrapSelection("*") },
    { label: "Underline", icon: <FaUnderline size={12} />, action: () => wrapSelection("__") },
    { label: "Bullet list", icon: <FaListUl size={12} />, action: toggleBulletList },
  ];

  return (
    <div style={{ border: "1px solid #d1d5db", borderRadius: "8px", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px", backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
        {buttons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            // Keep focus (and the selection) on the textarea instead of letting
            // the browser's default mousedown behavior move it to the button.
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
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowPreview((prev) => !prev)}
          style={{
            marginLeft: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            padding: "4px 10px",
            backgroundColor: showPreview ? "#111827" : "#fff",
            color: showPreview ? "#fff" : "#374151",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {showPreview ? "Hide preview" : "Preview"}
        </button>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={captureSelection}
        onKeyUp={captureSelection}
        onMouseUp={captureSelection}
        rows={rows}
        placeholder={placeholder}
        style={{
          width: "100%",
          border: "none",
          padding: "10px",
          fontSize: "13px",
          resize: "vertical",
          outline: "none",
          fontFamily: "inherit",
          display: "block",
        }}
      />
      <p style={{ margin: 0, padding: "6px 10px", fontSize: "11px", color: "#9ca3af", borderTop: "1px solid #f3f4f6" }}>
        Select text, then click a button to format just that selection.
      </p>
      {showPreview && (
        <div style={{ padding: "12px 14px", borderTop: "1px solid #e5e7eb", backgroundColor: "#fff", fontSize: "13px", lineHeight: 1.7, color: "#111827" }}>
          {renderRichText(value) ?? <span style={{ color: "#9ca3af" }}>Nothing to preview yet.</span>}
        </div>
      )}
    </div>
  );
}
