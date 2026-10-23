"use client";

import type { FaqItem } from "../../lib/siteContent";

type FaqEditorProps = {
  faqs: FaqItem[];
  onChange: (faqs: FaqItem[]) => void;
};

const buttonStyle = {
  border: "1px solid #d1d5db",
  backgroundColor: "#fff",
  color: "#374151",
  borderRadius: "6px",
  padding: "6px 8px",
  fontWeight: 600,
  fontSize: "12px",
  cursor: "pointer",
} as const;

export default function FaqEditor({ faqs, onChange }: FaqEditorProps) {
  function update(index: number, patch: Partial<FaqItem>) {
    onChange(faqs.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function add() {
    const nextId = Math.max(0, ...faqs.map((item) => item.id)) + 1;
    onChange([...faqs, { id: nextId, question: "", answer: "" }]);
  }

  function remove(index: number) {
    onChange(faqs.filter((_, itemIndex) => itemIndex !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= faqs.length) return;
    const next = [...faqs];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px", backgroundColor: "#f9fafb", display: "grid", gap: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, fontSize: "13px", color: "#374151", fontWeight: 700 }}>FAQs</p>
          <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280" }}>Shown as a questions and answers section on the page. Empty questions are hidden.</p>
        </div>
        <button type="button" onClick={add} style={{ border: "1px solid #b7844c", backgroundColor: "#fff", color: "#b7844c", borderRadius: "8px", padding: "6px 12px", fontWeight: 600, cursor: "pointer" }}>
          Add FAQ
        </button>
      </div>

      {faqs.length === 0 ? <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>No FAQs yet.</p> : null}

      {faqs.map((faq, index) => (
        <div key={faq.id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "10px", backgroundColor: "#fff", display: "grid", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 700 }}>Question {index + 1}</span>
            <div style={{ display: "flex", gap: "6px" }}>
              <button type="button" title="Move up" disabled={index === 0} onClick={() => move(index, -1)} style={{ ...buttonStyle, opacity: index === 0 ? 0.5 : 1 }}>
                ↑
              </button>
              <button type="button" title="Move down" disabled={index === faqs.length - 1} onClick={() => move(index, 1)} style={{ ...buttonStyle, opacity: index === faqs.length - 1 ? 0.5 : 1 }}>
                ↓
              </button>
              <button type="button" onClick={() => remove(index)} style={{ ...buttonStyle, border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c" }}>
                Delete
              </button>
            </div>
          </div>
          <input
            value={faq.question}
            onChange={(e) => update(index, { question: e.target.value })}
            placeholder="Question"
            style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
          />
          <textarea
            value={faq.answer}
            onChange={(e) => update(index, { answer: e.target.value })}
            placeholder="Answer"
            rows={3}
            style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px", resize: "vertical" }}
          />
        </div>
      ))}
    </div>
  );
}
