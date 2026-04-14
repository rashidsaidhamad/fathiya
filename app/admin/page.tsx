"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ArticleItem, BlogSidebarItem, CompanyTeamMember, CompanyTestimonialItem, ContactSubmission, PropertyItem, SiteContent } from "../../lib/siteContent";
import { defaultSiteContent } from "../../lib/siteContent";

type AdminSection = "home" | "properties" | "company" | "blog" | "contact";

function JsonEditor({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={{ display: "grid", gap: "8px" }}>
      <span style={{ fontSize: "13px", color: "#444", fontWeight: 600 }}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        style={{
          width: "100%",
          fontFamily: "monospace",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "12px",
          fontSize: "12px",
          resize: "vertical",
        }}
      />
    </label>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>("home");
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [status, setStatus] = useState("");
  const [homeChecklistJson, setHomeChecklistJson] = useState("[]");

  useEffect(() => {
    Promise.all([fetch("/api/site-content"), fetch("/api/contact-submissions")])
      .then(async ([contentRes, submissionsRes]) => {
        const site = (await contentRes.json()) as SiteContent;
        const leads = (await submissionsRes.json()) as ContactSubmission[];
        setContent(site);
        setSubmissions(leads);
        setHomeChecklistJson(JSON.stringify(site.homePage.aboutChecklist, null, 2));
      })
      .catch(() => {
        setStatus("Could not load admin data");
      });
  }, []);

  const leadStats = useMemo(() => {
    const home = submissions.filter((item) => item.source === "home").length;
    const contact = submissions.filter((item) => item.source === "contact").length;
    const company = submissions.filter((item) => item.source === "company").length;
    return { total: submissions.length, home, contact, company };
  }, [submissions]);

  const contactFormOptions = content.contactFormSettings?.hearAboutUsOptions ?? defaultSiteContent.contactFormSettings.hearAboutUsOptions;
  const heroPreviewUrl = content.homePage.heroBackgroundImage?.trim() ?? "";
  const heroPreviewBackground = heroPreviewUrl ? `url("${heroPreviewUrl.replace(/"/g, '\\"')}")` : "none";

  const hearAboutUsCounts = useMemo(() => {
    return contactFormOptions.map((option) => ({
      option,
      count: submissions.filter((item) => Array.isArray(item.hearAboutUs) && item.hearAboutUs.includes(option)).length,
    }));
  }, [submissions, contactFormOptions]);

  const sidebarItems: Array<{ key: AdminSection; label: string }> = [
    { key: "home", label: "Home" },
    { key: "properties", label: "Properties" },
    { key: "company", label: "Our Company" },
    { key: "blog", label: "Blog" },
    { key: "contact", label: "Contact Us" },
  ];

  async function saveAll() {
    try {
      const parsedHomeChecklist = JSON.parse(homeChecklistJson);
      if (!Array.isArray(parsedHomeChecklist) || parsedHomeChecklist.some((item) => typeof item !== "string")) {
        throw new Error("invalid-checklist");
      }

      const nextContent: SiteContent = {
        ...content,
        homePage: {
          ...content.homePage,
          aboutChecklist: parsedHomeChecklist,
        },
        articles: content.articles,
        testimonials: content.companyTestimonials.map((item) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          text: item.text,
          stars: item.stars,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=c49a6c&color=fff&size=48`,
        })),
      };

      const response = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextContent),
      });

      if (!response.ok) {
        setStatus("Save failed");
        window.alert("Save failed. Please try again.");
        return;
      }

      setContent(nextContent);
      setStatus("Saved successfully. Your pages now use this content.");
      window.alert("Changes saved successfully.");
    } catch {
      setStatus("Save failed: JSON format is invalid");
      window.alert("Save failed. Please check the format and try again.");
    }
  }

  async function logout() {
    const response = await fetch("/api/admin/logout", { method: "POST" });
    if (!response.ok) {
      setStatus("Logout failed");
      window.alert("Logout failed. Please try again.");
      return;
    }
    window.alert("Logged out successfully.");
    router.push("/admin/login");
    router.refresh();
  }

  function updateProperty(index: number, patch: Partial<PropertyItem>) {
    setContent((prev) => ({
      ...prev,
      properties: prev.properties.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function addProperty() {
    const nextId = Math.max(0, ...content.properties.map((item) => item.id)) + 1;
    setContent((prev) => ({
      ...prev,
      properties: [
        ...prev.properties,
        {
          id: nextId,
          title: "New Property",
          price: "$ 0",
          status: "For Sale",
          active: "Active",
          statusColor: "#c49a6c",
          beds: 1,
          baths: 1,
          size: 100,
          year: new Date().getFullYear(),
          location: "Zanzibar",
          mapUrl: "https://maps.google.com/?q=Zanzibar",
          description: "Property description",
          image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80",
          contactEmail: prev.contactActions.email,
          contactPhone: prev.contactActions.phone,
          contactWhatsapp: prev.contactActions.whatsapp,
        },
      ],
    }));
  }

  function removeProperty(index: number) {
    setContent((prev) => ({
      ...prev,
      properties: prev.properties.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function updateTeamMember(index: number, patch: Partial<CompanyTeamMember>) {
    setContent((prev) => ({
      ...prev,
      companyTeam: prev.companyTeam.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function addTeamMember() {
    const nextId = Math.max(0, ...content.companyTeam.map((item) => item.id)) + 1;
    setContent((prev) => ({
      ...prev,
      companyTeam: [
        ...prev.companyTeam,
        {
          id: nextId,
          name: "Staff name",
          role: "Role",
          description: "Short description",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
          email: prev.contactActions.email,
          phone: prev.contactActions.phone,
          whatsapp: prev.contactActions.whatsapp,
          facebook: "",
          instagram: "",
          linkedin: "",
        },
      ],
    }));
  }

  function removeTeamMember(index: number) {
    setContent((prev) => ({
      ...prev,
      companyTeam: prev.companyTeam.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function updateCompanyTestimonial(index: number, patch: Partial<CompanyTestimonialItem>) {
    setContent((prev) => ({
      ...prev,
      companyTestimonials: prev.companyTestimonials.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function updateBlogSidebarItem(index: number, patch: Partial<BlogSidebarItem>) {
    setContent((prev) => ({
      ...prev,
      blogSidebarItems: prev.blogSidebarItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function addBlogSidebarItem() {
    const nextId = (content.blogSidebarItems.at(-1)?.id ?? 0) + 1;
    setContent((prev) => ({
      ...prev,
      blogSidebarItems: [
        ...prev.blogSidebarItems,
        {
          id: nextId,
          title: "New Sidebar Item",
          price: "$ 0",
          image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=80",
          href: "/properties",
        },
      ],
    }));
  }

  function removeBlogSidebarItem(index: number) {
    setContent((prev) => ({
      ...prev,
      blogSidebarItems: prev.blogSidebarItems.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function addCompanyTestimonial() {
    const nextId = Math.max(0, ...content.companyTestimonials.map((item) => item.id)) + 1;
    setContent((prev) => ({
      ...prev,
      companyTestimonials: [
        ...prev.companyTestimonials,
        {
          id: nextId,
          name: "Client Name",
          role: "Client Role",
          text: "Client feedback",
          stars: 5,
        },
      ],
    }));
  }

  function removeCompanyTestimonial(index: number) {
    setContent((prev) => ({
      ...prev,
      companyTestimonials: prev.companyTestimonials.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function updateArticle(index: number, patch: Partial<ArticleItem>) {
    setContent((prev) => ({
      ...prev,
      articles: prev.articles.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    }));
  }

  function addArticle() {
    const nextId = Math.max(0, ...content.articles.map((item) => item.id)) + 1;
    setContent((prev) => ({
      ...prev,
      articles: [
        ...prev.articles,
        {
          id: nextId,
          slug: `new-article-${nextId}`,
          title: "New Article Title",
          date: new Date().toLocaleDateString(),
          excerpt: "Short article summary",
          image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80",
          content: "Article content goes here.",
        },
      ],
    }));
  }

  function removeArticle(index: number) {
    setContent((prev) => ({
      ...prev,
      articles: prev.articles.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  return (
    <main style={{ backgroundColor: "#f3f4f7", minHeight: "100vh", padding: "30px 18px 50px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gap: "20px" }}>
        <header style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "30px", fontFamily: "Georgia, serif", color: "#1f2937" }}>Website Admin Panel</h1>
            <p style={{ margin: "8px 0 0", color: "#666", fontSize: "14px" }}>
              Manage pages from the left menu, then save changes.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={saveAll}
              style={{
                border: "none",
                backgroundColor: "#b7844c",
                color: "#fff",
                borderRadius: "8px",
                padding: "10px 18px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save All Changes
            </button>
            <button
              onClick={logout}
              style={{ border: "1px solid #d1d5db", backgroundColor: "#fff", color: "#374151", borderRadius: "8px", padding: "9px 14px", fontWeight: 600, cursor: "pointer" }}
            >
              Log out
            </button>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "20px", alignItems: "start" }}>
          <aside style={{ backgroundColor: "#111827", color: "#fff", borderRadius: "14px", padding: "14px", position: "sticky", top: "12px" }}>
            <p style={{ margin: "8px 8px 12px", fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#9ca3af" }}>
              Pages
            </p>
            <div style={{ display: "grid", gap: "8px" }}>
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  style={{
                    textAlign: "left",
                    border: "1px solid",
                    borderColor: activeSection === item.key ? "#b7844c" : "#1f2937",
                    backgroundColor: activeSection === item.key ? "rgba(183,132,76,0.2)" : "#1f2937",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "10px 12px",
                    fontSize: "14px",
                    fontWeight: activeSection === item.key ? 700 : 500,
                    cursor: "pointer",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          <div style={{ display: "grid", gap: "20px" }}>
            {activeSection === "home" && (
              <>
                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "18px" }}>
                  <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Home Hero and Section Headings</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                    {([
                      ["Hero Eyebrow", "heroEyebrow"],
                      ["Hero Title Line 1", "heroTitleLine1"],
                      ["Hero Title Line 2", "heroTitleLine2"],
                      ["Hero Background Image", "heroBackgroundImage"],
                      ["About Badge", "aboutBadge"],
                      ["About Title Line 1", "aboutTitleLine1"],
                      ["About Title Line 2", "aboutTitleLine2"],
                      ["About Intro Line 1", "aboutIntroLine1"],
                      ["About Intro Line 2", "aboutIntroLine2"],
                      ["About Intro Line 3", "aboutIntroLine3"],
                      ["Properties Badge", "propertiesBadge"],
                      ["Properties Title", "propertiesTitle"],
                      ["Properties Description", "propertiesDescription"],
                      ["Testimonials Badge", "testimonialsBadge"],
                      ["Testimonials Title", "testimonialsTitle"],
                      ["Testimonials Description", "testimonialsDescription"],
                      ["Blog Badge", "blogBadge"],
                      ["Blog Title", "blogTitle"],
                      ["Blog Description", "blogDescription"],
                    ] as const).map(([label, key]) => (
                      <label key={key} style={{ display: "grid", gap: "6px" }}>
                        <span style={{ fontSize: "13px", color: "#444", fontWeight: 600 }}>{label}</span>
                        <input
                          value={content.homePage[key]}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              homePage: {
                                ...prev.homePage,
                                [key]: e.target.value,
                              },
                            }))
                          }
                          style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px 12px", fontSize: "14px" }}
                        />
                      </label>
                    ))}
                  </div>

                  <div style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px", backgroundColor: "#f9fafb", display: "grid", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <p style={{ margin: 0, fontSize: "13px", color: "#374151", fontWeight: 700 }}>Hero Background Preview</p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Paste image URL and preview instantly</p>
                    </div>
                    <p style={{ margin: 0, fontSize: "12px", color: "#4b5563", lineHeight: 1.5 }}>
                      Valid image URL: public direct link ending with .jpg, .jpeg, .png, or .webp (example: https://example.com/hero.jpg).
                    </p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#6b7280", lineHeight: 1.5 }}>
                      Avoid page links from Google Drive, Facebook, or links that need login because they will not show as a background image.
                    </p>
                    <div
                      style={{
                        height: "180px",
                        borderRadius: "8px",
                        backgroundColor: "#111827",
                        backgroundImage: heroPreviewBackground,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "1px solid #d1d5db",
                      }}
                    />
                    {!heroPreviewUrl && (
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                        Add a Hero Background Image URL to preview it here.
                      </p>
                    )}
                  </div>

                  <JsonEditor label="About checklist items (JSON array of strings)" value={homeChecklistJson} onChange={setHomeChecklistJson} />
                </section>

                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ margin: "0 0 14px", fontSize: "20px", color: "#111827" }}>Home Video Section</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                    {[
                      ["Badge", "badge"],
                      ["Heading Line 1", "headingLine1"],
                      ["Heading Line 2", "headingLine2"],
                      ["Helper Text", "helperText"],
                      ["Background Image URL", "backgroundImage"],
                      ["Video URL", "videoUrl"],
                      ["Video Poster URL", "videoPoster"],
                    ].map(([label, key]) => (
                      <label key={key} style={{ display: "grid", gap: "6px" }}>
                        <span style={{ fontSize: "13px", color: "#444", fontWeight: 600 }}>{label}</span>
                        <input
                          value={content.videoSection[key as keyof SiteContent["videoSection"]]}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              videoSection: {
                                ...prev.videoSection,
                                [key]: e.target.value,
                              },
                            }))
                          }
                          style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px 12px", fontSize: "14px" }}
                        />
                      </label>
                    ))}
                  </div>
                </section>

                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "10px" }}>
                  <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Home Testimonials</h2>
                  <p style={{ margin: 0, fontSize: "13px", color: "#4b5563" }}>
                    Home testimonials are linked to Our Company testimonials.
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                    Edit them from the sidebar page: Our Company {">"} Company Testimonials.
                  </p>
                </section>
              </>
            )}

            {activeSection === "properties" && (
              <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Properties</h2>
                  <button onClick={addProperty} style={{ border: "1px solid #b7844c", backgroundColor: "#fff", color: "#b7844c", borderRadius: "8px", padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>
                    Add Property
                  </button>
                </div>

                <div style={{ display: "grid", gap: "14px" }}>
                  {content.properties.map((item, index) => (
                    <article key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px", display: "grid", gap: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                        <p style={{ margin: 0, fontWeight: 700, color: "#374151" }}>Property #{item.id}</p>
                        <button onClick={() => removeProperty(index)} style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "6px 10px", cursor: "pointer" }}>
                          Remove
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
                        {[
                          ["Title", item.title, "title"],
                          ["Price", item.price, "price"],
                          ["Location", item.location, "location"],
                          ["Location Map URL", item.mapUrl, "mapUrl"],
                          ["Image URL", item.image, "image"],
                          ["Contact Email", item.contactEmail, "contactEmail"],
                          ["Contact Phone", item.contactPhone, "contactPhone"],
                          ["Contact WhatsApp", item.contactWhatsapp, "contactWhatsapp"],
                        ].map(([label, value, key]) => (
                          <label key={key as string} style={{ display: "grid", gap: "6px" }}>
                            <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>{label}</span>
                            <input
                              value={value as string}
                              onChange={(e) => updateProperty(index, { [key as keyof PropertyItem]: e.target.value } as Partial<PropertyItem>)}
                              style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                            />
                          </label>
                        ))}

                        <label style={{ display: "grid", gap: "6px" }}>
                          <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>Rent or Sale</span>
                          <select
                            value={item.status}
                            onChange={(e) => updateProperty(index, { status: e.target.value })}
                            style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                          >
                            <option>For Sale</option>
                            <option>For Rent</option>
                          </select>
                        </label>

                        {[
                          ["No. of Beds", item.beds, "beds"],
                          ["Baths", item.baths, "baths"],
                          ["Size (sq meters)", item.size, "size"],
                          ["Year Built", item.year, "year"],
                        ].map(([label, value, key]) => (
                          <label key={key as string} style={{ display: "grid", gap: "6px" }}>
                            <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>{label}</span>
                            <input
                              type="number"
                              value={value as number}
                              onChange={(e) => updateProperty(index, { [key as keyof PropertyItem]: Number(e.target.value) } as Partial<PropertyItem>)}
                              style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                            />
                          </label>
                        ))}
                      </div>

                      <label style={{ display: "grid", gap: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>Description</span>
                        <textarea
                          value={item.description}
                          onChange={(e) => updateProperty(index, { description: e.target.value })}
                          rows={3}
                          style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px", resize: "vertical" }}
                        />
                      </label>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeSection === "company" && (
              <>
                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Meet Our Team Cards</h2>
                    <button onClick={addTeamMember} style={{ border: "1px solid #b7844c", backgroundColor: "#fff", color: "#b7844c", borderRadius: "8px", padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>
                      Add Staff Card
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "14px" }}>
                    {content.companyTeam.map((member, index) => (
                      <article key={member.id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px", display: "grid", gap: "12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                          <p style={{ margin: 0, fontWeight: 700, color: "#374151" }}>Staff #{member.id}</p>
                          <button onClick={() => removeTeamMember(index)} style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "6px 10px", cursor: "pointer" }}>
                            Remove
                          </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
                          {[
                            ["Name", member.name, "name"],
                            ["Role", member.role, "role"],
                            ["Image URL", member.image, "image"],
                            ["Email", member.email, "email"],
                            ["Phone", member.phone, "phone"],
                            ["WhatsApp", member.whatsapp, "whatsapp"],
                            ["Facebook URL", member.facebook, "facebook"],
                            ["Instagram URL", member.instagram, "instagram"],
                            ["LinkedIn URL", member.linkedin, "linkedin"],
                          ].map(([label, value, key]) => (
                            <label key={key as string} style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>{label}</span>
                              <input
                                value={value as string}
                                onChange={(e) => updateTeamMember(index, { [key as keyof CompanyTeamMember]: e.target.value } as Partial<CompanyTeamMember>)}
                                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                              />
                            </label>
                          ))}
                        </div>

                        <label style={{ display: "grid", gap: "6px" }}>
                          <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>Description</span>
                          <textarea
                            value={member.description}
                            onChange={(e) => updateTeamMember(index, { description: e.target.value })}
                            rows={3}
                            style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px", resize: "vertical" }}
                          />
                        </label>
                      </article>
                    ))}
                  </div>
                </section>

                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Company Testimonials</h2>
                    <button onClick={addCompanyTestimonial} style={{ border: "1px solid #b7844c", backgroundColor: "#fff", color: "#b7844c", borderRadius: "8px", padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>
                      Add Testimonial
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {content.companyTestimonials.map((item, index) => (
                      <article key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px", display: "grid", gap: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                          <p style={{ margin: 0, fontWeight: 700, color: "#374151" }}>Testimonial #{item.id}</p>
                          <button onClick={() => removeCompanyTestimonial(index)} style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "6px 10px", cursor: "pointer" }}>
                            Remove
                          </button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
                          {[
                            ["Name", item.name, "name"],
                            ["Role", item.role, "role"],
                          ].map(([label, value, key]) => (
                            <label key={key as string} style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>{label}</span>
                              <input
                                value={value as string}
                                onChange={(e) => updateCompanyTestimonial(index, { [key as keyof CompanyTestimonialItem]: e.target.value } as Partial<CompanyTestimonialItem>)}
                                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                              />
                            </label>
                          ))}
                          <label style={{ display: "grid", gap: "6px" }}>
                            <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>Stars</span>
                            <input
                              type="number"
                              min={1}
                              max={5}
                              value={item.stars}
                              onChange={(e) => updateCompanyTestimonial(index, { stars: Number(e.target.value) })}
                              style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                            />
                          </label>
                        </div>
                        <label style={{ display: "grid", gap: "6px" }}>
                          <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>Testimonial Text</span>
                          <textarea
                            value={item.text}
                            onChange={(e) => updateCompanyTestimonial(index, { text: e.target.value })}
                            rows={3}
                            style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px", resize: "vertical" }}
                          />
                        </label>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}

            {activeSection === "blog" && (
              <>
                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Blog Articles</h2>
                      <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: "13px" }}>Edit the posts shown on the blog list and article pages.</p>
                    </div>
                    <button onClick={addArticle} style={{ border: "1px solid #b7844c", backgroundColor: "#fff", color: "#b7844c", borderRadius: "8px", padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>
                      Add Article
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "14px" }}>
                    {content.articles.map((item, index) => (
                      <article key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", backgroundColor: "#fff" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "14px", padding: "14px" }}>
                          <div
                            style={{
                              minHeight: "140px",
                              borderRadius: "10px",
                              backgroundImage: `url('${item.image}')`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <div style={{ display: "grid", gap: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                              <div>
                                <p style={{ margin: 0, fontWeight: 700, color: "#374151" }}>Article #{item.id}</p>
                                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280" }}>Used on the blog list and blog details page</p>
                              </div>
                              <button onClick={() => removeArticle(index)} style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "6px 10px", cursor: "pointer" }}>
                                Remove
                              </button>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
                              {[
                                ["Slug", item.slug, "slug"],
                                ["Title", item.title, "title"],
                                ["Date", item.date, "date"],
                                ["Image URL", item.image, "image"],
                              ].map(([label, value, key]) => (
                                <label key={key as string} style={{ display: "grid", gap: "6px" }}>
                                  <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>{label}</span>
                                  <input
                                    value={value as string}
                                    onChange={(e) => updateArticle(index, { [key as keyof ArticleItem]: e.target.value } as Partial<ArticleItem>)}
                                    style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                                  />
                                </label>
                              ))}
                            </div>

                            <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>Excerpt</span>
                              <textarea
                                value={item.excerpt}
                                onChange={(e) => updateArticle(index, { excerpt: e.target.value })}
                                rows={3}
                                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px", resize: "vertical" }}
                              />
                            </label>

                            <label style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>Article Content</span>
                              <textarea
                                value={item.content}
                                onChange={(e) => updateArticle(index, { content: e.target.value })}
                                rows={6}
                                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px", fontSize: "13px", resize: "vertical" }}
                              />
                            </label>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", display: "grid", gap: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: "20px", color: "#111827" }}>Blog Sidebar Items</h2>
                    <button onClick={addBlogSidebarItem} style={{ border: "1px solid #b7844c", backgroundColor: "#fff", color: "#b7844c", borderRadius: "8px", padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>
                      Add Sidebar Item
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {content.blogSidebarItems.map((item, index) => (
                      <article key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px", display: "grid", gap: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                          <p style={{ margin: 0, fontWeight: 700, color: "#374151" }}>Sidebar Item #{item.id}</p>
                          <button onClick={() => removeBlogSidebarItem(index)} style={{ border: "1px solid #fecaca", backgroundColor: "#fff1f2", color: "#b91c1c", borderRadius: "8px", padding: "6px 10px", cursor: "pointer" }}>
                            Remove
                          </button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "10px" }}>
                          {[
                            ["Title", item.title, "title"],
                            ["Price", item.price, "price"],
                            ["Image URL", item.image, "image"],
                            ["Link", item.href, "href"],
                          ].map(([label, value, key]) => (
                            <label key={key as string} style={{ display: "grid", gap: "6px" }}>
                              <span style={{ fontSize: "12px", color: "#555", fontWeight: 600 }}>{label}</span>
                              <input
                                value={value as string}
                                onChange={(e) => updateBlogSidebarItem(index, { [key as keyof BlogSidebarItem]: e.target.value } as Partial<BlogSidebarItem>)}
                                style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "9px 10px", fontSize: "13px" }}
                              />
                            </label>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}

            {activeSection === "contact" && (
              <>
                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ margin: "0 0 14px", fontSize: "20px", color: "#111827" }}>Contact Actions</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                    {[
                      ["Phone", content.contactActions.phone, "phone"],
                      ["Email", content.contactActions.email, "email"],
                      ["WhatsApp Number", content.contactActions.whatsapp, "whatsapp"],
                      ["WhatsApp Message", content.contactActions.whatsappMessage, "whatsappMessage"],
                    ].map(([label, value, key]) => (
                      <label key={key as string} style={{ display: "grid", gap: "6px" }}>
                        <span style={{ fontSize: "13px", color: "#444", fontWeight: 600 }}>{label}</span>
                        <input
                          value={value as string}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              contactActions: {
                                ...prev.contactActions,
                                [key as "phone" | "email" | "whatsapp" | "whatsappMessage"]: e.target.value,
                              },
                            }))
                          }
                          style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "10px 12px", fontSize: "14px" }}
                        />
                      </label>
                    ))}
                  </div>
                </section>

                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ margin: "0 0 14px", fontSize: "20px", color: "#111827" }}>Contact Form Settings</h2>
                  <label style={{ display: "grid", gap: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#444", fontWeight: 600 }}>How did you hear about us? (Options)</span>
                    <p style={{ margin: "0 0 10px", fontSize: "12px", color: "#666" }}>
                      One option per line
                    </p>
                    <textarea
                      value={contactFormOptions.join("\n")}
                      onChange={(e) => {
                        const options = e.target.value
                          .split("\n")
                          .map((opt) => opt.trim())
                          .filter((opt) => opt.length > 0);
                        setContent((prev) => ({
                          ...prev,
                          contactFormSettings: {
                            ...(prev.contactFormSettings ?? defaultSiteContent.contactFormSettings),
                            hearAboutUsOptions: options,
                          },
                        }));
                      }}
                      rows={8}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "10px 12px",
                        fontSize: "13px",
                        fontFamily: "monospace",
                        resize: "vertical",
                      }}
                    />
                  </label>
                </section>

                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)" }}>
                  <h2 style={{ margin: "0 0 14px", fontSize: "20px", color: "#111827" }}>How Did You Hear About Us Counts</h2>
                  <p style={{ margin: "0 0 14px", color: "#666", fontSize: "13px" }}>
                    Number of clients who selected each option.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
                    {hearAboutUsCounts.map((item) => (
                      <div key={item.option} style={{ border: "1px solid #e5e7eb", borderRadius: "10px", padding: "12px", backgroundColor: "#fafafa" }}>
                        <p style={{ margin: 0, fontSize: "13px", color: "#4b5563", fontWeight: 600 }}>{item.option}</p>
                        <p style={{ margin: "6px 0 0", fontSize: "22px", color: "#111827", fontWeight: 700 }}>{item.count}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section style={{ backgroundColor: "#fff", borderRadius: "14px", padding: "20px 22px", boxShadow: "0 4px 22px rgba(0,0,0,0.06)", overflowX: "auto" }}>
                  <h2 style={{ margin: "0 0 10px", fontSize: "20px", color: "#111827" }}>Client List from Contact Forms</h2>
                  <p style={{ margin: "0 0 16px", color: "#666", fontSize: "13px" }}>
                    Total: {leadStats.total} | Home: {leadStats.home} | Contact: {leadStats.contact} | Company: {leadStats.company}
                  </p>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "820px" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f8fafc" }}>
                        {[
                          "Date",
                          "Source",
                          "Name",
                          "Email",
                          "Phone",
                          "Message",
                          "How Heard",
                        ].map((head) => (
                          <th key={head} style={{ textAlign: "left", padding: "10px 8px", fontSize: "12px", color: "#475569", borderBottom: "1px solid #e5e7eb" }}>
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((item) => (
                        <tr key={item.id}>
                          <td style={{ padding: "10px 8px", borderBottom: "1px solid #f1f5f9", fontSize: "12px" }}>{new Date(item.createdAt).toLocaleString()}</td>
                          <td style={{ padding: "10px 8px", borderBottom: "1px solid #f1f5f9", fontSize: "12px" }}>{item.source}</td>
                          <td style={{ padding: "10px 8px", borderBottom: "1px solid #f1f5f9", fontSize: "12px" }}>{item.name}</td>
                          <td style={{ padding: "10px 8px", borderBottom: "1px solid #f1f5f9", fontSize: "12px" }}>{item.email}</td>
                          <td style={{ padding: "10px 8px", borderBottom: "1px solid #f1f5f9", fontSize: "12px" }}>{item.phone}</td>
                          <td style={{ padding: "10px 8px", borderBottom: "1px solid #f1f5f9", fontSize: "12px", maxWidth: "360px" }}>{item.message}</td>
                          <td style={{ padding: "10px 8px", borderBottom: "1px solid #f1f5f9", fontSize: "12px", maxWidth: "220px" }}>
                            {Array.isArray(item.hearAboutUs) && item.hearAboutUs.length > 0 ? item.hearAboutUs.join(", ") : "-"}
                          </td>
                        </tr>
                      ))}
                      {submissions.length === 0 && (
                        <tr>
                          <td colSpan={7} style={{ padding: "16px 8px", color: "#6b7280", fontSize: "13px" }}>
                            No contact submissions yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </section>
              </>
            )}

            <p style={{ margin: "-8px 0 0", color: "#666", fontSize: "13px" }}>{status}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
