export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-default transition-all duration-200 cursor-pointer";

  const variants = {
    primary:
      "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container active:opacity-90",
    secondary:
      "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-on-primary",
    cta: "bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary font-bold",
    ghost: "bg-transparent text-on-surface hover:bg-surface-variant",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
