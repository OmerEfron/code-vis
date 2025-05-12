class Algorithm {
    constructor(name, code) {
        this.name = name;
        this.code = code;
        this.states = [];
        this.currentState = 0;
        this.complexityMetrics = {
            comparisons: 0,
            arrayAccesses: 0,
            memoryUsage: {
                auxiliary: 0,
                maxAuxiliary: 0
            }
        };
    }

    initialize() {
        throw new Error('Initialize method must be implemented by subclass');
    }

    nextState() {
        throw new Error('NextState method must be implemented by subclass');
    }

    toMetaphorState(scenario) {
        throw new Error('ToMetaphorState method must be implemented by subclass');
    }

    getAllStates(scenario) {
        const states = [];
        while (this.hasNextState()) {
            const algorithmState = this.nextState();
            const metaphorState = this.toMetaphorState(scenario, algorithmState);
            states.push(metaphorState);
        }
        return states;
    }

    hasNextState() {
        return this.currentState < this.states.length;
    }

    reset() {
        this.currentState = 0;
        this.states = [];
    }
}

class MergeSortAlgorithm extends Algorithm {
    initialize() {
        const array = this.parseInputArray();
        this.complexityMetrics = {
            comparisons: 0,
            arrayAccesses: 0,
            memoryUsage: {
                auxiliary: 0,
                maxAuxiliary: 0
            }
        };
        this.generateStates(array);
        this.currentState = 0;
    }

