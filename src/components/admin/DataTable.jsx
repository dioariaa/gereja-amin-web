import { toTitleCase } from "../../utils/textFormat";

export default function DataTable({ title, eyebrow, actions, children, footer }) {
  return (
    <section className="brand-card min-w-0 p-5 md:p-6">
      {(title || eyebrow || actions) ? (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            {eyebrow ? (
              <p className="brand-eyebrow text-xs font-semibold uppercase tracking-[0.22em]">
                {toTitleCase(eyebrow)}
              </p>
            ) : null}
            {title ? (
              <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950 md:text-2xl dark:text-white">
                {toTitleCase(title)}
              </h2>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
              {actions}
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className={
          title || eyebrow || actions
            ? "mt-6 overflow-x-auto overscroll-x-contain rounded-xl"
            : "overflow-x-auto overscroll-x-contain rounded-xl"
        }
      >
        {children}
      </div>
      {footer ? <div className="mt-5">{footer}</div> : null}
    </section>
  );
}
