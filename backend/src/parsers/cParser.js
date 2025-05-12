// Basic C code parser for algorithm visualization
class CParser {
    constructor() {
        this.code = '';
        this.tokens = [];
        this.currentIndex = 0;
    }

    parse(code) {
        this.code = code;
        this.tokens = this.tokenize(code);
        
        return {
            type: this.detectAlgorithmType(),
            structure: this.extractAlgorithmStructure(),
            data: this.extractInitialData()
        };
    }

    tokenize(code) {
        // Simple tokenization - this would be expanded based on needs
        return code
            .replace(/[{()}]/g, ' $& ')
            .replace(/;/g, ' ; ')
            .split(/\s+/)
            .filter(token => token.length > 0);
    }

    detectAlgorithmType() {
        // Simple algorithm detection based on function names and patterns
        const code = this.code.toLowerCase();
        
        if (code.includes('merge') && code.includes('sort')) {
            return 'mergeSort';
        }
        // Add more algorithm detection patterns here
        
        return 'unknown';
    }

    extractAlgorithmStructure() {
        // Extract the basic structure of the algorithm
        const structure = {
            functions: this.extractFunctions(),
            loops: this.extractLoops(),
            conditionals: this.extractConditionals()
        };

        return structure;
    }

    extractFunctions() {
        const functions = [];
        const functionRegex = /\w+\s+(\w+)\s*\([^)]*\)\s*{/g;
        let match;

        while ((match = functionRegex.exec(this.code)) !== null) {
            functions.push({
                name: match[1],
                startIndex: match.index
            });
        }

        return functions;
    }

    extractLoops() {
        const loops = [];
        const loopRegex = /(for|while)\s*\([^)]*\)\s*{/g;
        let match;

        while ((match = loopRegex.exec(this.code)) !== null) {
            loops.push({
                type: match[1],
                startIndex: match.index
            });
        }

        return loops;
    }

    extractConditionals() {
        const conditionals = [];
        const ifRegex = /if\s*\([^)]*\)\s*{/g;
        let match;

        while ((match = ifRegex.exec(this.code)) !== null) {
            conditionals.push({
                startIndex: match.index
            });
        }

        return conditionals;
    }

    extractInitialData() {
        // Extract initial array or data structure
        // This is a simplified version - would need to be expanded
        const arrayRegex = /{\s*([\d,\s]+)\s*}/;
        const match = arrayRegex.exec(this.code);
        
        if (match) {
            return match[1].split(',').map(num => parseInt(num.trim()));
        }
        
        return [];
    }
}

module.exports = CParser; 