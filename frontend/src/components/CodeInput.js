export default function CodeInput({ value, onChange, isLoading }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="code"
        className="block text-sm font-medium text-gray-700"
      >
        Algorithm Code (C)
      </label>
      <textarea
        id="code"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isLoading}
        placeholder="Enter your C code here..."
        className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
      />
    </div>
  );
} 