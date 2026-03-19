export default function Badge({ status, children }) {
  const styles = {
    active: "bg-green-50 text-green-600 border-green-200",
    expired: "bg-red-50 text-red-600 border-red-200",
    paused: "bg-orange-50 text-orange-600 border-orange-200",
    default: "bg-gray-50 text-gray-600 border-gray-200"
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium border rounded-full ${styles[status] || styles.default}`}>
      {children}
    </span>
  );
}