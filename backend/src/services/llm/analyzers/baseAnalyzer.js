class BaseAnalyzer {
    constructor(provider) {
        if (!provider) {
            throw new Error('Provider is required for BaseAnalyzer');
        }
        this.provider = provider;
    }

    // Base initialize method - concrete analyzers should override this if needed
    async initialize() {
        // Default implementation does nothing
    }

    // Base analyze method - concrete analyzers MUST override this
    async analyze(prompt) {
        throw new Error('analyze method must be implemented by derived classes');
    }
}

module.exports = { BaseAnalyzer }; 