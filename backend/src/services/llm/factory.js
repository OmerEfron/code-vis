const OpenAIProvider = require('./providers/openai');
const CodeAnalyzer = require('./analyzers/codeAnalyzer');

// Define providers map outside the class to avoid circular dependency issues
const providers = {
    openai: OpenAIProvider
    // Add more providers here as they are implemented
};

class LLMFactory {
    static getProvider(type) {
        const Provider = providers[type.toLowerCase()];
        if (!Provider) {
            throw new Error(`Unsupported LLM provider type: ${type}`);
        }
        return Provider;
    }

    static createProvider(type, config) {
        const Provider = this.getProvider(type);
        return new Provider(config);
    }

    static createAnalyzer(config = {}) {
        // Default to OpenAI if no provider type is specified
        const providerType = config.provider || 'openai';
        const Provider = this.getProvider(providerType);
        const provider = new Provider(config);
        return new CodeAnalyzer(provider);
    }

    static getAvailableProviders() {
        return Object.keys(providers);
    }
}

module.exports = LLMFactory; 