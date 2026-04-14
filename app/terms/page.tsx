import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
  {
    title: "Use of the site",
    body: "This website is provided for browsing properties, learning about our services, and contacting Archipelago Estates. You agree not to use the site for unlawful, harmful, or misleading activity.",
  },
  {
    title: "Listings and information",
    body: "Property details, pricing, and availability may change without notice. We aim to keep information accurate, but users should confirm key details directly with our team before making decisions.",
  },
  {
    title: "Contact and communication",
    body: "When you submit your details through the website or email us directly, you consent to being contacted about your enquiry, including property updates and support responses.",
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar forceWhite />
      <main style={{ paddingTop: "90px", backgroundColor: "#f6f4ef", color: "#232323" }}>
        <section style={{ maxWidth: "980px", margin: "0 auto", padding: "70px 24px 90px" }}>
          <p style={{ letterSpacing: "3px", textTransform: "uppercase", fontSize: "12px", color: "#b7844c", marginBottom: "12px" }}>
            Terms of Use
          </p>
          <h1 style={{ margin: "0 0 16px", fontFamily: "Georgia, serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 500 }}>
            Website Terms and Conditions
          </h1>
          <p style={{ margin: 0, color: "#555", lineHeight: 1.8, maxWidth: "760px" }}>
            These terms explain how to use the Archipelago Estates website and what to expect when you explore our listings or reach out to our team.
          </p>

          <div style={{ display: "grid", gap: "18px", marginTop: "36px" }}>
            {sections.map((section) => (
              <article key={section.title} style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "26px", boxShadow: "0 10px 30px rgba(19, 26, 36, 0.08)" }}>
                <h2 style={{ margin: "0 0 10px", fontSize: "20px", fontFamily: "Georgia, serif", color: "#1f1f1f" }}>
                  {section.title}
                </h2>
                <p style={{ margin: 0, lineHeight: 1.8, color: "#545454" }}>{section.body}</p>
              </article>
            ))}
          </div>

          <div style={{ marginTop: "30px" }}>
            <Link href="/privacy-policy" style={{ color: "#b7844c", textDecoration: "none", fontWeight: 600 }}>
              Read the Privacy Policy
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}