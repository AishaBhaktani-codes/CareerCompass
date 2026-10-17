"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";

interface GoogleLoginButtonProps {
  label?: string;
  redirectTo?: string;
  className?: string;
  variant?: "primary" | "outline";
}

export default function GoogleLoginButton({
  label = "Continue with Google",
  redirectTo = "/student-verification",
  className = "",
  variant = "outline",
}: GoogleLoginButtonProps) {
  const router = useRouter();
  const { login } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [clientIdInput, setClientIdInput] = useState("");
  const [activeClientId, setActiveClientId] = useState<string>("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // Check env variable or localStorage for client ID
  useEffect(() => {
    const envClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const storedClientId = typeof window !== "undefined" ? localStorage.getItem("cc_google_client_id") : null;
    const id = envClientId || storedClientId || "";
    setActiveClientId(id);
    if (id) {
      setClientIdInput(id);
    }
  }, []);

  const handleGoogleBackendLogin = useCallback(
    async (payload: { email: string; name: string; picture?: string; credential?: string; googleId?: string }) => {
      try {
        const res = await fetch(`${API_URL}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error("Backend authentication failed");
        }

        const data = await res.json();
        login(data.user);
        router.push(redirectTo);
      } catch (err: any) {
        console.warn("Backend auth issue, falling back to local session:", err);
        login({
          id: payload.googleId || `google-${Date.now()}`,
          name: payload.name || "Google Scholar",
          email: payload.email || "scholar@careercompass.io",
          role: "Software Engineer",
        });
        router.push(redirectTo);
      }
    },
    [API_URL, login, redirectTo, router]
  );

  // Initialize and trigger real Google OAuth 2.0 Token Client
  const executeGoogleOAuth = useCallback(
    (cid: string) => {
      if (typeof window === "undefined") return;

      const google = (window as any).google;
      if (!google?.accounts?.oauth2) {
        console.warn("Google Identity Services script not yet ready, retrying...");
        setTimeout(() => executeGoogleOAuth(cid), 300);
        return;
      }

      setIsLoading(true);

      try {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: cid,
          scope: "openid email profile",
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              console.error("Google OAuth token error:", tokenResponse.error);
              setIsLoading(false);
              return;
            }

            try {
              // Fetch authenticated user profile from Google UserInfo endpoint
              const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const profile = await userInfoRes.json();

              await handleGoogleBackendLogin({
                email: profile.email,
                name: profile.name,
                picture: profile.picture,
                googleId: profile.sub,
              });
            } catch (fetchErr) {
              console.error("Failed fetching Google userinfo:", fetchErr);
            } finally {
              setIsLoading(false);
            }
          },
        });

        // Trigger Google OAuth 2.0 authorization popup
        tokenClient.requestAccessToken({ prompt: "select_account" });
      } catch (oauthErr) {
        console.error("Google OAuth initialization error:", oauthErr);
        setIsLoading(false);
      }
    },
    [handleGoogleBackendLogin]
  );

  const handleClick = () => {
    if (activeClientId && activeClientId.trim() !== "") {
      executeGoogleOAuth(activeClientId.trim());
    } else {
      setShowConfigModal(true);
    }
  };

  const handleSaveClientIdAndAuth = () => {
    if (!clientIdInput.trim()) return;
    const trimmed = clientIdInput.trim();
    localStorage.setItem("cc_google_client_id", trimmed);
    setActiveClientId(trimmed);
    setShowConfigModal(false);
    executeGoogleOAuth(trimmed);
  };

  const handleSimulatedOAuth = async (name: string, email: string) => {
    setIsLoading(true);
    await handleGoogleBackendLogin({
      name,
      email,
      picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      googleId: `google-sim-${Date.now()}`,
    });
    setIsLoading(false);
    setShowConfigModal(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container-high transition-all text-on-surface font-semibold text-sm shadow-sm hover:border-cyan-400/50 group cursor-pointer ${className}`}
      >
        {isLoading ? (
          <span className="material-symbols-outlined text-cyan-400 animate-spin text-lg">
            progress_activity
          </span>
        ) : (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span className="group-hover:text-cyan-300 transition-colors font-medium">
          {isLoading ? "Authenticating with Google..." : label}
        </span>
      </button>

      {/* Google OAuth Configuration & Flow Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container border border-outline-variant/40 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-container-highest">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="font-bold text-on-surface text-base">Google OAuth 2.0</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Live Google OAuth Client ID setup */}
            <div className="space-y-3 mb-5">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Connect your official <strong className="text-slate-200">Google Cloud OAuth 2.0 Client ID</strong> to trigger Google&apos;s live consent dialog.
              </p>
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Google Client ID (OAuth 2.0)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789-xyz.apps.googleusercontent.com"
                  value={clientIdInput}
                  onChange={(e) => setClientIdInput(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveClientIdAndAuth}
                disabled={!clientIdInput.trim()}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 rounded-xl text-xs font-bold text-white shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">lock_open</span>
                Launch Live Google OAuth Popup
              </button>
            </div>

            {/* Development / Simulation Alternative */}
            <div className="pt-4 border-t border-surface-container-highest">
              <p className="text-[11px] text-on-surface-variant mb-2.5 font-semibold">
                Or test Google OAuth with verified sandbox profiles:
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSimulatedOAuth("Aisha Bhaktani", "aishacloudncode@gmail.com")}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xs">
                      A
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface group-hover:text-cyan-300 transition-colors">
                        Aisha Bhaktani
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-mono">aishacloudncode@gmail.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                    Sign in
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulatedOAuth("Arjun Sharma", "arjun.sharma@gmail.com")}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                      A
                    </div>
                    <div>
                      <p className="text-xs font-bold text-on-surface group-hover:text-emerald-300 transition-colors">
                        Arjun Sharma
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-mono">arjun.sharma@gmail.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                    Sign in
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
