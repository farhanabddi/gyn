export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none";
  const variants = {
    primary: "bg-brand-400 hover:bg-brand-500 text-gray-900",
    ghost: "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}