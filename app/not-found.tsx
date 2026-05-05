import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-8 text-center shadow-warm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:rgba(232,100,10,0.08)] text-2xl text-[color:var(--color-saffron)]">
          ✿
        </div>
        <h1 className="mt-5 font-serif text-3xl text-[color:var(--color-dark)]">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
          The page you're looking for doesn't exist, or this form may have been removed.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-[12px] bg-[color:var(--color-saffron)] px-4 py-3 text-sm font-semibold text-white"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
