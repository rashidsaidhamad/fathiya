import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const privacyPoints = [
  {
    title: "Information we collect",
    body: "We collect the details you choose to submit through the contact form, including your name, email address, phone number, and enquiry message.",
  },
  {
    title: "How we use it",
    body: "We use your information to respond to enquiries, share relevant property information, and improve the support we provide to clients and visitors.",
  },
  {
    title: "Sharing and retention",
    body: "We do not sell your personal information. We keep it only as long as needed to respond to your request or meet legal and business obligations.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar forceWhite />
      <main style={{ paddingTop: "90px", backgroundColor: "#eef2f1", color: "#232323" }}>
        <section style={{ maxWidth: "980px", margin: "0 auto", padding: "70px 24px 90px" }}>
          <p style={{ letterSpacing: "3px", textTransform: "uppercase", fontSize: "12px", color: "#b7844c", marginBottom: "12px" }}>
            Privacy Policy
          </p>
          <h1 style={{ margin: "0 0 16px", fontFamily: "Georgia, serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 500 }}>
            How We Handle Your Information
          </h1>
          <p style={{ margin: 0, color: "#555", lineHeight: 1.8, maxWidth: "760px" }}>
            This page explains the basic privacy practices used on the Archipelago Estates website.
          </p>

          <div style={{ display: "grid", gap: "18px", marginTop: "36px" }}>
            {privacyPoints.map((section) => (
              <article key={section.title} style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "26px", boxShadow: "0 10px 30px rgba(19, 26, 36, 0.08)" }}>
                <h2 style={{ margin: "0 0 10px", fontSize: "20px", fontFamily: "Georgia, serif", color: "#1f1f1f" }}>
                  {section.title}
                </h2>
                <p style={{ margin: 0, lineHeight: 1.8, color: "#545454" }}>{section.body}</p>
              </article>
            ))}
          </div>

          <div style={{ marginTop: "30px" }}>
            <Link href="/terms" style={{ color: "#b7844c", textDecoration: "none", fontWeight: 600 }}>
              Read the Terms of Use
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}