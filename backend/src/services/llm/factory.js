const OpenAIProvider = require('./providers/openai');

class LLMFactory {
    static providers = {
        openai: OpenAIProvider
        // Add more providers here as they are implemented
    };

    static createProvider(type, config) {
        const Provider = this.providers[type.toLowerCase()];
        if (!Provider) {
            throw new Error(`Unsupported LLM provider type: ${type}`);
        }
        return new Provider(config);
    }

    static getAvailableProviders() {
        return Object.keys(this.providers);
    }
}

module.exports = LLMFactory; 