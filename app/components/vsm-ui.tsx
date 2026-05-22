import Image from "next/image";
import Link from "next/link";

import { Alert } from "@/components/retroui/Alert";
import { Badge } from "@/components/retroui/Badge";
import { Card } from "@/components/retroui/Card";
import { Text } from "@/components/retroui/Text";
import { BarChart } from "@/components/retroui/charts/BarChart";
import { PieChart } from "@/components/retroui/charts/PieChart";
import {
  type FormField,
  type Team,
  type VSMForm,
  TEAM_COLORS,
  TEAM_DOTS,
} from "@/lib/supabase";

type DeadlineTone = "safe" | "soon" | "urgent" | "closed";

type DeadlineState = {
  label: string;
  tone: DeadlineTone;
};

export function getDeadlineState(date?: string): DeadlineState | null {
  if (!date) {
    return null;
  }

  const now = new Date();
  const closing = new Date(`${date}T23:59:59+05:30`);
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.ceil((closing.getTime() - now.getTime()) / msPerDay);

  if (diffDays < 0) {
    return { label: "Closed", tone: "closed" };
  }

  if (diffDays < 3) {
    return { label: `Closes ${formatShortDate(date)}`, tone: "urgent" };
  }

  if (diffDays <= 7) {
    return { label: `Closes ${formatShortDate(date)}`, tone: "soon" };
  }

  return { label: `Closes ${formatShortDate(date)}`, tone: "safe" };
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00+05:30`));
}

function formatLongDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusLabel(status: VSMForm["status"]) {
  if (status === "active") {
    return "Live";
  }

  if (status === "draft") {
    return "Draft";
  }

  return "Closed";
}

export function SectionDivider({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-px flex-1 bg-[color:var(--color-border)]" />
      <span className="lotus-divider px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-dark)]">
        {label}
      </span>
      <div className="h-px flex-1 bg-[color:var(--color-border)]" />
    </div>
  );
}

type LogoTone = "warm" | "neutral";

export function VsmLogo({
  size = 56,
  tone = "neutral",
  shadow = true,
  className = "",
  withBackground = false,
}: {
  size?: number;
  tone?: LogoTone;
  shadow?: boolean;
  className?: string;
  withBackground?: boolean;
}) {
  const imageSize = Math.max(Math.round(size * 0.68), 12);

  // By default do not force a white background on the logo. Pass `withBackground=true`
  // to add the white background and border if needed. This avoids white boxes
  // around logos that already contain their own background transparency.
  const toneClassBase =
    tone === "warm"
      ? "border-2 border-[color:rgba(232,100,10,0.18)]"
      : "border border-[color:var(--color-border)]";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full ${withBackground ? "bg-white" : "bg-transparent"} ${toneClassBase} ${shadow ? "shadow-warm" : ""} ${className}`}
      style={{ width: size, height: size, verticalAlign: "middle" }}
    >
      <Image
        src="/logo.png"
        alt="Vivekanand Seva Mandal logo"
        width={imageSize}
        height={imageSize}
        className="h-auto w-auto object-contain"
        // shrink the visible image inside the circular container so any white canvas
        // around the artwork doesn't touch the container edge — improves perceived alignment
        style={{ backgroundColor: "transparent", width: "70%", height: "70%", display: "block" }}
      />
    </span>
  );
}

const SocialIcons: Record<string, React.ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.01" fill="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  ),
  X: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[17px] w-[17px]" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.259 5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Website: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px]" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
};

export function SocialLinks() {
  const links = [
    { label: "Instagram", href: "https://www.instagram.com/vsmandal" },
    { label: "Facebook", href: "https://www.facebook.com/vsmandal.dombivli" },
    { label: "X", href: "https://www.twitter.com/vsmandal" },
    { label: "Website", href: "https://vsmandal.org" },
  ];

  return (
    <div className="flex items-center justify-center gap-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white text-dark shadow-[2px_2px_0_0_#000] transition-all duration-200 hover:-translate-y-px hover:shadow-[3px_3px_0_0_#000] active:translate-y-[2px] active:shadow-none hover:text-saffron hover:border-saffron"
        >
          {SocialIcons[link.label]}
        </a>
      ))}
    </div>
  );
}

