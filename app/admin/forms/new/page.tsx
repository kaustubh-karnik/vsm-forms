"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createForm } from "@/app/actions/form-actions";
import type { Team } from "@/lib/supabase";

const TEAMS: Team[] = ["Yuva Chetana", "Gram Vikas", "Nalanda", "MUSE", "SDA"];

const TEAM_GRADIENTS: Record<Team, string> = {
  "Yuva Chetana": "linear-gradient(135deg, #E8640A 0%, #C2500A 50%, #7C2D0A 100%)",
  "Gram Vikas": "linear-gradient(135deg, #2D6A3F 0%, #1A4A2A 50%, #0F2E18 100%)",
  Nalanda: "linear-gradient(135deg, #1E4FC2 0%, #1E3A8A 50%, #172554 100%)",
  MUSE: "linear-gradient(135deg, #D43E8D 0%, #A8266A 50%, #7C1A4E 100%)",
  SDA: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #3B0764 100%)",
};

export default function NewFormPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [team, setTeam] = useState<Team>("Yuva Chetana");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Please enter a form title."); return; }
    setError("");

    startTransition(async () => {
      try {
        const id = await createForm({
          title: title.trim(),
          description: "",
          team,
          status: "draft",
          closingDate: "",
          coverGradient: TEAM_GRADIENTS[team],
          fields: [
            { id: "f-default-1", type: "text", label: "Full Name", required: true, placeholder: "Your full name" },
            { id: "f-default-2", type: "email", label: "Email Address", required: true, placeholder: "you@example.com" },
            { id: "f-default-3", type: "tel", label: "Phone Number", required: true, placeholder: "+91 98765 43210" },
          ],
          createdBy: "Admin",
        });
        router.push(`/admin/forms/${id}`);
      } catch (err) {
        setError("Failed to create form. Please try again.");
      }
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[color:rgba(232,100,10,0.08)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-[color:var(--color-saffron)]" aria-hidden>
              <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl text-[color:var(--color-dark)]">Create a new form</h1>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            You can change everything in the builder — this just gets you started.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 shadow-warm space-y-5"
        >
          <div className="space-y-1.5">
            <label htmlFor="form-title" className="text-xs font-semibold uppercase tracking-[0.13em] text-[color:var(--color-muted)]">
              Form title *
            </label>
            <input
              id="form-title"
              autoFocus
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              className="vsm-input"
              placeholder="e.g. Runmochan 2027 Registration"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="form-team" className="text-xs font-semibold uppercase tracking-[0.13em] text-[color:var(--color-muted)]">
              Team
            </label>
            <select
              id="form-team"
              value={team}
              onChange={(e) => setTeam(e.target.value as Team)}
              className="vsm-input"
            >
              {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Gradient preview */}
          <div
            className="flex h-14 items-center justify-center rounded-[14px] font-serif text-base text-white/90 shadow-warm"
            style={{ background: TEAM_GRADIENTS[team] }}
          >
            {title || "Form title preview"}
          </div>

          {error && (
            <p className="rounded-[10px] bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <Link
              href="/admin/forms"
              className="flex-1 rounded-[12px] border border-[color:var(--color-border)] py-3 text-center text-sm font-semibold text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-dark)]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-[12px] bg-[color:var(--color-saffron)] py-3 text-sm font-semibold text-white shadow-warm transition-all hover:-translate-y-px hover:bg-[color:var(--color-saffron-dark)] disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                    <path className="opacity-80" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating…
                </>
              ) : (
                <>
                  Create &amp; edit
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
