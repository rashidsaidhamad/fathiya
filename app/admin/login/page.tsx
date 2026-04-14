"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setStatus("Signing in...");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      setBusy(false);
      setStatus("Invalid username or password");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", backgroundColor: "#f4f0e8", padding: "20px" }}>
      <section style={{ width: "min(420px, 100%)", backgroundColor: "#fff", borderRadius: "14px", padding: "28px", boxShadow: "0 10px 34px rgba(18, 21, 27, 0.12)" }}>
        <h1 style={{ margin: "0 0 8px", fontFamily: "Georgia, serif", fontSize: "34px", color: "#1f2937" }}>Admin Login</h1>
        <p style={{ margin: "0 0 16px", color: "#6b7280", fontSize: "14px" }}>Sign in to manage website pages and content.</p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <label style={{ display: "grid", gap: "6px" }}>
            <span style={{ fontSize: "13px", color: "#374151", fontWeight: 600 }}>Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", fontSize: "14px" }}
            />
          </label>
          <label style={{ display: "grid", gap: "6px" }}>
            <span style={{ fontSize: "13px", color: "#374151", fontWeight: 600 }}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ border: "1px solid #d1d5db", borderRadius: "8px", padding: "10px 12px", fontSize: "14px" }}
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            style={{ border: "none", backgroundColor: "#b7844c", color: "#fff", borderRadius: "8px", padding: "11px 14px", fontWeight: 700, cursor: "pointer" }}
          >
            {busy ? "Please wait..." : "Sign In"}
          </button>
          <p style={{ margin: 0, minHeight: "18px", fontSize: "12px", color: "#7f1d1d" }}>{status}</p>
        </form>
      </section>
    </main>
  );
}