export function TeamBadge({ team }: { team: Team }) {
  const tone = TEAM_COLORS[team];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm border-2 border-[#1A1208] px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0_0_#1A1208]"
      style={{
        backgroundColor: tone.bg,
        color: "#1A1208",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-none border border-[#1A1208]"
        style={{ backgroundColor: TEAM_DOTS[team] }}
        aria-hidden
      />
      {team}
    </span>
  );
}

export function DeadlinePill({ deadline }: { deadline: DeadlineState }) {
  const styles: Record<DeadlineTone, string> = {
    safe: "text-[#166534] bg-[#DCFCE7]/60 border-[#15803D]/20",
    soon: "text-[#9A5B00] bg-[#FEF3C7]/60 border-[#D97706]/20",
    urgent: "text-[#B91C1C] bg-[#FEE2E2]/60 border-[#DC2626]/20",
    closed: "text-[#6B5B45] bg-[#F3E8D9]/60 border-[#6B5B45]/20",
  };

  const dotColor =
    deadline.tone === "urgent"
      ? "#DC2626"
      : deadline.tone === "safe"
        ? "#15803D"
        : deadline.tone === "soon"
          ? "#D97706"
          : "#6B5B45";

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[10px] sm:text-[11px] font-medium border border-dashed ${styles[deadline.tone]}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: dotColor }}
        aria-hidden
      />
      {deadline.label}
    </div>
  );
}

export function FormCover({
  form,
  compact = false,
  tall = false,
  poster = false,
  roundedClass,
  className = "",
  showOverlay = true,
}: {
  form: VSMForm;
  compact?: boolean;
  tall?: boolean;
  poster?: boolean;
  roundedClass?: string;
  className?: string;
  showOverlay?: boolean;
}) {
  const cleanPoster = poster && !showOverlay;
  const heightClass = compact
    ? "h-full min-h-[96px]"
    : tall
      ? "aspect-[16/9] min-h-[230px]"
      : cleanPoster
        ? "h-full min-h-0"
        : poster
          ? "h-full min-h-[120px]"
          : "aspect-[16/9]";
  const radiusClass =
    roundedClass ??
    (compact
      ? "rounded-[16px]"
      : poster
        ? "rounded-[20px]"
        : "rounded-t-[20px]");

  return (
    <div
      className={`relative w-full overflow-hidden ${heightClass} ${radiusClass} ${className} ${cleanPoster && form.coverImageUrl ? "bg-white" : ""}`}
      style={
        form.coverImageUrl ? (cleanPoster ? undefined : {}) : { background: form.coverGradient }
      }
    >
      {/* Banner image (takes priority over gradient) */}
      {form.coverImageUrl && (
        <Image
          src={form.coverImageUrl}
          alt={`${form.title} banner`}
          fill
          className={cleanPoster || !poster ? "object-cover" : "object-contain"}
          sizes="(max-width: 768px) 100vw, 680px"
          priority
        />
      )}

      {/* Decorative overlays — skipped for bare poster thumbnails on listing cards */}
      {!cleanPoster ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(26,18,8,0.18),transparent_36%)]" />
      ) : null}
      {!cleanPoster && !form.coverImageUrl && (
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.9)_25%,rgba(255,255,255,0.9)_27%,transparent_27%,transparent_50%,rgba(255,255,255,0.9)_50%,rgba(255,255,255,0.9)_52%,transparent_52%,transparent_75%,rgba(255,255,255,0.9)_75%,rgba(255,255,255,0.9)_77%,transparent_77%)] bg-[length:48px_48px]" />
        </div>
      )}
      {/* Bottom scrim so text is always readable over photos. Reduce scrim when showing posters so image isn't heavily obscured. */}
      {form.coverImageUrl && showOverlay && (
        <div className={`absolute inset-x-0 bottom-0 ${poster ? "h-1/3" : "h-2/3"} bg-gradient-to-t from-black/60 to-transparent`} />
      )}

      {/* Optional overlay with title/team — hide when showOverlay is false (e.g., poster thumbnails) */}
      {showOverlay && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/72">
              Vivekanand Seva Mandal
            </p>
            <p className="mt-1 font-serif text-lg leading-tight">{form.title}</p>
          </div>
          <div className="rounded-full border border-white/18 bg-white/12 px-3 py-1 text-xs font-semibold">
            {form.team
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
        </div>
      )}
    </div>
  );
}

