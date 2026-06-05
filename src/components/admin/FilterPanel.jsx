export default function FilterPanel({ children, columns = "md:grid-cols-3" }) {
  return (
    <section className="brand-card p-5 md:p-6">
      <div className={`grid items-end gap-5 ${columns}`}>{children}</div>
    </section>
  );
}
