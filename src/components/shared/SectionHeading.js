export default function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
  className = "",
}) {
  const alignClasses = {
    center: "text-center",
    left: "text-left",
  };

  return (
    <div className={`max-w-2xl mx-auto mb-12 ${alignClasses[align]} ${className}`}>
      {subtitle && (
        <p className="text-secondary font-semibold text-sm uppercase tracking-widest mb-3">
          {subtitle}
        </p>
      )}
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">
          {title}
        </h2>
      )}
      {description && (
        <p className="text-on-surface-variant text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
