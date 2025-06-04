const analyzeHoffman = async (req, res) => {
    const { huffmanCode } = req.body;
    const steps = getHoffmanExecuteSteps(huffmanCode);
    res.json(steps);
};

const getHoffmanExecuteSteps = (huffmanCode) => {
    const steps = [];
    
    // Step 1: Count character frequencies
    const frequencyMap = new Map();
    for (const char of huffmanCode) {
        frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
    }
    steps.push({
        step: 1,
        description: "Count character frequencies",
        data: Object.fromEntries(frequencyMap)
    });

    // Step 2: Create priority queue (min heap) of nodes
    const nodes = Array.from(frequencyMap.entries()).map(([char, freq]) => ({
        char,
        freq,
        left: null,
        right: null
    }));
    steps.push({
        step: 2,
        description: "Create initial nodes",
        data: nodes
    });

    // Step 3: Build Huffman tree
    while (nodes.length > 1) {
        nodes.sort((a, b) => a.freq - b.freq);
        const left = nodes.shift();
        const right = nodes.shift();
        const parent = {
            char: null,
            freq: left.freq + right.freq,
            left,
            right
        };
        nodes.push(parent);
        steps.push({
            step: 3,
            description: "Merge nodes",
            data: {
                left: { char: left.char, freq: left.freq },
                right: { char: right.char, freq: right.freq },
                parent: { freq: parent.freq }
            }
        });
    }

    // Step 4: Generate Huffman codes
    const codes = new Map();
    const generateCodes = (node, code = '') => {
        if (!node) return;
        if (!node.left && !node.right) {
            codes.set(node.char, code);
        }
        generateCodes(node.left, code + '0');
        generateCodes(node.right, code + '1');
    };
    generateCodes(nodes[0]);
    steps.push({
        step: 4,
        description: "Generate Huffman codes",
        data: Object.fromEntries(codes)
    });

    // Step 5: Encode the input
    const encoded = Array.from(huffmanCode)
        .map(char => codes.get(char))
        .join('');
    steps.push({
        step: 5,
        description: "Encode input string",
        data: {
            original: huffmanCode,
            encoded: encoded
        }
    });

    return steps;
};

module.exports = {
    analyzeHoffman,
    getHoffmanExecuteSteps
};