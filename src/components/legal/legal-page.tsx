import { TriangleAlert } from "lucide-react";

export interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

/**
 * Shared layout for legal documents. Content in square brackets, e.g.
 * [Company legal name], is a placeholder that must be filled before launch.
 */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div
        role="note"
        className="mb-10 flex gap-3 rounded-md border border-foreground/20 bg-brand/30 p-4 text-sm"
      >
        <TriangleAlert className="size-5 shrink-0 text-foreground" aria-hidden />
        <p>
          <strong>Draft for review.</strong> This document is a working draft and has not been reviewed by a lawyer.
          Text in [square brackets] must be completed before launch.
        </p>
      </div>

      <h1 className="font-heading text-5xl uppercase sm:text-6xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[240px_1fr]">
        <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:h-fit">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">On this page</h2>
          <ol className="flex flex-col gap-1.5 text-sm">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-muted-foreground hover:text-foreground hover:underline">
                  {i + 1}. {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="legal-prose flex max-w-3xl flex-col gap-10">
          <div className="text-lg">{intro}</div>
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="mb-3 text-xl font-semibold">
                {i + 1}. {s.title}
              </h2>
              <div className="flex flex-col gap-3 leading-relaxed text-foreground/85">{s.body}</div>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
