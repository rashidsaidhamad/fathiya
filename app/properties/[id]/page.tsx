import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { defaultSiteContent } from "../../../lib/siteContent";
import { getSiteContent } from "../../../lib/contentStore";
import PropertyContactActions from "../../components/PropertyContactActions";
import PropertyGalleryViewer from "../../components/PropertyGalleryViewer";
import { FaPlayCircle, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaCalendarAlt } from "react-icons/fa";
import { renderRichText } from "../../../lib/richText";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const siteContent = await getSiteContent();
  const property = siteContent.properties.find((item) => item.id === id) ?? defaultSiteContent.properties.find((item) => item.id === id) ?? null;

  if (!property) {
    return (
      <>
        <Navbar forceWhite />
        <main style={{ paddingTop: 110, minHeight: "100vh", background: "var(--background)", display: "grid", placeItems: "center", paddingInline: 24 }}>
          <div style={{ maxWidth: 560, textAlign: "center", background: "var(--surface)", padding: 32, borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}>
            <h1 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 28, color: "var(--ink)" }}>Property not found</h1>
            <p style={{ color: "var(--ink-soft)", marginTop: 10 }}>The property you requested does not exist.</p>
            <a href="/properties" style={{ display: "inline-flex", marginTop: 18, background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)", color: "#fff", textDecoration: "none", padding: "12px 24px", borderRadius: "var(--radius-pill)", fontWeight: 700 }}>Back to properties</a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const gallery = Array.isArray(property.images) && property.images.length > 0 ? property.images : [property.image];
  const hasVideo = Boolean(property.videoUrl?.trim());
  const mapUrl = property.mapUrl?.trim() || `https://maps.google.com/?q=${encodeURIComponent(property.location)}`;
  const agentFullName = property.agentFullName?.trim() || "Property Agent";
  const agentImage = property.agentImage?.trim() || "";

  const quickFacts = [
    { icon: <FaBed size={16} />, label: "Beds", value: property.beds },
    { icon: <FaBath size={16} />, label: "Baths", value: property.baths },
    { icon: <FaRulerCombined size={16} />, label: "Size", value: `${property.size.toLocaleString("en-US")} m²` },
    { icon: <FaCalendarAlt size={16} />, label: "Year", value: property.year },
  ];

  return (
    <>
      <Navbar forceWhite />
      <main style={{ paddingTop: 110, background: "var(--background)", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(16px, 3vw, 28px) 24px" }}>
          <div style={{ marginBottom: 16, fontSize: 13, color: "var(--muted)" }}>
            <a href="/" style={{ textDecoration: "none", color: "var(--ink-soft)" }}>Home</a>
            <span style={{ margin: "0 8px", color: "var(--muted)" }}>›</span>
            <a href="/properties" style={{ textDecoration: "none", color: "var(--accent-dark)", fontWeight: 700 }}>Properties</a>
            <span style={{ margin: "0 8px", color: "var(--muted)" }}>›</span>
            <span style={{ color: "var(--ink)" }}>{property.title}</span>
          </div>

          <div className="property-grid" style={{ display: "grid", gap: 24 }}>
            <section className="property-main" style={{ display: "grid", gap: 18 }}>
              <div className="hero-wrap" style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--navy)", boxShadow: "var(--shadow-md)" }}>
                <div className="hero" style={{ width: "100%", height: 460, backgroundImage: `url('${gallery[0]}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 60%, rgba(11,12,19,0.6) 100%)" }} />
                <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 6 }}>
                  <span style={{ backgroundColor: property.statusColor || "var(--accent)", color: "#fff", padding: "6px 14px", borderRadius: "var(--radius-pill)", fontSize: "12px", fontWeight: 700 }}>
                    {property.status}
                  </span>
                  <span style={{ backgroundColor: "rgba(255,255,255,0.92)", color: "#2f9e5b", padding: "6px 14px", borderRadius: "var(--radius-pill)", fontSize: "12px", fontWeight: 700 }}>
                    {property.active}
                  </span>
                </div>
                <p style={{ position: "absolute", left: 22, bottom: 18, margin: 0, color: "#fff", fontSize: "13px", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", opacity: 0.9, textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
                  {property.location}
                </p>
              </div>

              <div className="property-actions" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <PropertyGalleryViewer images={gallery} />
                {hasVideo ? (
                  <a href={property.videoUrl} target="_blank" rel="noreferrer" className="watch-video-btn" style={{ background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)", color: "#fff", textDecoration: "none", padding: "10px 18px", borderRadius: "var(--radius-pill)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 8px 18px rgba(196,154,108,0.3)" }}>
                    <FaPlayCircle /> Watch Video
                  </a>
                ) : null}
                <a href={mapUrl} target="_blank" rel="noreferrer" className="open-map-btn" style={{ background: "var(--surface)", color: "var(--ink)", textDecoration: "none", padding: "10px 18px", borderRadius: "var(--radius-pill)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid var(--border)" }}>
                  <FaMapMarkerAlt color="var(--accent-dark)" /> Open Map
                </a>
              </div>

              <article style={{ background: "var(--surface)", padding: "clamp(20px, 4vw, 32px)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)" }}>
                <p style={{ margin: "0 0 8px", color: "var(--accent-dark)", fontWeight: 800, letterSpacing: 1.4, textTransform: "uppercase", fontSize: 12 }}>Property Details</p>
                <h1 style={{ margin: 0, fontSize: "clamp(24px, 3.5vw, 32px)", lineHeight: 1.2, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>{property.title}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, color: "var(--ink-soft)", fontSize: 13.5 }}>
                  <FaMapMarkerAlt color="var(--accent-dark)" size={12} />
                  <span>{property.location}</span>
                </div>

                {/* Landscape split: facts sidebar + description */}
                <div className="property-details-grid" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 28, marginTop: 26, paddingTop: 26, borderTop: "1px solid var(--border)" }}>
                  {/* Facts column */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div style={{ background: "var(--background)", borderRadius: "var(--radius-md)", padding: 18 }}>
                      <p style={{ margin: "0 0 4px", fontSize: 12, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.6 }}>Price</p>
                      <p style={{ margin: 0, fontSize: "clamp(22px, 2.4vw, 26px)", fontWeight: 800, color: "var(--accent-dark)" }}>{property.price}</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", width: "fit-content", padding: "7px 14px", borderRadius: "var(--radius-pill)", background: "var(--accent-soft)", color: "var(--accent-dark)", fontSize: 12.5, fontWeight: 600 }}>
                        {property.status}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", width: "fit-content", padding: "7px 14px", borderRadius: "var(--radius-pill)", background: "var(--background)", color: "#2f9e5b", fontSize: 12.5, fontWeight: 600 }}>
                        {property.active}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {quickFacts.map((fact) => (
                        <div key={fact.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent-dark)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {fact.icon}
                          </span>
                          <div>
                            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{fact.value}</p>
                            <p style={{ margin: 0, fontSize: 11.5, color: "var(--muted)" }}>{fact.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description column */}
                  <div>
                    <h2 style={{ margin: "0 0 12px", fontSize: 18, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>Description</h2>
                    <div style={{ color: "var(--ink-soft)", lineHeight: 1.85, fontSize: 15 }}>{renderRichText(property.description)}</div>
                  </div>
                </div>
              </article>

              <section id="gallery" className="gallery-section" style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", padding: "clamp(18px, 4vw, 26px)", boxShadow: "var(--shadow-sm)", scrollMarginTop: 110 }}>
                <p style={{ margin: 0, color: "var(--accent-dark)", fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase", fontSize: 12 }}>Gallery</p>
                <h2 style={{ margin: "8px 0 0", fontSize: 20, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>Property photos</h2>
                <div className="property-gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 16 }}>
                  {gallery.map((imageUrl, index) => (
                    <div key={`${property.id}-${index}`} className="property-gallery-item hover-lift" style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--background)", aspectRatio: "4 / 3" }}>
                      <div style={{ width: "100%", height: "100%", backgroundImage: `url('${imageUrl}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
                    </div>
                  ))}
                </div>
              </section>
            </section>

              {/* Contact box moved below gallery to make it appear down the page */}
              <section className="property-contact" style={{ background: "var(--surface)", borderRadius: "var(--radius-lg)", padding: "clamp(18px, 4vw, 26px)", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div>
                    <p style={{ margin: 0, color: "var(--accent-dark)", fontWeight: 800, letterSpacing: 1, fontSize: 12, textTransform: "uppercase" }}>Contact</p>
                    <h2 style={{ margin: "8px 0 0", fontSize: 20, fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ink)" }}>Contact {agentFullName}</h2>
                  </div>
                </div>

                <div style={{ marginTop: 14, display: "grid", gap: 6, padding: 14, borderRadius: "var(--radius-sm)", background: "var(--background)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {agentImage ? (
                      <div
                        style={{
                          width: 64,
                          height: 84,
                          borderRadius: "var(--radius-sm)",
                          backgroundImage: `url('${agentImage}')`,
                          backgroundSize: "cover",
                          backgroundPosition: "top center",
                          flex: "0 0 auto",
                        }}
                      />
                    ) : null}
                    <div style={{ display: "grid", gap: 2 }}>
                      <div style={{ color: "var(--ink)", fontWeight: 700 }}>{agentFullName}</div>
                      <div style={{ color: "var(--muted)", fontSize: 13 }}>{property.contactEmail}</div>
                    </div>
                  </div>
                </div>

                <PropertyContactActions
                  propertyTitle={property.title}
                  propertyLocation={property.location}
                  contactPersonName={agentFullName}
                  contactPersonImage={agentImage}
                  phoneNumbers={[
                    property.contactPhone,
                    property.otherMobilePhone || "+255659741770",
                  ]}
                  email={property.contactEmail}
                  whatsappNumber={property.contactWhatsapp}
                  whatsappMessage={`Hello ${agentFullName}, I want to know more about ${property.title}.`}
                />
              </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
