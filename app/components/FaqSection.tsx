import type { FaqItem } from "../../lib/siteContent";

type FaqSectionProps = {
  faqs: FaqItem[] | undefined;
  title?: string;
};

export default function FaqSection({ faqs, title = "Frequently asked questions" }: FaqSectionProps) {
  const items = (faqs ?? []).filter((item) => item.question?.trim());
  if (items.length === 0) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section style={{ background: "#fff", borderRadius: 18, padding: 20, boxShadow: "0 14px 36px rgba(0,0,0,0.08)" }}>
      <p style={{ margin: 0, color: "#c49a6c", fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", fontSize: 12 }}>FAQs</p>
      <h2 style={{ margin: "6px 0 14px", fontSize: 20, fontFamily: "Georgia, serif", color: "#111827" }}>{title}</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {items.map((item) => (
          <details key={item.id} className="faq-item">
            <summary>{item.question}</summary>
            {item.answer?.trim() ? <p>{item.answer}</p> : null}
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </section>
  );
}
