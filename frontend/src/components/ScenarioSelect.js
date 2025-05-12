import { useEffect, useState } from 'react';

export default function ScenarioSelect({ value, onChange, isLoading }) {
  const [scenarios, setScenarios] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/visualizations/scenarios');
        const data = await response.json();
        setScenarios(Object.entries(data).map(([key, scenario]) => ({
          id: key,
          ...scenario
        })));
      } catch (err) {
        setError('Failed to load scenarios');
        console.error('Error loading scenarios:', err);
      }
    };

    fetchScenarios();
  }, []);

  return (
    <div className="space-y-2">
      <label
        htmlFor="scenario"
        className="block text-sm font-medium text-gray-700"
      >
        Visualization Scenario
      </label>
      {error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : (
        <div className="space-y-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                value?.name === scenario.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !isLoading && onChange(scenario)}
            >
              <h3 className="font-medium mb-2">{scenario.name}</h3>
              <p className="text-sm text-gray-600">{scenario.description}</p>
              {value?.name === scenario.name && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Metaphor Details:</h4>
                  <ul className="text-sm text-gray-600">
                    {Object.entries(scenario.metaphor).map(([key, value]) => (
                      <li key={key} className="flex">
                        <span className="font-medium w-24">{key}:</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 