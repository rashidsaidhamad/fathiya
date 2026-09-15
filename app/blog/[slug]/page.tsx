"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { defaultSiteContent, type ArticleItem } from "../../../lib/siteContent";

function toMap(items: ArticleItem[]) {
  return Object.fromEntries(
    items.map((item) => [
      item.slug,
      {
        title: item.title,
        date: item.date,
        image: item.image,
        content: item.content,
      },
    ])
  ) as Record<string, { title: string; date: string; image: string; content: string }>;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [posts, setPosts] = useState<Record<string, { title: string; date: string; image: string; content: string }>>(
    toMap(defaultSiteContent.articles)
  );

  useEffect(() => {
    fetch("/api/site-content")
      .then((res) => res.json())
      .then((data) => setPosts(toMap(data.articles)))
      .catch(() => {
        // Keep defaults.
      });
  }, []);

  const post = posts[slug];

  if (!post) {
    return (
      <>
        <Navbar forceWhite />
        <div style={{ paddingTop: "160px", textAlign: "center", minHeight: "60vh" }}>
          <h1 style={{ fontSize: "28px", fontFamily: "var(--font-display)", color: "var(--ink)" }}>Post not found</h1>
          <a href="/blog" style={{ color: "var(--accent-dark)", fontSize: "15px", fontWeight: 600 }}>← Back to Blog</a>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar forceWhite />
      <div style={{ paddingTop: "110px", backgroundColor: "var(--background)", minHeight: "100vh" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 clamp(16px, 3vw, 24px) clamp(40px, 6vw, 60px)" }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "20px" }}>
            <a href="/" style={{ color: "var(--ink-soft)", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 6px" }}>›</span>
            <a href="/blog" style={{ color: "var(--ink-soft)", textDecoration: "none" }}>Blog List</a>
            <span style={{ margin: "0 6px" }}>›</span>
            <span style={{ color: "var(--accent-dark)", fontWeight: 600 }}>{post.title}</span>
          </div>

          {/* Post card */}
          <div style={{ backgroundColor: "var(--surface)", borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
            <img src={post.image} alt={post.title} style={{ width: "100%", height: "380px", objectFit: "cover" }} />
            <div style={{ padding: "clamp(24px, 4vw, 44px)" }}>
              <p style={{ fontSize: "12px", color: "var(--accent-dark)", marginBottom: "14px", fontWeight: 700, letterSpacing: "0.5px" }}>{post.date}</p>
              <h1 style={{ fontSize: "clamp(24px, 4vw, 30px)", fontWeight: 700, color: "var(--ink)", marginBottom: "26px", fontFamily: "var(--font-display)", lineHeight: 1.35 }}>
                {post.title}
              </h1>
              {post.content.split("\n\n").map((para, i) => (
                <p key={i} style={{ fontSize: "15px", color: "var(--ink-soft)", lineHeight: 1.85, marginBottom: "18px" }}>
                  {para}
                </p>
              ))}
              <div style={{ marginTop: "32px", paddingTop: "22px", borderTop: "1px solid var(--border)" }}>
                <a href="/blog" style={{ color: "var(--accent-dark)", fontSize: "14px", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
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
