"use client";

import { useState } from "react";
import {
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
  LockKeyhole
} from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [magicEmail, setMagicEmail] = useState("");
  const [credentialsEmail, setCredentialsEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingForm, setPendingForm] = useState<"magic" | "credentials" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const magicPending = pendingForm === "magic";
  const credentialsPending = pendingForm === "credentials";

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingForm("magic");
    setMessage(null);
    setError(null);

    try {
      const email = magicEmail.trim();
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/dashboard"
      });

      if (result?.error) {
        setError("We couldn't send the magic link. Please try again.");
      } else {
        setMessage("Check your inbox for the magic sign-in link.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setPendingForm(null);
    }
  }

  async function handleCredentialsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingForm("credentials");
    setMessage(null);
    setError(null);

    try {
      const email = credentialsEmail.trim();
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard"
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else if (result?.ok) {
        router.push(result.url ?? "/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setPendingForm(null);
    }
  }

  return (
    <section className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_rgba(8,47,73,0.85))]" aria-hidden />
      <div className="relative grid gap-10 rounded-4xl border border-white/10 bg-white/10 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-2xl lg:grid-cols-[1.2fr_1fr] lg:p-12">
        <div>
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            <Sparkles className="h-4 w-4 text-sky-300" />
            <span>Welcome to CircleCast</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Sign in to your creator hub
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Choose how you'd like to sign in below. Magic links keep things password-free, or use
            your email and password for an instant sign-in.
          </p>

          <div className="mt-10 grid gap-8">
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                Magic link (email)
              </h2>
              <label className="block text-sm font-medium text-white/80">
                Email address
                <input
                  type="email"
                  required
                  value={magicEmail}
                  onChange={(event) => setMagicEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-white/60 focus:bg-white/15"
                />
              </label>
              <button
                type="submit"
                disabled={magicPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-75"
              >
                {magicPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending magic link…
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Email me a magic link
                  </>
                )}
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 rounded-3xl border border-white/10" aria-hidden />
              <div className="relative grid gap-4 rounded-3xl bg-white/5 px-6 py-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                  Password sign-in
                </h2>
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <label className="block text-sm font-medium text-white/80">
                    Email
                    <input
                      type="email"
                      required
                      value={credentialsEmail}
                      onChange={(event) => setCredentialsEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-white/60 focus:bg-white/15"
                    />
                  </label>
                  <label className="block text-sm font-medium text-white/80">
                    Password
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white outline-none transition focus:border-white/60 focus:bg-white/15"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={credentialsPending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20 disabled:cursor-not-allowed"
                  >
                    {credentialsPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      <>
                        <LockKeyhole className="h-4 w-4 text-emerald-300" />
                        Sign in with password
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div>
              <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                Or continue with
              </p>
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
              >
                <ShieldCheck className="h-4 w-4 text-sky-300" />
                Sign in with Google
              </button>
            </div>

            {message ? (
              <p className="rounded-2xl border border-emerald-400/40 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-2xl border border-amber-400/40 bg-amber-500/15 px-4 py-3 text-sm text-amber-100">
                {error}
              </p>
            ) : null}
          </div>
        </div>

        <aside className="flex flex-col justify-between rounded-3xl bg-white/8 p-6 text-sm text-white/70">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">
              Dev login cheatsheet
            </h2>
            <ul className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs">
              <li>
                <span className="font-semibold text-white/90">Email:</span> dev@circlecast.local
              </li>
              <li>
                <span className="font-semibold text-white/90">Password:</span> letmein
              </li>
              <li className="text-white/50">
                Update these in <code>apps/web/.env</code> (`DEV_LOGIN_EMAIL`, `DEV_LOGIN_PASSWORD`).
              </li>
            </ul>
          </div>
          <div className="mt-6 space-y-2 text-xs text-white/60">
            <p>Need full access?</p>
            <p>
              Verify your domain in Resend to enable production magic links, or continue with
              Google while we wire up additional providers.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
