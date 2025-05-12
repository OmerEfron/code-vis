'use client';

export default function CodeInput({ value, onChange, isLoading }) {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Your Algorithm Code
            </label>
            <div className="relative">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={isLoading}
                    placeholder="Paste your algorithm code here..."
                    className="w-full h-64 p-4 border rounded-lg font-mono text-sm resize-none
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
                The code will be analyzed to identify the algorithm and suggest appropriate metaphors.
            </p>
        </div>
    );
} 