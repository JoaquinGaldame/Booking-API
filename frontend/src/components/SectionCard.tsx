import type { PropsWithChildren, ReactNode } from "react";

type SectionCardProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}>;

export function SectionCard({
  eyebrow,
  title,
  description,
  action,
  children,
}: SectionCardProps) {
  return (
    <section className="panel p-6 md:p-7">
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-200/80 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-signal">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate">
            {description}
          </p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
