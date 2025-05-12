class BaseLLMProvider {
    constructor(config) {
        if (this.constructor === BaseLLMProvider) {
            throw new Error('BaseLLMProvider is an abstract class and cannot be instantiated directly');
        }
        this.config = config;
    }

    async initialize() {
        throw new Error('initialize() must be implemented by subclass');
    }

    async analyze(prompt, options = {}) {
        throw new Error('analyze() must be implemented by subclass');
    }

    async generateMetaphors(algorithmType, options = {}) {
        throw new Error('generateMetaphors() must be implemented by subclass');
    }

    async extractInputs(code, options = {}) {
        throw new Error('extractInputs() must be implemented by subclass');
    }

    async detectAlgorithm(code, options = {}) {
        throw new Error('detectAlgorithm() must be implemented by subclass');
    }
}

module.exports = BaseLLMProvider; 