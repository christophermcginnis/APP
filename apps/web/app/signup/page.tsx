"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/react";

type SignupFormState = {
  email: string;
  firstName: string;
  lastName: string;
  handle: string;
  birthdate: string;
  headline: string;
};

const initialState: SignupFormState = {
  email: "",
  firstName: "",
  lastName: "",
  handle: "",
  birthdate: "",
  headline: ""
};

export default function SignupPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<SignupFormState>(initialState);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const registerMutation = trpc.profile.register.useMutation({
    onSuccess: () => {
      setErrorMessage(null);
      setFormState(initialState);
      router.push("/dashboard");
    },
    onError: (error) => {
      setErrorMessage(error.message || "We couldn't save your details. Please try again.");
    }
  });

  const isSubmitting = registerMutation.isLoading;

  const isBirthdateValid = useMemo(() => {
    if (!formState.birthdate) return true;
    const date = new Date(formState.birthdate);
    if (Number.isNaN(date.getTime())) {
      return false;
    }
    return date.getTime() < Date.now();
  }, [formState.birthdate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isBirthdateValid) {
      setErrorMessage("Please enter a valid birthdate in the past.");
      return;
    }
    setErrorMessage(null);

    const birthdateIso = formState.birthdate
      ? new Date(formState.birthdate).toISOString()
      : undefined;

    await registerMutation.mutateAsync({
      email: formState.email,
      firstName: formState.firstName,
      lastName: formState.lastName,
      handle: formState.handle,
      birthdate: birthdateIso,
      headline: formState.headline || undefined
    });
  }

  function updateField<Key extends keyof SignupFormState>(key: Key) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((previous) => ({
        ...previous,
        [key]: event.target.value
      }));
    };
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-900">Join the CircleCast waitlist</h1>
      <p className="mt-2 text-sm text-slate-600">
        Tell us a little about you so we can personalise your creator dashboard on day one.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">First name</span>
            <input
              required
              value={formState.firstName}
              onChange={updateField("firstName")}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
              placeholder="Avery"
              autoComplete="given-name"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Last name</span>
            <input
              required
              value={formState.lastName}
              onChange={updateField("lastName")}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
              placeholder="Stone"
              autoComplete="family-name"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Username</span>
            <input
              required
              value={formState.handle}
              onChange={updateField("handle")}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
              placeholder="avery-studio"
              autoComplete="username"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              required
              type="email"
              value={formState.email}
              onChange={updateField("email")}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
              placeholder="you@email.com"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Birthdate</span>
            <input
              type="date"
              required
              value={formState.birthdate}
              onChange={updateField("birthdate")}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
              max={new Date().toISOString().split("T")[0]}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Creator headline</span>
          <textarea
            value={formState.headline}
            onChange={updateField("headline")}
            className="mt-2 w-full rounded-3xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
            rows={4}
            placeholder="Share a short description of the experiences you build."
            maxLength={160}
          />
          <span className="mt-1 block text-xs text-slate-400">
            Up to 160 characters · shown on your dashboard profile card.
          </span>
        </label>

        {errorMessage ? (
          <p className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-brand-600 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving your profile..." : "Save and continue"}
        </button>
      </form>
    </div>
  );
}
