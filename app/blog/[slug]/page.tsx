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
