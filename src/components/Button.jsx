export default function Button({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) {
  const baseStyle = "inline-flex justify-center items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 active:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}