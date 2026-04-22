"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";
import { useSiteContent } from "../hooks/useSiteContent";
import { toMailtoHref, toTelHref, toWhatsAppHref } from "../../lib/contactLinks";

const companyPillars = [
  {
    title: "Our Mission",
    text: "Our mission is to provide safe, transparent, and professional real estate services in Zanzibar. We help clients buy land, sell or rent properties, and complete investments with full legal compliance.",
  },
  {
    title: "Our Vision",
    text: "Our vision is to become one of the most trusted and leading real estate companies in Zanzibar by setting high standards in professionalism, legal compliance, and client satisfaction.",
  },
  {
    title: "Our Values",
    text: "At Archipelago Property Zanzibar Company Ltd, our values guide everything we do: honesty, transparency, integrity, and accountability. We provide clear communication and dependable service at every step.",
  },
  {
    title: "Our Resources",
    text: "We combine market knowledge, legal guidance, and verified property information to support every transaction. Our team works with trusted institutions to ensure smooth, secure outcomes for clients.",
  },
];

const faqs = [
  {
    q: "Why is it considered necessary to register Agreement for Sale?",
    a: "Registration protects both buyer and seller by formally recording terms and helping avoid disputes during ownership transfer.",
  },
  {
    q: "Do I need to pay stamp duty if the property is transferred as a gift?",
    a: "Rules may vary by property type and relationship of parties. Our team can guide you through current Zanzibar requirements.",
  },
  {
    q: "What is carpet area?",
    a: "Carpet area is the usable floor area inside a property, excluding walls, balconies, and shared spaces.",
  },
  {
    q: "What documents should a buyer request?",
    a: "Buyers should verify title documents, ownership history, relevant approvals, and payment receipts before finalizing any purchase.",
  },
  {
    q: "How can I qualify for exemptions on Capital Gains Tax?",
    a: "Tax exemptions depend on transaction details and legal classification. We recommend a case review with a legal advisor.",
  },
  {
    q: "How soon can I receive a sale agreement after writing?",
    a: "The timeline depends on document readiness and approvals, but most drafts can be prepared quickly after all required details are provided.",
  },
];

export default function CompanyPage() {
  const [formStatus, setFormStatus] = useState("");
  const content = useSiteContent();

  const handleCompanySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setFormStatus("Sending...");

    const response = await fetch("/api/contact-submissions", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      setFormStatus("Could not send. Please try again.");
      return;
    }

    const payload = (await response.json()) as {
      emailRouting?: {
        to?: string;
        from?: string;
        sent?: boolean;
      };
    };
    const emailRouting = payload.emailRouting;
    const deliveryText = emailRouting
      ? ` Sent to: ${emailRouting.to ?? "-"}. Sent from: ${emailRouting.from ?? "-"}.${emailRouting.sent ? "" : " SMTP is not configured yet."}`
      : "";

    setFormStatus(`Thanks! Your message was received.${deliveryText}`);
    form.reset();
  };

  return (
    <main className="company-page" style={{ backgroundColor: "#efefef" }}>
      <Navbar forceWhite />

      <section className="company-hero">
        <div className="company-hero-overlay" />
        <div className="company-hero-copy">
          <p>Get to know our talented team</p>
          <h1>More about us</h1>
        </div>
      </section>

      <section className="company-section company-intro">
        <div className="intro-wrap">
          <div className="intro-heading">
            <p>WHO WE ARE</p>
            <h2>About our company</h2>
          </div>
          <p>
            Archipelago Property Zanzibar Company Ltd is a professional real estate company based in Mlandege, Zanzibar.
            We specialize in land sales, property rentals, and full investment support for local and foreign clients.
          </p>
          <p>
            Our main goal is to help clients invest in Zanzibar safely, legally, and with confidence. We understand that
            buying land or property can be complex, especially for foreign investors, so we provide clear guidance,
            honest advice, and complete support through every step.
          </p>
          <p>
            Whether you are buying land, renting a property, or planning a larger investment project, our experienced
            team ensures each process is handled professionally and transparently.
          </p>
          <div className="pillar-grid">
            {companyPillars.map((pillar) => (
              <article key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="company-section company-team">
        <div className="section-head">
          <p>OUR AGENTS</p>
          <h2>Meet our team</h2>
          <span>If you want the best care possible for your real estate needs, our certified professionals are here to help.</span>
        </div>

        <div style={{ width: "min(1040px, 100%)", margin: "0 auto", display: "grid", gap: "18px", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
          {content.companyTeam.map((member) => (
            <article key={member.id} className="team-card" style={{ maxWidth: "unset" }}>
              <div className="team-logo-wrap">
                <div
                  role="img"
                  aria-label={member.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    backgroundImage: `url('${member.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <p>{member.description}</p>
              <p>
                <a href={toMailtoHref(member.email)} style={{ color: "#5f5f5f", textDecoration: "none" }}>{member.email}</a>
              </p>
              <p>
                <a href={toTelHref(member.phone)} style={{ color: "#5f5f5f", textDecoration: "none" }}>{member.phone}</a>
              </p>
              <p style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                {member.facebook && <a href={member.facebook} target="_blank" rel="noreferrer" style={{ color: "#5f5f5f", textDecoration: "none" }}>Facebook</a>}
                {member.instagram && <a href={member.instagram} target="_blank" rel="noreferrer" style={{ color: "#5f5f5f", textDecoration: "none" }}>Instagram</a>}
                {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" style={{ color: "#5f5f5f", textDecoration: "none" }}>LinkedIn</a>}
                {member.whatsapp && <a href={toWhatsAppHref(member.whatsapp, content.contactActions.whatsappMessage)} target="_blank" rel="noreferrer" style={{ color: "#5f5f5f", textDecoration: "none" }}>WhatsApp</a>}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="testimonials" className="company-section company-testimonials">
        <div className="section-head">
          <h2>Testimonials</h2>
          <span>Publish the best of your client testimonials and let the world know what a great real estate agency you are.</span>
        </div>
        <div className="testimonial-grid">
          {content.companyTestimonials.map((item) => (
            <article key={item.id}>
              <h3>{item.name}</h3>
              <p className="role">{item.role}</p>
              <p>{item.text}</p>
              <div className="stars">{"★".repeat(Math.max(1, item.stars))}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="company-section company-faq">
        <div className="section-head">
          <h2>Frequently Asked Questions</h2>
          <span>You can use this guide to familiarize yourself with rules, taxes, and other important information related to your property.</span>
        </div>
        <div className="faq-grid">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="company-section company-contact">
        <div className="contact-card">
          <div className="contact-photo" />
          <div className="contact-form-wrap">
            <h2>Get in touch with us to plan your next transaction</h2>
            <p>Our experts and developers would love to contribute their expertise and insights and help you today.</p>
            <form onSubmit={handleCompanySubmit}>
              <input type="hidden" name="source" value="company" />
              <div className="form-grid">
                <label>
                  Last name*
                  <input type="text" name="lastName" placeholder="Last name" required />
                </label>
                <label>
                  First name*
                  <input type="text" name="firstName" placeholder="First name" required />
                </label>
                <label>
                  Email*
                  <input type="email" name="email" placeholder="Email" required />
                </label>
                <label>
                  Mobile
                  <input type="text" name="phone" placeholder="+255" />
                </label>
              </div>
              <label className="message-field">
                Message
                <textarea name="message" rows={4} placeholder="Message" required />
              </label>
              <button type="submit">Send Email</button>
              <p style={{ marginTop: "10px", fontSize: "12px", color: "#555" }}>{formStatus}</p>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
