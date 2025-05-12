'use client';

export default function MetaphorSelector({ metaphors, onSelect, selected }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Choose a Metaphor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metaphors.map((metaphor, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selected === metaphor
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => onSelect(metaphor)}
                    >
                        <h4 className="font-medium text-lg mb-2">{metaphor.name}</h4>
                        <p className="text-gray-600 text-sm mb-3">{metaphor.description}</p>
                        <div className="space-y-2">
                            <div className="text-sm font-medium">Learning Style: {metaphor.learningStyle}</div>
                            <div className="text-sm">
                                <span className="font-medium">Key Elements:</span>
                                <ul className="mt-1 list-disc list-inside">
                                    {Object.entries(metaphor.elements).map(([key, value]) => (
                                        <li key={key} className="text-gray-600">
                                            {key}: {value}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="text-sm mt-2">
                                <span className="font-medium">Steps:</span>
                                <ol className="mt-1 list-decimal list-inside">
                                    {metaphor.steps.map((step, stepIndex) => (
                                        <li key={stepIndex} className="text-gray-600">
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 