import Link from "next/link";
import { notFound } from "next/navigation";

import { VsmLogo } from "@/app/components/vsm-ui";
import { getFormById } from "@/lib/supabase";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { id } = await params;
  const { name } = await searchParams;
  const form = await getFormById(id);

  if (!form) {
    notFound();
  }

  const displayName = name?.trim() || "Volunteer";
  const confirmationMessage =
    form.settings?.confirmationMessage?.trim() ||
    `Your registration for ${form.title} has been received. Our team will be in touch soon. 🙏`;
  const hasFileField = form.fields.some((field) => field.type === "file");

  const urlRegex = /(https?:\/\/\S+)/gi;
  const urlMatch = confirmationMessage.match(urlRegex);
  const firstLink = urlMatch?.[0];
  const cleanedMessage = firstLink
    ? confirmationMessage.replace(urlRegex, "").replace(/\s{2,}/g, " ").trim()
    : confirmationMessage;
  const confirmationLink = form.settings?.confirmationLink?.url &&
    form.settings.confirmationLink.url !== "https://" &&
    form.settings.confirmationLink.label
      ? form.settings.confirmationLink
      : null;
  const actionLink = confirmationLink ?? (firstLink ? { url: firstLink, label: "Open link" } : null);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="pattern-orb pattern-orb-top" aria-hidden />
      <div className="pattern-orb pattern-orb-bottom" aria-hidden />

      <div className="mx-auto w-full max-w-[520px]">
        <article className="overflow-hidden rounded-[20px] border-2 border-black bg-[color:var(--color-card)] shadow-[6px_6px_0_0_#000]">
          <div className="space-y-6 p-6 text-center sm:p-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-black bg-[color:var(--color-saffron)] shadow-[3px_3px_0_0_#000]">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9" aria-hidden>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="font-serif text-[28px] leading-tight text-[color:var(--color-dark)] sm:text-[32px]">
                Thank you, {displayName}!
              </h1>
              <p className="text-base font-medium leading-8 text-[color:var(--color-dark)] sm:text-lg">
                {cleanedMessage}
              </p>
              {hasFileField && (
                <div className="mx-auto mt-4 flex max-w-[420px] items-center justify-center gap-2 rounded-[10px] border-2 border-black bg-[#DCFCE7] px-3 py-2 text-xs font-bold text-[#166534] shadow-[2px_2px_0_0_#000]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#15803D]" aria-hidden />
                  Files uploaded successfully
                </div>
              )}
            </div>

            {actionLink && (
              <div className="rounded-[16px] border-2 border-black bg-[color:var(--color-cream)] p-4 shadow-[3px_3px_0_0_#000] sm:p-5">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                  Important next step
                </p>
                <a
                  href={actionLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-[12px] border-2 border-black bg-[color:var(--color-saffron)] px-6 py-4 text-base font-bold text-white shadow-[4px_4px_0_0_#000] transition-all hover:-translate-y-px hover:shadow-[5px_5px_0_0_#000] active:translate-y-0 active:shadow-none sm:py-5 sm:text-lg"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 shrink-0" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                  {actionLink.label}
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5 shrink-0" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-[10px] border-2 border-black bg-[color:var(--color-card)] px-4 py-3 text-sm font-bold text-[color:var(--color-dark)] shadow-[3px_3px_0_0_#000] transition-all hover:-translate-y-px hover:shadow-[4px_4px_0_0_#000] active:translate-y-0 active:shadow-none hover:text-[color:var(--color-saffron)]"
              >
                <span className="inline-flex items-center gap-2">
                  <span>Back to</span>
                  <VsmLogo size={16} tone="neutral" shadow={false} />
                  <span>Forms</span>
                </span>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
