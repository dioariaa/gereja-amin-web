import { Link } from "react-router-dom";
import { toTitleCase } from "../../utils/textFormat";

const variants = {
  primary: "brand-button-primary shadow-sm hover:-translate-y-0.5",
  secondary: "brand-button-secondary shadow-sm hover:-translate-y-0.5",
  danger:
    "border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/30",
  ghost:
    "text-slate-600 hover:bg-violet-50 dark:text-slate-300 dark:hover:bg-violet-950/30",
};

export default function ActionButton({
  to,
  children,
  icon: Icon,
  variant = "secondary",
  className = "",
  disabled = false,
  ...props
}) {
  const disabledClasses = disabled ? "pointer-events-none opacity-55" : "";
  const classes = `inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold leading-none transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 dark:focus-visible:ring-violet-900 ${variants[variant]} ${disabledClasses} ${className}`;
  const content = (
    <>
      {Icon ? <Icon className="shrink-0" size={17} /> : null}
      {typeof children === "string" ? toTitleCase(children) : children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-disabled={disabled || undefined} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} disabled={disabled} {...props}>
      {content}
    </button>
  );
}
