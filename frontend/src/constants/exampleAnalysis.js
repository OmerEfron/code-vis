export const EXAMPLE_CODE = `#include <stdio.h>

int linearSearch(int a[], int n, int x) {
    for (int i = 0; i < n; i++)
        if (a[i] == x) return i;
    return -1;
}

int main() {
    int a[] = {1, 3, 5, 7, 9, 11}, n = 6, x = 7;
    int i = linearSearch(a, n, x);
    printf("Index: %d\\n", i);
    return 0;
}`;

export const EXAMPLE_ANALYSIS = {
    "success": true,
    "analysis": {
        "algorithm": {
            "algorithmType": "Linear Search",
            "category": "Searching",
            "timeComplexity": "O(n)",
            "spaceComplexity": "O(1)",
            "confidence": 1,
            "explanation": "The code implements the linear search algorithm. It iterates over the array in a sequential manner and checks if the current element is equal to the target element. If it is, it returns the index of that element. If it doesn't find the element in the array, it returns -1. The time complexity is O(n) because in the worst case it might have to check all elements in the array. The space complexity is O(1) because it only uses a constant amount of additional space."
        },
        "inputs": {
            "inputs": [
                {
                    "name": "a",
                    "type": "array",
                    "constraints": [
                        "The array 'a' must be an array of integers."
                    ],
                    "description": "An array of integers in which to search for the target value."
                },
                {
                    "name": "n",
                    "type": "integer",
                    "constraints": [
                        "The integer 'n' must be the length of the array 'a'."
                    ],
                    "description": "The length of the array 'a'."
                },
                {
                    "name": "x",
                    "type": "integer",
                    "constraints": [
                        "The integer 'x' is the target value to search for in the array 'a'."
                    ],
                    "description": "The target value to search for in the array 'a'."
                }
            ],
            "examples": [
                {
                    "input": "{a: [1, 3, 5, 7, 9, 11], n: 6, x: 7}",
                    "expectedOutput": "3"
                },
                {
                    "input": "{a: [10, 20, 30, 40, 50], n: 5, x: 30}",
                    "expectedOutput": "2"
                }
            ]
        },
        "metaphors": [
            {
                "name": "Bookshelf Search",
                "description": "This metaphor represents the algorithm as a process of searching for a specific book on a bookshelf.",
                "learningStyle": "visual",
                "steps": [
                    "Begin at the first book",
                    "Check if the book title matches the target",
                    "Move to the next book if not",
                    "Repeat until the book is found or all books are checked"
                ],
                "elements": {
                    "Bookshelf": "Array",
                    "Book": "Array Element",
                    "Desired Book Title": "Search Element"
                },
                "visualProperties": {
                    "primaryElements": [
                        "Bookshelf",
                        "Book"
                    ],
                    "secondaryElements": [
                        "Desired Book Title"
                    ],
                    "animations": [
                        "Highlighting the current book",
                        "Moving to the next book"
                    ],
                    "interactiveElements": [
                        "Clickable books",
                        "Draggable bookshelf scroll"
                    ],
                    "layout": {
                        "type": "Horizontal",
                        "arrangement": "Linear"
                    },
                    "colorScheme": {
                        "primary": "Brown",
                        "secondary": "Green",
                        "highlight": "Red"
                    }
                },
                "suggestedControls": [
                    "Click on book",
                    "Drag scroll to move through bookshelf"
                ]
            },
            {
                "name": "Supermarket Aisle Search",
                "description": "This metaphor imagines the algorithm like searching for a specific product in a supermarket aisle.",
                "learningStyle": "kinesthetic",
                "steps": [
                    "Start at one end of the aisle",
                    "Check if the current product is the one you're looking for",
                    "Move to the next product if not",
                    "Repeat until product is found or all products are checked"
                ],
                "elements": {
                    "Aisle": "Array",
                    "Product": "Array Element",
                    "Desired Product": "Search Element"
                },
                "visualProperties": {
                    "primaryElements": [
                        "Aisle",
                        "Product"
                    ],
                    "secondaryElements": [
                        "Desired Product"
                    ],
                    "animations": [
                        "Highlighting current product",
                        "Moving to the next product"
                    ],
                    "interactiveElements": [
                        "Clickable products",
                        "Draggable aisle scroll"
                    ],
                    "layout": {
                        "type": "Vertical",
                        "arrangement": "Linear"
                    },
                    "colorScheme": {
                        "primary": "White",
                        "secondary": "Blue",
                        "highlight": "Yellow"
                    }
                },
                "suggestedControls": [
                    "Click on product",
                    "Drag scroll to move through aisle"
                ]
            },
            {
                "name": "Song Playlist Search",
                "description": "It's like searching for a particular song in a playlist.",
                "learningStyle": "auditory",
                "steps": [
                    "Start at the first song",
                    "Check if the current song is the one you're looking for",
                    "Skip to the next song if not",
                    "Repeat until song is found or all songs are checked"
                ],
                "elements": {
                    "Playlist": "Array",
                    "Song": "Array Element",
                    "Desired Song": "Search Element"
                },
                "visualProperties": {
                    "primaryElements": [
                        "Playlist",
                        "Song"
                    ],
                    "secondaryElements": [
                        "Desired Song"
                    ],
                    "animations": [
                        "Highlighting current song",
                        "Moving to the next song"
                    ],
                    "interactiveElements": [
                        "Clickable songs",
                        "Draggable playlist scroll"
                    ],
                    "layout": {
                        "type": "Vertical",
                        "arrangement": "Linear"
                    },
                    "colorScheme": {
                        "primary": "Black",
                        "secondary": "White",
                        "highlight": "Green"
                    }
                },
                "suggestedControls": [
                    "Click on song",
                    "Drag scroll to move through playlist"
                ]
            }
        ]
    },
    "visualization": {
        "type": "Linear Search",
        "recommended": {
            "visualElements": {
                "primary": [
                    "algorithm-state",
                    "current-step"
                ],
                "secondary": [
                    "metrics",
                    "progress"
                ],
                "controls": [
                    "play",
                    "pause",
                    "step",
                    "speed",
                    "reset"
                ],
                "metrics": {
                    "basic": [
                        "comparisons",
                        "swaps",
                        "memory-usage"
                    ],
                    "advanced": [
                        "time-complexity",
                        "space-complexity",
                        "current-phase"
                    ]
                },
                "indicators": {
                    "status": [
                        "current-state",
                        "next-action",
                        "completion"
                    ],
                    "progress": [
                        "step-count",
                        "phase-progress",
                        "total-progress"
                    ]
                }
            },
            "layout": {
                "orientation": "vertical",
                "spacing": 30,
                "dimensions": {
                    "width": 1000,
                    "height": 600,
                    "padding": 20,
                    "gutter": 10
                },
                "grid": {
                    "columns": 12,
                    "rows": 8,
                    "gap": 15
                },
                "sections": {
                    "main": {
                        "height": "70%"
                    },
                    "controls": {
                        "height": "10%"
                    },
                    "metrics": {
                        "height": "20%"
                    }
                },
                "responsive": {
                    "breakpoints": {
                        "small": 768,
                        "medium": 1024,
                        "large": 1440
                    },
                    "layouts": {
                        "small": {
                            "orientation": "vertical"
                        },
                        "medium": {
                            "orientation": "horizontal"
                        },
                        "large": {
                            "orientation": "horizontal"
                        }
                    }
                }
            },
            "animations": {
                "duration": 500,
                "easing": "easeInOutQuad",
                "highlights": true,
                "transitions": {},
                "effects": {
                    "highlight": {
                        "color": "#FFD700",
                        "duration": 300,
                        "fadeOut": true
                    },
                    "emphasis": {
                        "scale": 1.1,
                        "duration": 200,
                        "elastic": true
                    }
                },
                "timing": {
                    "staggered": 50,
                    "pause": 300,
                    "completion": 500
                }
            }
        }
    }
}; 