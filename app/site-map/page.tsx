import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const routes = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Our company", href: "/company" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

export default function SiteMapPage() {
  return (
    <>
      <Navbar forceWhite />
      <main style={{ paddingTop: "90px", backgroundColor: "#f7f4ee", color: "#232323" }}>
        <section style={{ maxWidth: "960px", margin: "0 auto", padding: "70px 24px 90px" }}>
          <p style={{ letterSpacing: "3px", textTransform: "uppercase", fontSize: "12px", color: "#b7844c", marginBottom: "12px" }}>
            Site Map
          </p>
          <h1 style={{ margin: "0 0 16px", fontFamily: "Georgia, serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 500 }}>
            Navigate the Website
          </h1>
          <p style={{ margin: 0, color: "#555", lineHeight: 1.8, maxWidth: "760px" }}>
            Use the links below to move quickly through the main sections of the Archipelago Estates website.
          </p>

          <div style={{ display: "grid", gap: "14px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: "34px" }}>
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "18px 20px",
                  textDecoration: "none",
                  color: "#222",
                  border: "1px solid #e7e1d8",
                  boxShadow: "0 8px 22px rgba(19, 26, 36, 0.06)",
                }}
              >
                <div style={{ fontSize: "13px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#b7844c", marginBottom: "8px" }}>
                  Page
                </div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "20px" }}>{route.label}</div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}