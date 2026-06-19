import { toTitleCase } from "../utils/textFormat";

const sizeClasses = {
  sm: "h-10",
  md: "h-12",
  lg: "h-16",
};

export default function BrandLogo({
  size = "md",
  showText = true,
  subtitle = "Tangerang Raya",
  className = "",
  textClassName = "",
}) {
  return (
    <div className={`flex min-w-0 items-center gap-3 ${className}`}>
      <img
        src="/brand/gereja-amin-logo.svg"
        alt="Logo Gereja AMIN"
        className={`${sizeClasses[size] || sizeClasses.md} w-auto shrink-0 object-contain`}
      />
      {showText ? (
        <div className={`min-w-0 leading-tight ${textClassName}`}>
          <p className="truncate text-sm font-bold text-slate-950 dark:text-white">
            Gereja AMIN
          </p>
          {subtitle ? (
            <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
              {toTitleCase(subtitle)}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
