"use client";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const posts: Record<string, { title: string; date: string; image: string; content: string }> = {
  "buying-land-zanzibar": {
    title: "Complete Guide to Buying Land in Zanzibar",
    date: "December 14, 2025",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80",
    content: `Buying land in Zanzibar is a great opportunity for both local buyers and foreign investors. Zanzibar offers strong economic growth, beautiful landscapes, and a growing real estate market.\n\nWhether you are looking for beachfront property, agricultural land, or urban plots, Zanzibar has a wide variety of options. The process of buying land involves working with the Zanzibar Investment Promotion Authority (ZIPA) and the Ministry of Land.\n\nKey steps include: identifying your land, conducting a title search, negotiating the purchase price, drafting a sale agreement, and registering the title deed. Foreign investors typically lease land for 33, 66, or 99 years under Tanzanian law.\n\nIt is highly recommended to work with a licensed real estate agent and a local attorney to ensure the transaction is legally compliant and that your investment is protected.`,
  },
  "zipa-approval-foreign-property": {
    title: "How ZIPA Approval Works for Foreign Property Investors",
    date: "December 14, 2025",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
    content: `Zanzibar is one of the most attractive destinations for foreign property investors. The Zanzibar Investment Promotion Authority (ZIPA) is the government body that facilitates and regulates foreign investment on the island.\n\nTo invest in real estate as a foreigner, you must obtain a Certificate of Incentives from ZIPA. This involves submitting an investment proposal, proof of funds, and a business plan.\n\nOnce approved, investors can lease land for up to 99 years. ZIPA also provides guidance on tax incentives, work permits, and business registration. The process typically takes 2-4 weeks for standard applications.\n\nWorking with a reputable real estate agency like Archipelago Properties Zanzibar ensures your application is properly prepared and submitted.`,
  },
  "best-travel-experiences": {
    title: "Best Travel Experiences and Property Opportunities in Zanzibar",
    date: "March 4, 2016",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80",
    content: `Zanzibar is a beautiful island destination that offers more than just holidays. It is a place where you can enjoy a unique blend of culture, history, and natural beauty — while also exploring excellent property investment opportunities.\n\nFrom the historic Stone Town to the pristine beaches of Nungwi and Kendwa, every corner of Zanzibar offers something special. The island's tourism industry has grown significantly, making it one of East Africa's top destinations.\n\nFor property investors, this growth translates to high rental yields and strong capital appreciation. Holiday villas, boutique hotels, and beachfront apartments are particularly in demand.\n\nContact Archipelago Real Estate to explore available properties that combine lifestyle and investment potential.`,
  },
  "investment-opportunities-zanzibar": {
    title: "Top Investment Opportunities in Zanzibar 2025",
    date: "January 10, 2026",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    content: `Zanzibar's real estate market is booming. With new regulations and increasing tourism, 2025 is the ideal time to invest in the island's property sector.\n\nThe government has introduced investor-friendly policies, including long-term leasehold options and streamlined approval processes. Areas like Mlandege, Bwejuu, and Paje are seeing significant development activity.\n\nKey investment categories include residential villas, commercial properties, hospitality developments, and agricultural land. Rental yields for holiday properties can reach 8-12% annually in prime locations.\n\nArchipelago Real Estate has an extensive portfolio of investment-grade properties. Get in touch with our team to discuss your investment goals.`,
  },
  "property-laws-foreigners": {
    title: "Understanding Property Laws for Foreigners in Tanzania",
    date: "February 5, 2026",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    content: `Foreign nationals looking to buy property in Tanzania must navigate specific legal frameworks. Understanding these laws is essential to making a safe and profitable investment.\n\nUnder Tanzanian law, land is owned by the government and can only be leased. Foreigners may obtain a Right of Occupancy for up to 99 years through ZIPA or a Granted Right of Occupancy for investment purposes.\n\nKey legal requirements include: registering the lease with the Land Registry, obtaining ZIPA approval for foreign investments, paying stamp duty and transfer fees, and working with a licensed local conveyancer.\n\nArchipelago Real Estate works with trusted legal partners to guide investors through every step of the property acquisition process in Zanzibar.`,
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = posts[slug];

  if (!post) {
    return (
      <>
        <Navbar forceWhite />
        <div style={{ paddingTop: "120px", textAlign: "center", minHeight: "60vh" }}>
          <h1 style={{ fontSize: "28px", color: "#333" }}>Post not found</h1>
          <a href="/blog" style={{ color: "#c49a6c", fontSize: "15px" }}>← Back to Blog</a>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar forceWhite />
      <div style={{ paddingTop: "70px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "36px 24px" }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>
            <a href="/" style={{ color: "#555", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 6px" }}>›</span>
            <a href="/blog" style={{ color: "#555", textDecoration: "none" }}>Blog List</a>
            <span style={{ margin: "0 6px" }}>›</span>
            <span style={{ color: "#c49a6c", fontWeight: 600 }}>{post.title}</span>
          </div>

          {/* Post card */}
          <div style={{ backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
            <img src={post.image} alt={post.title} style={{ width: "100%", height: "380px", objectFit: "cover" }} />
            <div style={{ padding: "36px" }}>
              <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "12px" }}>{post.date}</p>
              <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#1a1a2e", marginBottom: "24px", fontFamily: "Georgia, serif", lineHeight: 1.4 }}>
                {post.title}
              </h1>
              {post.content.split("\n\n").map((para, i) => (
                <p key={i} style={{ fontSize: "15px", color: "#555", lineHeight: 1.8, marginBottom: "18px" }}>
                  {para}
                </p>
              ))}
              <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
                <a href="/blog" style={{ color: "#c49a6c", fontSize: "14px", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
                  ← Back to Blog List
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
