import { Image as ImageIcon } from "lucide-react";
import { resolvePublicMediaUrl } from "../../services/mediaService";
import { toTitleCase } from "../../utils/textFormat";

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  align = "left",
  className = "",
}) {
  const isCenter = align === "center";

  return (
    <div
      className={[
        "flex flex-col gap-4",
        isCenter ? "items-center text-center" : "items-start",
        actions ? "md:flex-row md:items-end md:justify-between md:text-left" : "",
        className,
      ].join(" ")}
    >
      <div className={isCenter ? "max-w-3xl" : "max-w-3xl"}>
        {eyebrow ? (
          <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
            {toTitleCase(eyebrow)}
          </p>
        ) : null}
        <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-950 md:text-3xl dark:text-white">
          {toTitleCase(title)}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

export function PublicHero({
  eyebrow,
  title,
  description,
  children,
  aside,
  className = "",
}) {
  return (
    <section
      className={`brand-card overflow-hidden rounded-3xl px-6 py-10 md:px-10 md:py-14 ${className}`}
    >
      <div className={aside ? "grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center" : ""}>
        <div>
          {eyebrow ? (
            <p className="brand-eyebrow text-sm font-semibold uppercase tracking-[0.22em]">
              {toTitleCase(eyebrow)}
            </p>
          ) : null}
          <h1 className="mt-3 max-w-4xl text-3xl font-bold leading-tight text-slate-950 md:text-5xl dark:text-white">
            {toTitleCase(title)}
          </h1>
          {description ? (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-300">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-7">{children}</div> : null}
        </div>
        {aside ? <div>{aside}</div> : null}
      </div>
    </section>
  );
}

export function MediaFrame({
  src,
  alt,
  label,
  meta,
  children,
  className = "",
  compact = false,
}) {
  const resolvedSrc = resolvePublicMediaUrl(src);

  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border border-violet-100 bg-violet-50/60 dark:border-violet-950/60 dark:bg-violet-950/20",
        compact ? "aspect-[4/3]" : "aspect-[16/10]",
        className,
      ].join(" ")}
    >
      {resolvedSrc ? (
        <img src={resolvedSrc} alt={alt || label || ""} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full flex-col justify-between p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-700 shadow-sm dark:bg-[#15111c] dark:text-violet-200">
            <ImageIcon size={22} />
          </div>
          <div>
            {meta ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-200">
                {toTitleCase(meta)}
              </p>
            ) : null}
            <p className="mt-2 text-lg font-bold text-slate-950 dark:text-white">
              {toTitleCase(label || "Media gereja")}
            </p>
          </div>
        </div>
      )}
      {children ? <div className="absolute inset-x-0 bottom-0 p-4">{children}</div> : null}
    </div>
  );
}

export function InfoCard({ icon: Icon, title, description, meta, children, className = "" }) {
  return (
    <article className={`brand-card p-5 ${className}`}>
      {Icon ? (
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200">
          <Icon size={20} />
        </div>
      ) : null}
      {meta ? (
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-200">
          {toTitleCase(meta)}
        </p>
      ) : null}
      <h3 className={Icon || meta ? "mt-2 text-lg font-bold text-slate-950 dark:text-white" : "text-lg font-bold text-slate-950 dark:text-white"}>
        {toTitleCase(title)}
      </h3>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  );
}

export function TagList({ items = [], tone = "violet" }) {
  const className =
    tone === "cyan"
      ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-200"
      : "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200";

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
          {toTitleCase(item)}
        </span>
      ))}
    </div>
  );
}

export function EmptyPublicState({ title, description }) {
  return (
    <div className="brand-card p-6 text-center">
      <p className="text-base font-semibold text-slate-950 dark:text-white">{toTitleCase(title)}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </div>
  );
}
