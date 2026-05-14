import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { defaultSiteContent } from "../../../lib/siteContent";
import { getSiteContent } from "../../../lib/contentStore";
import PropertyContactActions from "../../components/PropertyContactActions";
import PropertyGalleryViewer from "../../components/PropertyGalleryViewer";
import { FaPhone, FaEnvelope, FaWhatsapp, FaPlayCircle, FaMapMarkerAlt } from "react-icons/fa";
import { toTelHref, toWhatsAppHref } from "../../../lib/contactLinks";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const siteContent = await getSiteContent();
  const property = siteContent.properties.find((item) => item.id === id) ?? defaultSiteContent.properties.find((item) => item.id === id) ?? null;

  if (!property) {
    return (
      <>
        <Navbar forceWhite />
        <main style={{ paddingTop: 80, minHeight: "100vh", background: "#fafafa", display: "grid", placeItems: "center", paddingInline: 24 }}>
          <div style={{ maxWidth: 560, textAlign: "center", background: "#fff", padding: 32, borderRadius: 16, boxShadow: "0 16px 40px rgba(0,0,0,0.08)" }}>
            <h1 style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: 28 }}>Property not found</h1>
            <p style={{ color: "#555", marginTop: 10 }}>The property you requested does not exist.</p>
            <a href="/properties" style={{ display: "inline-flex", marginTop: 18, background: "#c49a6c", color: "#fff", textDecoration: "none", padding: "10px 18px", borderRadius: 999, fontWeight: 700 }}>Back to properties</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const gallery = Array.isArray(property.images) && property.images.length > 0 ? property.images : [property.image];
  const hasVideo = Boolean(property.videoUrl?.trim());
  const mapUrl = property.mapUrl?.trim() || `https://maps.google.com/?q=${encodeURIComponent(property.location)}`;

  return (
    <>
      <Navbar forceWhite />
      <main style={{ paddingTop: 84, background: "linear-gradient(180deg, #faf8f5 0%, #f3f4f6 100%)", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "24px clamp(16px, 3vw, 28px) 56px" }}>
          <div style={{ marginBottom: 16, fontSize: 13, color: "#7a7a7a" }}>
            <a href="/" style={{ textDecoration: "none", color: "#333" }}>Home</a>
            <span style={{ margin: "0 8px", color: "#aaa" }}>›</span>
            <a href="/properties" style={{ textDecoration: "none", color: "#c49a6c", fontWeight: 700 }}>Properties</a>
            <span style={{ margin: "0 8px", color: "#aaa" }}>›</span>
            <span style={{ color: "#222" }}>{property.title}</span>
          </div>

          <div className="property-grid" style={{ maxWidth: 1180, margin: "0 auto", padding: "24px clamp(16px, 3vw, 28px) 56px" }}>
            <section className="property-main" style={{ display: "grid", gap: 18 }}>
              <div className="hero-wrap" style={{ position: "relative", borderRadius: 20, overflow: "hidden", background: "#111827", boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }}>
                <div className="hero" style={{ width: "100%", height: 460, backgroundImage: `url('${gallery[0]}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                {/* Intentionally no click overlay on the main image. Video plays only via the "Watch Video" button below. */}
              </div>

              <div className="property-actions" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <PropertyGalleryViewer images={gallery} />
                {hasVideo ? (
                  <a href={property.videoUrl} target="_blank" rel="noreferrer" className="watch-video-btn" style={{ background: "#c49a6c", color: "#fff", textDecoration: "none", padding: "10px 16px", borderRadius: 999, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <FaPlayCircle /> Watch Video
                  </a>
                ) : null}
                <a href={mapUrl} target="_blank" rel="noreferrer" className="open-map-btn" style={{ background: "#fff", color: "#111827", textDecoration: "none", padding: "10px 16px", borderRadius: 999, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid #e5e7eb" }}>
                  <FaMapMarkerAlt /> Open Map
                </a>
              </div>

              <article style={{ background: "#fff", padding: 22, borderRadius: 18, boxShadow: "0 14px 36px rgba(0,0,0,0.08)" }}>
                <p style={{ margin: 0, color: "#c49a6c", fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", fontSize: 12 }}>Property Details</p>
                <h1 style={{ margin: "8px 0 10px", fontSize: 32, lineHeight: 1.1, fontFamily: "Georgia, serif", color: "#111827" }}>{property.title}</h1>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#c49a6c" }}>{property.price}</p>
                <p style={{ marginTop: 10, color: "#555", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{property.description}</p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, marginTop: 18 }}>
                  <div style={{ background: "#f9fafb", borderRadius: 14, padding: 14 }}><strong>Bed</strong><div style={{ marginTop: 4 }}>{property.beds}</div></div>
                  <div style={{ background: "#f9fafb", borderRadius: 14, padding: 14 }}><strong>Bath</strong><div style={{ marginTop: 4 }}>{property.baths}</div></div>
                  <div style={{ background: "#f9fafb", borderRadius: 14, padding: 14 }}><strong>Size</strong><div style={{ marginTop: 4 }}>{property.size.toLocaleString()} m²</div></div>
                  <div style={{ background: "#f9fafb", borderRadius: 14, padding: 14 }}><strong>Year</strong><div style={{ marginTop: 4 }}>{property.year}</div></div>
                </div>

                {Array.isArray(property.features) && property.features.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <p style={{ margin: "0 0 12px 0", color: "#c49a6c", fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", fontSize: 12 }}>Features</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                      {property.features.map((feature, index) => (
                        <div key={index} style={{ background: "#f9fafb", borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c49a6c", flexShrink: 0 }} />
                          <span style={{ fontSize: 14, color: "#333" }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #eee", display: "grid", gap: 10 }}>
                  <div style={{ color: "#444" }}><strong>Location:</strong> {property.location}</div>
                  <div style={{ color: "#444" }}><strong>Status:</strong> {property.status}</div>
                  <div style={{ color: "#444" }}><strong>Active:</strong> {property.active}</div>
                </div>
              </article>

              <section id="gallery" className="gallery-section" style={{ background: "#fff", borderRadius: 18, padding: 20, boxShadow: "0 14px 36px rgba(0,0,0,0.08)", scrollMarginTop: 110 }}>
                <p style={{ margin: 0, color: "#c49a6c", fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", fontSize: 12 }}>Gallery</p>
                <h2 style={{ margin: "6px 0 0", fontSize: 20, fontFamily: "Georgia, serif" }}>Property photos</h2>
                <div className="property-gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginTop: 14 }}>
                  {gallery.map((imageUrl, index) => (
                    <div key={`${property.id}-${index}`} className="property-gallery-item" style={{ borderRadius: 14, overflow: "hidden", background: "#f3f4f6", aspectRatio: "4 / 3" }}>
                      <div style={{ width: "100%", height: "100%", backgroundImage: `url('${imageUrl}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                    </div>
                  ))}
                </div>
              </section>
            </section>

              {/* Contact box moved below gallery to make it appear down the page */}
              <section className="property-contact" style={{ background: "#fff", borderRadius: 18, padding: 20, boxShadow: "0 14px 36px rgba(0,0,0,0.08)", marginTop: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div>
                    <p style={{ margin: 0, color: "#c49a6c", fontWeight: 800 }}>Contact</p>
                    <h2 style={{ margin: "6px 0 0", fontSize: 20, fontFamily: "Georgia, serif" }}>Get in touch</h2>
                  </div>
                </div>

                <PropertyContactActions
                  propertyTitle={property.title}
                  propertyLocation={property.location}
                  phoneNumbers={[
                    property.contactPhone,
                    property.otherMobilePhone || "+255659741770",
                  ]}
                  email={property.contactEmail}
                  whatsappNumber={property.contactWhatsapp}
                  whatsappMessage={defaultSiteContent.contactActions.whatsappMessage}
                />
              </section>

            </div>
          </div>

      </main>
      <Footer />
    </>
  );
}
