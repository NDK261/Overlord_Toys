"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

type ViewState = "form" | "loading" | "success";

export default function ForgotPasswordPage() {
  const [email, setEmail]         = useState("");
  const [view, setView]           = useState<ViewState>("form");
  const [error, setError]         = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const timerRef                  = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setView("loading");
    setError(null);

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/account/reset-password`,
      });

      if (authError) {
        setError(authError.message);
        setView("form");
      } else {
        setView("success");
        startCountdown();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setView("form");
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !supabase) return;
    setError(null);
    
    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email);
      if (authError) {
        setError(authError.message);
      } else {
        startCountdown();
      }
    } catch (err) {
      setError("Unable to resend email at this time.");
    }
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

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
        @keyframes spinLoader { to { transform: rotate(360deg); } }
        
        .form-anim { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .spin-loader { animation: spinLoader 0.9s linear infinite; }

        .cta-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(90deg, #6FF7E8, #1F7EA1);
          color: #003732; border: none; border-radius: 8px;
          font-family: Inter, sans-serif; font-size: 14px; font-weight: 700;
          letter-spacing: 0.04em; cursor: pointer;
          animation: btnPulse 2.5s ease-in-out infinite;
          transition: filter 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
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
          text-decoration: none;
        }
        .ghost-btn:hover { background: rgba(255,255,255,0.09); }

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
          max-width: 460px;
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
      `}</style>

      <div className="auth-root">
        <img
          src="https://p-bandai.com/files/seller-products/FSP0002911001/iI1Am84HlErgzlZ0BU33.webp"
          alt="" aria-hidden
          className="auth-bg-img"
        />
        <div className="auth-bg-grad" />

        <div className="auth-left">
          <div className="auth-panel">
            
            {(view === "form" || view === "loading") && (
              <div className="form-anim" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <p style={{
                  fontFamily: "Inter, sans-serif", fontSize: 11,
                  letterSpacing: "0.32em", fontWeight: 700, color: "#6FF7E8",
                  textAlign: "center"
                }}>OVERLORD TOYS</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "center" }}>
                  <h1 style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontSize: 34, fontWeight: 800, color: "#ffffff",
                    letterSpacing: "-0.02em", lineHeight: 1.1,
                  }}>Reset Access Code</h1>
                  <p style={{
                    fontFamily: "Inter, sans-serif", fontSize: 14,
                    color: "rgba(212,229,236,0.45)", lineHeight: 1.5,
                  }}>Type your email to receive recovery transmission.</p>
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

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ position: "relative" }}>
                    <span className="ms" style={{
                      position: "absolute", left: 13, top: "50%",
                      transform: "translateY(-50%)", color: error ? "rgba(239, 68, 68, 0.45)" : "rgba(111,247,232,0.45)",
                    }}>mail</span>
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address" required autoComplete="email"
                      style={{...inputStyle, borderColor: error ? "rgba(239, 68, 68, 0.3)" : inputStyle.borderColor}} 
                      onFocus={onFocus} onBlur={onBlur}
                    />
                  </div>

                  <button type="submit" className="cta-btn" disabled={view === "loading"}>
                    {view === "loading" ? (
                      <>
                        <span className="ms spin-loader">progress_activity</span>
                        TRANSMITTING...
                      </>
                    ) : (
                      <>
                        <span className="ms">send</span>
                        SEND RECOVERY LINK
                      </>
                    )}
                  </button>
                </form>

                <div style={{ textAlign: "center" }}>
                  <Link href="/login" style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontFamily: "Inter, sans-serif", fontSize: 14, color: "rgba(212,229,236,0.45)",
                    textDecoration: "none", transition: "color 0.2s",
                  }}>
                    <span className="ms" style={{ fontSize: 18 }}>arrow_back</span>
                    Back to Sign In
                  </Link>
                </div>
              </div>
            )}

            {view === "success" && (
              <div className="form-anim" style={{ display: "flex", flexDirection: "column", gap: 28, textAlign: "center", alignItems: "center" }}>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: "rgba(111,247,232,0.1)",
                  border: "1px solid rgba(111,247,232,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 30px rgba(111,247,232,0.2)",
                  color: "#6FF7E8"
                }}>
                  <span className="ms" style={{ fontSize: 40 }}>check_circle</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h2 style={{
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    fontSize: 30, fontWeight: 800, color: "#ffffff",
                  }}>Transmission Sent!</h2>
                  <p style={{
                    fontFamily: "Inter, sans-serif", fontSize: 14,
                    color: "rgba(212,229,236,0.6)", lineHeight: 1.6,
                  }}>
                    Recovery instructions have been sent to <br/>
                    <span style={{ color: "#6FF7E8", fontWeight: 600 }}>{email}</span>
                  </p>
                </div>

                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                  <button
                    onClick={handleResend}
                    disabled={countdown > 0}
                    style={{
                      fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600,
                      padding: "10px 24px", borderRadius: 999,
                      border: `1px solid ${countdown > 0 ? "rgba(255,255,255,0.05)" : "rgba(111,247,232,0.4)"}`,
                      color: countdown > 0 ? "rgba(255,255,255,0.2)" : "#6FF7E8",
                      background: "transparent",
                      cursor: countdown > 0 ? "not-allowed" : "pointer",
                      alignSelf: "center",
                    }}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend Link"}
                  </button>

                  <Link href="/login" className="ghost-btn">
                    <span className="ms">arrow_back</span>
                    RETURN TO SIGN IN
                  </Link>
                </div>
              </div>
            )}

          </div>{/* end auth-panel */}
        </div>{/* end auth-left */}

        <div style={{
          position: "fixed", right: 52, bottom: 52, zIndex: 10,
          width: "min(360px, 38vw)", pointerEvents: "none",
          textAlign: "right", display: "flex", flexDirection: "column", gap: 10
        }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, letterSpacing: "0.25em", color: "rgba(111,247,232,0.45)" }}>
            ARTIFACT_ID: G-778-EP
          </p>
          <h2 style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 24, fontWeight: 800, color: "#ffffff" }}>
            The Eternal Protocol
          </h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "rgba(212,229,236,0.5)", lineHeight: 1.6 }}>
            Recovery protocols initiated. Check your secured transmission channel to restore access to your vault.
          </p>
        </div>

      </div>
    </>
  );
}