export function PublicField({ field }: { field: FormField }) {
  const label = (
    <label className="mb-2 block text-sm font-bold text-dark">
      {field.label}
      {field.required ? (
        <span className="text-[color:var(--color-saffron)]"> *</span>
      ) : null}
    </label>
  );

  if (field.type === "textarea") {
    return (
      <div>
        {label}
        <textarea
          className="vsm-input min-h-[120px] resize-y"
          placeholder={field.placeholder}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        {label}
        <select className="vsm-input text-[color:var(--color-muted)]">
          <option>{field.placeholder ?? `Select ${field.label}`}</option>
          {field.options?.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "radio" && field.options) {
    return (
      <fieldset className="space-y-3">
        {label}
        <div className="flex flex-wrap gap-4">
          {field.options.map((option) => (
            <label
              key={option}
              className="inline-flex items-center gap-2 text-sm text-[color:var(--color-dark)]"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[color:var(--color-border)]">
                <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
              </span>
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-start gap-3 rounded-[16px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-3 text-sm text-[color:var(--color-dark)]">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[color:var(--color-border)]" />
        <span>
          {field.label}
          {field.required ? (
            <span className="text-[color:var(--color-saffron)]"> *</span>
          ) : null}
        </span>
      </label>
    );
  }

  if (field.type === "file") {
    return (
      <div>
        {label}
        <div className="rounded-[12px] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-5 text-sm text-[color:var(--color-muted)]">
          Upload a file
        </div>
      </div>
    );
  }

  const inputType =
    field.type === "email"
      ? "email"
      : field.type === "number"
        ? "number"
        : field.type === "date"
          ? "date"
          : field.type === "tel"
            ? "tel"
            : "text";

  return (
    <div>
      {label}
      <input
        className="vsm-input"
        placeholder={field.placeholder ?? field.label}
        type={inputType}
      />
    </div>
  );
}

export function DashboardHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="fade-up fade-up-1">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <Text
        as="h1"
        className="mt-2 text-[clamp(2rem,4vw,3rem)] leading-tight text-[color:var(--color-dark)]"
      >
        {title}
      </Text>
      <Text
        as="p"
        className="mt-3 max-w-3xl text-sm font-semibold leading-relaxed text-muted-foreground"
      >
        {description}
      </Text>
    </header>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`fade-up fade-up-2 block w-full rounded-[20px] border-2 border-black bg-[color:var(--color-card)] p-5 shadow-[4px_4px_0_0_#000] transition-all sm:p-6 ${className}`}
    >
      {children}
    </Card>
  );
}

export function StatsCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <Card className="fade-up fade-up-2 block rounded-[18px] border-2 border-black bg-[color:var(--color-card)]/80 backdrop-blur-sm p-5 shadow-[4px_4px_0_0_#000]">
      <p className="text-4xl font-bold text-[color:var(--color-saffron)]">
        {value}
      </p>
      <p className="mt-2 text-sm font-bold text-muted-foreground">{label}</p>
    </Card>
  );
}

export function FormListRow({ form }: { form: VSMForm }) {
  const deadline = getDeadlineState(form.closingDate);

  return (
    <article className="rounded-[16px] border-2 border-black bg-[color:var(--color-card)] p-4 shadow-[3px_3px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:-translate-y-[1px] transition-all duration-150">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-serif text-xl font-bold text-[color:var(--color-dark)]">
              {form.title}
            </h3>
            <Badge
              size="sm"
              className={
                form.status === "active"
                  ? "bg-[rgba(21,128,61,0.1)] text-[#166534] outline outline-1 outline-[rgba(21,128,61,0.25)]"
                  : form.status === "draft"
                    ? "bg-[rgba(232,100,10,0.08)] text-[color:var(--color-saffron)] outline outline-1 outline-[rgba(232,100,10,0.2)]"
                    : "bg-[#F3E8D9]/60 text-muted-foreground outline outline-1 outline-black/20"
              }
            >
              {getStatusLabel(form.status)}
            </Badge>
            <TeamBadge team={form.team} />
          </div>
          <p className="text-sm font-semibold text-muted-foreground">
            {form.responseCount} responses
            {deadline ? ` · ${deadline.label}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/forms/${form.id}`}
            className="rounded-[10px] border-2 border-black bg-[color:var(--color-cream)] px-4 py-2 text-sm font-bold text-[color:var(--color-dark)] shadow-[2px_2px_0_0_#000] hover:-translate-y-px hover:shadow-[3px_3px_0_0_#000] active:translate-y-0 active:shadow-none transition-all duration-150"
          >
            Edit
          </Link>
          <Link
            href={`/admin/forms/${form.id}/responses`}
            className="rounded-[10px] border-2 border-black bg-[color:var(--color-cream)] px-4 py-2 text-sm font-bold text-dark shadow-[2px_2px_0_0_#000] hover:-translate-y-px hover:shadow-[3px_3px_0_0_#000] active:translate-y-0 active:shadow-none transition-all duration-150"
          >
            Data
          </Link>
        </div>
      </div>
    </article>
  );
}

export function FieldPalette() {
  const palette = [
    "Text",
    "Email",
    "Number",
    "Select",
    "Radio",
    "Checkbox",
    "Date",
    "File Upload",
    "Section heading",
  ];

  return (
    <AdminCard className="fade-up fade-up-3">
      <h2 className="font-serif text-2xl text-[color:var(--color-dark)]">
        Field palette
      </h2>
      <p className="mt-2 text-sm text-[color:var(--color-muted)]">
        Draggable building blocks for the form builder.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {palette.map((item) => (
          <div
            key={item}
            className="rounded-[10px] border-2 border-black bg-[color:var(--color-cream)] px-4 py-2.5 text-sm font-bold text-[color:var(--color-dark)] shadow-[2px_2px_0_0_#000]"
          >
            {item}
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

export function FormCanvasPreview({ form }: { form: VSMForm }) {
  return (
    <AdminCard className="fade-up fade-up-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[color:var(--color-dark)]">
            Live canvas
          </h2>
          <p className="mt-1 text-sm text-[color:var(--color-muted)]">
            Public-facing preview with your current field order.
          </p>
        </div>
        <TeamBadge team={form.team} />
      </div>

      <div className="mt-5 overflow-hidden rounded-[20px] border-2 border-black bg-[color:var(--color-card)] shadow-[4px_4px_0_0_#000]">
        <FormCover form={form} tall />
        <div className="space-y-4 p-5 sm:p-6">
          {form.fields.map((field) => (
            <PublicField key={field.id} field={field} />
          ))}
        </div>
      </div>
    </AdminCard>
  );
}

type ResponseEntry = {
  id: string;
  submittedAt: string;
  data: Record<string, string | boolean>;
};

export function ResponseTable({
  form,
  responses,
}: {
  form: VSMForm;
  responses: ResponseEntry[];
}) {
  const columns = form.fields.map((field) => field.label);

  return (
    <div className="overflow-hidden rounded-[16px] border-2 border-black bg-[color:var(--color-card)] shadow-[3px_3px_0_0_#000]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[color:var(--color-cream)] border-b-2 border-black text-left">
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-dark">
                Submitted
              </th>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-dark"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((response) => (
              <tr
                key={response.id}
                className="border-t-2 border-black align-top hover:bg-[color:var(--color-cream)]/40 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-bold text-dark">
                  {formatLongDate(response.submittedAt)}
                </td>
                {columns.map((column) => (
                  <td
                    key={`${response.id}-${column}`}
                    className="px-4 py-3 text-sm font-medium text-dark/85"
                  >
                    {String(response.data[column] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ResponseDetailCard({
  response,
}: {
  response: ResponseEntry | undefined;
}) {
  if (!response) {
    return (
      <AdminCard>
        <p className="text-sm text-[color:var(--color-muted)]">
          No submissions yet.
        </p>
      </AdminCard>
    );
  }

  return (
    <aside className="fade-up fade-up-3 rounded-[20px] border-2 border-black bg-[color:var(--color-card)] p-5 shadow-[4px_4px_0_0_#000]">
      <h2 className="font-serif text-2xl text-[color:var(--color-dark)]">
        Submission detail
      </h2>
      <p className="mt-1 text-sm text-[color:var(--color-muted)]">
        Received on {formatLongDate(response.submittedAt)}
      </p>

      <div className="mt-5 space-y-4">
        {Object.entries(response.data).map(([key, value]) => (
          <div
            key={key}
            className="rounded-[12px] border-2 border-black bg-[color:var(--color-card)] p-4 shadow-[2px_2px_0_0_#000]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
              {key}
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--color-dark)]">
              {String(value)}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function BarChartCard({
  data,
}: {
  data: Array<{ month: string; count: number }>;
}) {
  return (
    <AdminCard>
      <h2 className="font-serif text-2xl text-[color:var(--color-dark)]">
        Responses over time
      </h2>
      <p className="mt-1 text-sm text-[color:var(--color-muted)]">
        Monthly response volume across your current working set.
      </p>

      <div className="mt-6 overflow-hidden rounded-[16px] border-2 border-black bg-[color:var(--color-card)] p-5 shadow-[3px_3px_0_0_#000]">
        <BarChart
          data={data}
          index="month"
          categories={["count"]}
          fillColors={["#E8640A"]}
          strokeColors={["#C2500A"]}
          gridColor="#E8DDD0"
          className="h-[240px]"
        />
      </div>
    </AdminCard>
  );
}

export function DonutChartCard({
  data,
}: {
  data: Array<{ team: Team; count: number }>;
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0) || 1;
  const pieData = data.map((item) => ({ name: item.team, count: item.count }));
  const colors = data.map((item) => TEAM_DOTS[item.team]);

  return (
    <AdminCard>
      <h2 className="font-serif text-2xl text-[color:var(--color-dark)]">
        Team distribution
      </h2>
      <p className="mt-1 text-sm text-[color:var(--color-muted)]">
        Aggregate response share by team.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:items-center">
        <div className="relative mx-auto h-[220px] w-[220px]">
          <PieChart
            data={pieData}
            dataKey="count"
            nameKey="name"
            colors={colors}
            innerRadius={62}
            outerRadius={100}
            className="h-[220px] w-[220px]"
          />
          <div className="pointer-events-none absolute inset-[44px] flex items-center justify-center rounded-full bg-[color:var(--color-card)]">
            <div className="text-center">
              <p className="font-serif text-3xl text-[color:var(--color-saffron)]">
                {total}
              </p>
              <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                responses
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.team}
              className="flex items-center justify-between rounded-[12px] border-2 border-black bg-[color:var(--color-cream)] px-4 py-3 shadow-[2px_2px_0_0_#000]"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: TEAM_DOTS[item.team] }}
                />
                <span className="text-sm font-medium text-[color:var(--color-dark)]">
                  {item.team}
                </span>
              </div>
              <span className="text-sm text-[color:var(--color-muted)]">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AdminCard>
  );
}

export function TeamAnalyticsTable({
  rows,
}: {
  rows: Array<{
    team: Team;
    forms: number;
    responses: number;
    lastActivity: string;
  }>;
}) {
  return (
    <div className="overflow-hidden rounded-[16px] border-2 border-black bg-[color:var(--color-card)] shadow-[3px_3px_0_0_#000]">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-[color:var(--color-cream)] border-b-2 border-black text-left">
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-dark">
              Team
            </th>
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-dark">
              Forms
            </th>
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-dark">
              Responses
            </th>
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-dark">
              Last activity
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.team}
              className="border-t-2 border-black align-middle hover:bg-[color:var(--color-cream)]/40 transition-colors"
            >
              <td className="px-4 py-3">
                <TeamBadge team={row.team} />
              </td>
              <td className="px-4 py-3 text-sm font-bold text-dark">
                {row.forms}
              </td>
              <td className="px-4 py-3 text-sm font-bold text-dark">
                {row.responses}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-muted-foreground">
                {formatShortDate(row.lastActivity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
