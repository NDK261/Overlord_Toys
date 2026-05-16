"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [showPw, setShowPw]     = useState(false);

  const getSafeRedirectPath = () => {
    const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");

    if (callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")) {
      return callbackUrl;
    }

    return "/";
  };

  const handleGoogleLogin = async () => {
    if (!supabase) return;
    const next = getSafeRedirectPath();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) setError(error.message);
    } catch (err) {
      setError("Unable to initiate Google authentication.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else if (data.user) {
        router.push(getSafeRedirectPath());
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(111,247,232,0.15)",
    borderRadius: 8,
    color: "#d4e5ec",
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    padding: "13px 14px 13px 44px",
    outline: "none",
    caretColor: "#6FF7E8",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(111,247,232,0.6)";
    e.target.style.boxShadow   = "0 0 0 3px rgba(111,247,232,0.07)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = "rgba(111,247,232,0.15)";
    e.target.style.boxShadow   = "none";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
        
        html, body { height: 100%; margin: 0; padding: 0; background: #06151a; }
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes btnPulse {
          0%,100% { box-shadow: 0 0 18px rgba(111,247,232,0.4); }
          50%      { box-shadow: 0 0 36px rgba(111,247,232,0.7); }
        }
        .form-anim { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }

        .cta-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(90deg, #6FF7E8, #1F7EA1);
          color: #003732; border: none; border-radius: 8px;
          font-family: Inter, sans-serif; font-size: 14px; font-weight: 700;
          letter-spacing: 0.04em; cursor: pointer;
          animation: btnPulse 2.5s ease-in-out infinite;
          transition: filter 0.2s, transform 0.15s;
        }
        .cta-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        .cta-btn:active:not(:disabled) { transform: translateY(0); }
        .cta-btn:disabled { opacity: 0.6; cursor: not-allowed; animation: none; }

        .ghost-btn {
          width: 100%; padding: 13px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; color: #d4e5ec;
          font-family: Inter, sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: background 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .ghost-btn:hover { background: rgba(255,255,255,0.09); }

        .vis-btn {
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center;
          color: rgba(111,247,232,0.45);
          transition: color 0.2s;
        }
        .vis-btn:hover { color: rgba(111,247,232,0.9); }

        .ms {
          font-family: 'Material Symbols Outlined';
          font-weight: normal; font-style: normal; font-size: 20px;
          display: inline-block; direction: ltr; letter-spacing: normal;
          text-transform: none; white-space: nowrap;
          font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased;
        }

        .auth-root {
          min-height: 100dvh;
          width: 100%;
          position: relative;
          background: #06151a;
          display: flex;
          overflow: hidden;
        }

        .auth-bg-img {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 100dvh;
          object-fit: contain;
          object-position: 96% center;
          opacity: 0.64;
          mix-blend-mode: lighten;
          filter: saturate(0.58) brightness(0.84) blur(0.55px);
          z-index: 0;
        }

        .auth-bg-grad {
          position: fixed;
          inset: 0;
          z-index: 1;
          background: linear-gradient(to bottom, rgba(6,21,26,0.74) 0%, rgba(6,21,26,0.79) 100%);
        }

        .auth-left {
          position: relative;
          z-index: 10;
          width: 50%;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translateX(10%);
          padding: 40px clamp(20px, 4vw, 56px);
        }

        .auth-panel {
          width: 100%;
          max-width: 440px;
          background: rgba(8, 22, 28, 0.72);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(111,247,232,0.12);
          border-radius: 20px;
          padding: 44px 36px 40px;
          box-shadow: 0 8px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(111,247,232,0.03) inset;
        }

        @media (max-width: 820px) {
          .auth-bg-img {
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: 65% center;
            opacity: 0.5;
            mix-blend-mode: normal;
            filter: saturate(0.4) brightness(0.62) blur(0.6px);
          }
          .auth-left {
            width: 100%;
            transform: none;
            padding: 60px 20px 32px;
          }
          .auth-bg-grad {
            background: rgba(6,21,26,0.88);
          }
        }

        @media (max-height: 700px) {
          .auth-left {
            align-items: flex-start;
            padding-top: 28px;
            padding-bottom: 28px;
          }
        }
      `}</style>

      <div className="auth-root">
        <img
          src="https://p-bandai.com/files/seller-products/FSP0000021002/jc2hgJ6lMjwZpzllaQEp.webp"
          alt="" aria-hidden
          className="auth-bg-img"
        />
        <div className="auth-bg-grad" />

        <div className="auth-left">
          <div className="auth-panel">
            <div className="form-anim" style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            <p style={{
              fontFamily: "Inter, sans-serif", fontSize: 11,
              letterSpacing: "0.32em", fontWeight: 700, color: "#6FF7E8",
              textAlign: "center",
            }}>OVERLORD TOYS</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "center" }}>
              <h1 style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontSize: 36, fontWeight: 800, color: "#ffffff",
                letterSpacing: "-0.02em", lineHeight: 1.1,
              }}>Welcome Back</h1>
              <p style={{
                fontFamily: "Inter, sans-serif", fontSize: 14,
                color: "rgba(212,229,236,0.45)",
              }}>Access your collector&apos;s vault.</p>
            </div>

            {error && (
              <div style={{
                padding: "12px 14px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: 8,
                color: "#ff8282",
                fontSize: 13,
                fontFamily: "Inter, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <span className="ms" style={{ fontSize: 18 }}>error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ position: "relative" }}>
                <span className="ms" style={{
                  position: "absolute", left: 13, top: "50%",
                  transform: "translateY(-50%)", color: error ? "rgba(239, 68, 68, 0.45)" : "rgba(111,247,232,0.45)",
                }}>person</span>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address" required autoComplete="email"
                  style={{ ...inputStyle, borderColor: error ? "rgba(239, 68, 68, 0.3)" : inputStyle.borderColor }}
                  onFocus={onFocus} onBlur={onBlur}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ position: "relative" }}>
                  <span className="ms" style={{
                    position: "absolute", left: 13, top: "50%",
                    transform: "translateY(-50%)", color: "rgba(111,247,232,0.45)", zIndex: 1,
                  }}>lock</span>
                  <input
                    type={showPw ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" required autoComplete="current-password"
                    style={{ ...inputStyle, paddingRight: 48 }}
                    onFocus={onFocus} onBlur={onBlur}
                  />
                  <button type="button" className="vis-btn" onClick={() => setShowPw(!showPw)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", zIndex: 1 }}>
                    <span className="ms">{showPw ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Link href="/forgot-password" style={{
                    fontFamily: "Inter, sans-serif", fontSize: 12,
                    color: "#6FF7E8", textDecoration: "none",
                  }}>Forgot Cipher?</Link>
                </div>
              </div>

              <button type="submit" className="cta-btn" disabled={loading}>
                {loading ? "Accessing..." : "Initialise Access →"}
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "rgba(212,229,236,0.3)" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            </div>

            <button type="button" className="ghost-btn" onClick={handleGoogleLogin}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            <p style={{
              fontFamily: "Inter, sans-serif", fontSize: 13,
              color: "rgba(212,229,236,0.4)", textAlign: "center",
              marginTop: 12,
            }}>
              Not a curator?{" "}
              <Link href="/register" style={{
                color: "#6FF7E8", fontWeight: 700, textDecoration: "none",
              }}>Create Account →</Link>
            </p>

            </div>
          </div>
        </div>

        <div style={{
          position: "fixed", right: 52, bottom: 52, zIndex: 10,
          width: "min(360px, 38vw)", pointerEvents: "none",
          textAlign: "right", display: "flex", flexDirection: "column", gap: 10
        }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.25em", color: "rgba(111,247,232,0.45)" }}>
            ARTIFACT_ID: G-114-AS
          </p>
          <h2 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 24, fontWeight: 800, color: "#ffffff" }}>
            The Aerial Perfection
          </h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(212,229,236,0.5)", lineHeight: 1.6 }}>
            Verify your identity to manage your high-fidelity collection and access the private marketplace.
          </p>
        </div>

      </div>
    </>
  );
}
