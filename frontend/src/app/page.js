'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import CodeInput from '@/components/CodeInput';
import ScenarioSelect from '@/components/ScenarioSelect';

// Dynamically import the visualization component to avoid SSR issues with Konva
const AlgorithmVisualization = dynamic(
  () => import('@/components/AlgorithmVisualization'),
  { ssr: false }
);

export default function Home() {
  const [code, setCode] = useState('');
  const [scenario, setScenario] = useState(null);
  const [visualizationData, setVisualizationData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVisualize = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch('http://localhost:3000/api/visualizations/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, scenario }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate visualization');
      }

      setVisualizationData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Algorithm Visualization Through Metaphors
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CodeInput
            value={code}
            onChange={setCode}
            isLoading={isLoading}
          />
          <ScenarioSelect
            value={scenario}
            onChange={setScenario}
            isLoading={isLoading}
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleVisualize}
            disabled={isLoading || !code || !scenario}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Visualize Algorithm'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {visualizationData && (
          <div className="mt-8">
            <AlgorithmVisualization data={visualizationData} />
          </div>
        )}
      </div>
    </main>
  );
}
