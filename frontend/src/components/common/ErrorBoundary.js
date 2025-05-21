import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Visualization error:', error);
        console.error('Error details:', errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 border border-red-300 rounded bg-red-50">
                    <h3 className="text-red-700 font-bold mb-2">Visualization Error</h3>
                    <p className="text-red-600">{this.state.error?.message || 'An error occurred while rendering the visualization'}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        onClick={() => this.setState({ hasError: false, error: null })}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 