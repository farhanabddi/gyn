export default function Card({ children, className = '', noPadding = false }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
}