    parseInputArray() {
        const arrayMatch = this.code.match(/int\s+arr\[\]\s*=\s*{([^}]+)}/);
        if (arrayMatch) {
            return arrayMatch[1].split(',').map(num => parseInt(num.trim()));
        }
        throw new Error('Could not parse input array from code');
    }

    generateStates(arr) {
        this.states = [];
        const n = arr.length;
        const array = [...arr];

        // Track auxiliary memory usage
        this.complexityMetrics.memoryUsage.auxiliary = n;
        this.complexityMetrics.memoryUsage.maxAuxiliary = n;

        // Initial state
        this.states.push({
            type: 'initial',
            data: [...array],
            description: "You're a teacher with a stack of exam papers, each marked with a score. You want to arrange them from lowest to highest so that entering the grades into the system is easy and fair.",
            piles: [{ papers: [...array], level: 0 }],
            complexity: {
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                currentMemoryUsage: {
                    main: n,
                    auxiliary: 0,
                    total: n
                },
                comparisons: 0,
                arrayAccesses: 0
            }
        });

        for (let size = 1; size < n; size *= 2) {
            // Phase description for each size increase
            const phaseDescription = size === 1 
                ? "Phase 1: Start small - You begin by pairing up adjacent papers and comparing just two at a time, like sorting students into pairs to see who scored lower."
                : `Phase ${Math.log2(size) + 1}: Merge sorted groups of ${size} - Now you take every ${size} sorted papers and merge them into larger sorted groups.`;
            
            const currentPiles = [];
            for (let start = 0; start < n; start += size) {
                const pileEnd = Math.min(start + size, n);
                currentPiles.push({
                    papers: array.slice(start, pileEnd),
                    start,
                    end: pileEnd - 1,
                    level: Math.log2(size)
                });
                this.complexityMetrics.arrayAccesses += pileEnd - start;
            }

            this.states.push({
                type: 'split',
                data: [...array],
                description: phaseDescription,
                piles: currentPiles,
                complexity: {
                    phase: `Organizing papers into groups of ${size}`,
                    currentMemoryUsage: {
                        main: n,
                        auxiliary: this.complexityMetrics.memoryUsage.auxiliary,
                        total: n + this.complexityMetrics.memoryUsage.auxiliary
                    },
                    comparisons: this.complexityMetrics.comparisons,
                    arrayAccesses: this.complexityMetrics.arrayAccesses
                }
            });

            for (let left = 0; left < n - 1; left += 2 * size) {
                const mid = Math.min(left + size, n);
                const right = Math.min(left + 2 * size, n);

                if (mid >= n) continue;

                const leftPile = array.slice(left, mid);
                const rightPile = array.slice(mid, right);
                this.complexityMetrics.arrayAccesses += right - left;

                const mergedPile = [];
                let i = 0, j = 0;
                const temp = new Array(right - left);
                let k = 0;

                while (i < leftPile.length && j < rightPile.length) {
                    this.complexityMetrics.comparisons++;
                    this.complexityMetrics.arrayAccesses += 2;

                    this.states.push({
                        type: 'compare_papers',
                        data: [...array],
                        description: `Comparing papers: Looking at scores ${leftPile[i]} and ${rightPile[j]} - the one with fewer points goes on top in the new stack.`,
                        piles: currentPiles,
                        comparing: {
                            left: { value: leftPile[i] },
                            right: { value: rightPile[j] }
                        },
                        mergedSoFar: [...mergedPile],
                        complexity: {
                            phase: 'Compare & Merge Pairs',
                            currentMemoryUsage: {
                                main: n,
                                auxiliary: this.complexityMetrics.memoryUsage.auxiliary,
                                total: n + this.complexityMetrics.memoryUsage.auxiliary
                            },
                            comparisons: this.complexityMetrics.comparisons,
                            arrayAccesses: this.complexityMetrics.arrayAccesses
                        }
                    });

                    if (leftPile[i] <= rightPile[j]) {
                        temp[k] = leftPile[i];
                        mergedPile.push(leftPile[i]);
                        i++;
                    } else {
                        temp[k] = rightPile[j];
                        mergedPile.push(rightPile[j]);
                        j++;
                    }
                    k++;
                    this.complexityMetrics.arrayAccesses++;
                }

                while (i < leftPile.length) {
                    temp[k] = leftPile[i];
                    mergedPile.push(leftPile[i]);
                    i++;
                    k++;
                    this.complexityMetrics.arrayAccesses += 2;
                }

                while (j < rightPile.length) {
                    temp[k] = rightPile[j];
                    mergedPile.push(rightPile[j]);
                    j++;
                    k++;
                    this.complexityMetrics.arrayAccesses += 2;
                }

                for (let m = 0; m < k; m++) {
                    array[left + m] = temp[m];
                    this.complexityMetrics.arrayAccesses += 2;
                }

                this.states.push({
                    type: 'merge_complete',
                    data: [...array],
                    description: `Completed merging: Created a new sorted group of ${k} papers.`,
                    mergedSection: {
                        start: left,
                        end: right - 1,
                        papers: array.slice(left, right)
                    },
                    complexity: {
                        phase: 'Merge Complete',
                        currentMemoryUsage: {
                            main: n,
                            auxiliary: this.complexityMetrics.memoryUsage.auxiliary,
                            total: n + this.complexityMetrics.memoryUsage.auxiliary
                        },
                        comparisons: this.complexityMetrics.comparisons,
                        arrayAccesses: this.complexityMetrics.arrayAccesses
                    }
                });
            }
        }

        // Final state
        this.states.push({
            type: 'final',
            data: [...array],
            description: "✅ Final Phase: The stack of exam papers is fully sorted. You can now quickly input the grades into your system, ensuring fair and organized grading.",
            piles: [{ papers: [...array], level: Math.log2(n) }],
            complexity: {
                timeComplexity: 'O(n log n)',
                spaceComplexity: 'O(n)',
                finalStats: {
                    totalComparisons: this.complexityMetrics.comparisons,
                    totalArrayAccesses: this.complexityMetrics.arrayAccesses,
                    maxAuxiliaryMemory: this.complexityMetrics.memoryUsage.maxAuxiliary
                }
            }
        });
    }

    nextState() {
        if (!this.hasNextState()) {
            return null;
        }
        return this.states[this.currentState++];
    }

    toMetaphorState(scenario, algorithmState) {
        if (!algorithmState) return null;

        const baseY = 300;
        const levelHeight = 80;
        const paperWidth = 40;
        const paperHeight = 60;
        const paperSpacing = 20;
        const pileSpacing = 60;

        let papers = [];
        let visualElements = {
            piles: [],
            arrows: [],
            comparisons: []
        };

        switch (algorithmState.type) {
            case 'initial':
            case 'final':
                papers = algorithmState.data.map((score, index) => ({
                    score,
                    position: {
                        x: 50 + index * (paperWidth + paperSpacing),
                        y: baseY
                    },
                    opacity: 1
                }));
                break;

            case 'split':
                algorithmState.piles.forEach((pile, pileIndex) => {
                    pile.papers.forEach((score, paperIndex) => {
                        const pileX = 50 + pileIndex * (pile.papers.length * (paperWidth + paperSpacing) + pileSpacing);
                        papers.push({
                            score,
                            position: {
                                x: pileX + paperIndex * (paperWidth + paperSpacing),
                                y: baseY - pile.level * levelHeight
                            },
                            opacity: 1
                        });
                    });
                });
                break;

            case 'compare_piles':
            case 'compare_papers':
                // Draw all piles
                algorithmState.piles.forEach((pile, pileIndex) => {
                    pile.papers.forEach((score, paperIndex) => {
                        const pileX = 50 + pileIndex * (pile.papers.length * (paperWidth + paperSpacing) + pileSpacing);
                        const isComparing = algorithmState.comparing && 
                            (pile.start + paperIndex === algorithmState.comparing.left.index ||
                             pile.start + paperIndex === algorithmState.comparing.right.index);
                        
                        papers.push({
                            score,
                            position: {
                                x: pileX + paperIndex * (paperWidth + paperSpacing),
                                y: baseY - pile.level * levelHeight + (isComparing ? -20 : 0)
                            },
                            opacity: 1,
                            highlighted: isComparing
                        });
                    });
                });

                // Add comparison arrows if papers are being compared
                if (algorithmState.comparing) {
                    visualElements.comparisons.push({
                        from: algorithmState.comparing.left,
                        to: algorithmState.comparing.right
                    });
                }
                break;

            case 'intermediate_merge':
            case 'merge_complete':
                const mergedPapers = algorithmState.mergedPile?.papers || algorithmState.mergedSection?.papers || [];
                const startX = 50 + algorithmState.mergedPile?.start * (paperWidth + paperSpacing);

                mergedPapers.forEach((score, index) => {
                    papers.push({
                        score,
                        position: {
                            x: startX + index * (paperWidth + paperSpacing),
                            y: baseY
                        },
                        opacity: 1,
                        highlighted: true
                    });
                });
                break;
        }

        // Add complexity information to the return object
        return {
            type: algorithmState.type,
            papers,
            description: algorithmState.description,
            visualElements,
            complexity: algorithmState.complexity
        };
    }
}

module.exports = {
    Algorithm,
    MergeSortAlgorithm
}; 