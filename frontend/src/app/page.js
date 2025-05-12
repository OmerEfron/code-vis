'use client';

import CodeAnalyzer from '@/components/CodeAnalyzer';

export default function Home() {
    return (
        <main className="min-h-screen p-8">
            <h1 className="text-4xl font-bold mb-8 text-center">
                Algorithm Visualization Through Metaphors
            </h1>
            <CodeAnalyzer />
        </main>
    );
}
