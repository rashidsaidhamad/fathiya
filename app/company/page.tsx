"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaHandshake,
  FaEye,
  FaShieldAlt,
  FaClipboardCheck,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useSiteContent } from "../hooks/useSiteContent";
import { toMailtoHref, toTelHref, toWhatsAppHref } from "../../lib/contactLinks";
import ExpandableDescription from "../components/ExpandableDescription";

const coreValues = [
  {
    icon: <FaHandshake size={20} />,
    title: "Honesty",
    text: "We give clients clear, straightforward advice — no hidden fees, no surprises.",
  },
  {
    icon: <FaEye size={20} />,
    title: "Transparency",
    text: "Every step of your transaction is explained clearly, so you always know where you stand.",
  },
  {
    icon: <FaShieldAlt size={20} />,
    title: "Integrity",
    text: "We hold ourselves to the highest ethical standards in every deal we handle.",
  },
  {
    icon: <FaClipboardCheck size={20} />,
    title: "Accountability",
    text: "We stand behind our advice and follow through until the job is done.",
  },
];

const companyStats = [
  { value: "10+", label: "Years of combined market experience" },
  { value: "500+", label: "Happy clients across Zanzibar" },
  { value: "300+", label: "Properties sold or rented" },
  { value: "100%", label: "Legal & ZIPA compliant transactions" },
];

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
  const content = useSiteContent();

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

      <section className="company-section company-values">
        <div className="section-head">
          <p>WHAT DRIVES US</p>
          <h2>Our Core Values</h2>
        </div>
        <div className="core-values-grid">
          {coreValues.map((v) => (
            <article key={v.title}>
              <div className="core-value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="company-section company-team">
        <div className="section-head">
          <p>OUR AGENTS</p>
          <h2>Meet our team</h2>
          <span>If you want the best care possible for your real estate needs, our certified professionals are here to help.</span>
        </div>

        <div className="team-grid">
          {content.companyTeam.map((member) => (
            <article key={member.id} className="team-card">
              <div className="team-logo-wrap">
                <div
                  role="img"
                  aria-label={member.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url('${member.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "top center",
                  }}
                />
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <ExpandableDescription
                description={member.description}
                maxLength={55}
                color="#5f5f5f"
                fontSize="10.5px"
                marginBottom="8px"
              />
              <div className="team-icon-row">
                {member.email && (
                  <a href={toMailtoHref(member.email)} title={member.email} aria-label="Email">
                    <FaEnvelope size={9} />
                  </a>
                )}
                {member.phone && (
                  <a href={toTelHref(member.phone)} title={member.phone} aria-label="Phone">
                    <FaPhone size={9} />
                  </a>
                )}
                {member.whatsapp && (
                  <a href={toWhatsAppHref(member.whatsapp, content.contactActions.whatsappMessage)} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                    <FaWhatsapp size={9} />
                  </a>
                )}
                {member.facebook && (
                  <a href={member.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                    <FaFacebookF size={9} />
                  </a>
                )}
                {member.instagram && (
                  <a href={member.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                    <FaInstagram size={9} />
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <FaLinkedinIn size={9} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="testimonials" className="company-section company-testimonials">
        <div className="section-head">
          <h2>Testimonials</h2>
          <span>Publish the best of your client testimonials and let the world know what a great real estate agency you are.</span>
        </div>
        <div className="testimonial-grid" style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-start" }}>
          {content.companyTestimonials.map((item) => (
            <article key={item.id} style={{ display: "flex", flexDirection: "column", minHeight: "320px", flex: "1 1 280px" }}>
              <div className="testimonial-quote">&rdquo;</div>
              <div className="testimonial-head">
                <div className="testimonial-avatar">{item.name.slice(0, 1).toUpperCase()}</div>
                <div>
                  <h3>{item.name}</h3>
                  <p className="role">{item.role}</p>
                </div>
              </div>
              <ExpandableDescription
                description={item.text}
                maxLength={200}
                color="#555"
                fontSize="14px"
                marginBottom="16px"
              />
              <div className="stars">{"★".repeat(Math.max(1, item.stars))}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="company-section company-stats">
        <div className="stats-grid">
          {companyStats.map((s) => (
            <div key={s.label}>
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="company-section company-cta">
        <h2>Ready to Start Your Property Journey?</h2>
        <p>Talk to our team today — we&apos;re ready to help you find, buy, or invest in the right property in Zanzibar.</p>
        <div className="cta-buttons">
          <a href="/properties" className="cta-primary">View Properties</a>
          <a href="/contact" className="cta-secondary">Contact Us</a>
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

      <Footer />
    </main>
  );
}
