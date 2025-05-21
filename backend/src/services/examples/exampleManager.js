const fs = require('fs').promises;
const path = require('path');

class ExampleManager {
    constructor() {
        this.examplesDir = path.join(__dirname, '../../data/examples');
    }

    async getAllExamples() {
        try {
            const files = await fs.readdir(this.examplesDir);
            const examples = await Promise.all(
                files
                    .filter(file => file.endsWith('.json'))
                    .map(async (file) => {
                        const content = await fs.readFile(path.join(this.examplesDir, file), 'utf-8');
                        const example = JSON.parse(content);
                        // Add an ID based on the filename
                        example.id = path.basename(file, '.json');
                        return example;
                    })
            );
            return { success: true, examples };
        } catch (error) {
            console.error('Error loading examples:', error);
            return { success: false, error: 'Failed to load examples' };
        }
    }

    async saveExample(example) {
        try {
            const id = `example_${Date.now()}`;
            const filePath = path.join(this.examplesDir, `${id}.json`);
            
            // Add metadata if not present
            if (!example.metadata) {
                example.metadata = {
                    savedAt: new Date().toISOString(),
                    algorithmType: example.analysis?.algorithm?.algorithmType || 'Unknown',
                    complexity: {
                        time: example.analysis?.algorithm?.timeComplexity || 'Unknown',
                        space: example.analysis?.algorithm?.spaceComplexity || 'Unknown'
                    }
                };
            }
            
            await fs.writeFile(filePath, JSON.stringify(example, null, 2));
            return { success: true, id };
        } catch (error) {
            console.error('Error saving example:', error);
            return { success: false, error: 'Failed to save example' };
        }
    }

    async getExamples(algorithmType = null) {
        try {
            const files = await fs.readdir(this.examplesDir);
            const examples = [];

            for (const file of files) {
                if (path.extname(file) === '.json') {
                    const content = await fs.readFile(path.join(this.examplesDir, file), 'utf8');
                    const example = JSON.parse(content);

                    // Filter by algorithm type if specified
                    if (!algorithmType || 
                        example.analysis.algorithm.algorithmType.toLowerCase() === algorithmType.toLowerCase()) {
                        examples.push({
                            id: path.basename(file, '.json'),
                            ...example
                        });
                    }
                }
            }

            // Sort by timestamp (newest first)
            return examples.sort((a, b) => {
                const timestampA = new Date(a.metadata.savedAt).getTime();
                const timestampB = new Date(b.metadata.savedAt).getTime();
                return timestampB - timestampA;
            });
        } catch (error) {
            console.error('Error getting examples:', error);
            return [];
        }
    }

    async getExampleById(id) {
        try {
            const filepath = path.join(this.examplesDir, `${id}.json`);
            const content = await fs.readFile(filepath, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            console.error('Error getting example by id:', error);
            return null;
        }
    }

    async deleteExample(id) {
        try {
            const filepath = path.join(this.examplesDir, `${id}.json`);
            await fs.unlink(filepath);
            return true;
        } catch (error) {
            console.error('Error deleting example:', error);
            return false;
        }
    }
}

module.exports = new ExampleManager(); 