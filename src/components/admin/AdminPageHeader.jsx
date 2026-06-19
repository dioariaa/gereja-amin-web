import { toTitleCase } from "../../utils/textFormat";

export default function AdminPageHeader({ eyebrow, title, description, actions, meta }) {
  return (
    <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.22em]">
            {toTitleCase(eyebrow)}
          </p>
        ) : null}
        <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl dark:text-white">
          {toTitleCase(title)}
        </h1>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        ) : null}
        {meta ? <div className="mt-4 flex flex-wrap gap-2">{meta}</div> : null}
      </div>

      {actions ? (
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
          {actions}
        </div>
      ) : null}
    </section>
  );
}
