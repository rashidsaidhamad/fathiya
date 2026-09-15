"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    const handlePageLoad = () => {
      setIsVisible(false);
    };

    window.addEventListener("load", handlePageLoad);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handlePageLoad);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        zIndex: 9999,
        animation: "fadeOut 0.5s ease-in-out forwards",
        animationDelay: "1.8s",
      }}
    >
      <style>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div style={{ textAlign: "center" }}>
        {/* Outer spinning circle */}
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid var(--accent, #c49a6c)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 24px",
          }}
        />

        {/* Loading text */}
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            fontFamily: "var(--font-sans, Arial, sans-serif)",
            color: "var(--navy, #1a1e2e)",
            fontWeight: 500,
            letterSpacing: "0.5px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          Loading...
        </p>

        {/* Subtext */}
        <p
          style={{
            margin: "8px 0 0",
            fontSize: "12px",
            color: "#6b7280",
          }}
        >
          Welcome to Archipelago Real Estate
        </p>
      </div>
    </div>
  );
}
