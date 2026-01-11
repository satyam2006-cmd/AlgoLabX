/**
 * Max Heap Implementation with Animation Steps
 * 
 * Generates steps for visualization:
 * - { type: 'compare', indices: [i, j] }
 * - { type: 'swap', indices: [i, j] }
 * - { type: 'highlight', indices: [i], color: 'color-name' }
 */

export class MaxHeap {
    constructor() {
        this.heap = [];
        this.steps = [];
    }

    // Helper to add a step
    addStep(type, indices, label = '') {
        this.steps.push({ type, indices, label });
    }

    getSteps() {
        return this.steps;
    }

    clearSteps() {
        this.steps = [];
    }

    getHeap() {
        return [...this.heap];
    }

    setHeap(array) {
        this.heap = [...array];
        this.steps = [];
    }

    // Get parent index
    parent(i) {
        return Math.floor((i - 1) / 2);
    }

    // Get left child index
    leftChild(i) {
        return 2 * i + 1;
    }

    // Get right child index
    rightChild(i) {
        return 2 * i + 2;
    }

    swap(i, j) {
        this.addStep('swap', [i, j], `Swap ${this.heap[i]} and ${this.heap[j]}`);
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    heapifyUp(i) {
        let current = i;
        while (current > 0) {
            const p = this.parent(current);
            this.addStep('compare', [current, p], `Compare ${this.heap[current]} with parent ${this.heap[p]}`);

            if (this.heap[current] > this.heap[p]) {
                this.swap(current, p);
                current = p;
            } else {
                break;
            }
        }
    }

    heapifyDown(i, n = this.heap.length) {
        let largest = i;
        const left = this.leftChild(i);
        const right = this.rightChild(i);

        if (left < n) {
            this.addStep('compare', [largest, left], `Compare ${this.heap[largest]} with left child ${this.heap[left]}`);
            if (this.heap[left] > this.heap[largest]) {
                largest = left;
            }
        }

        if (right < n) {
            this.addStep('compare', [largest, right], `Compare ${this.heap[largest]} with right child ${this.heap[right]}`);
            if (this.heap[right] > this.heap[largest]) {
                largest = right;
            }
        }

        if (largest !== i) {
            this.swap(i, largest);
            this.heapifyDown(largest, n);
        }
    }

    insert(value) {
        this.clearSteps();
        this.heap.push(value);
        const index = this.heap.length - 1;
        this.addStep('add', [index], `Insert ${value}`);
        this.heapifyUp(index);
        this.addStep('done', [], 'Insertion Complete');
        return { heap: [...this.heap], steps: [...this.steps] };
    }

    extractMax() {
        this.clearSteps();
        if (this.heap.length === 0) return { heap: [], steps: [] };

        const max = this.heap[0];
        const last = this.heap.pop();

        this.addStep('highlight', [0], `Extract Max: ${max}`);

        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.addStep('replace', [0], `Move last element ${last} to root`);
            this.heapifyDown(0);
        }

        this.addStep('done', [], 'Extract Max Complete');
        return { heap: [...this.heap], steps: [...this.steps], max };
    }

    delete(index) {
        this.clearSteps();
        if (index >= this.heap.length) return { heap: [...this.heap], steps: [] };

        this.addStep('highlight', [index], `Delete element at index ${index}`);

        // Increase key to infinity using logic similar to updateKey then extract
        // But for visualization, a direct replacement/sift is often clearer or standard delete

        const last = this.heap.pop();

        if (index < this.heap.length) {
            this.heap[index] = last;
            this.addStep('replace', [index], `Replace with last element ${last}`);

            // Decide whether to sift up or down
            const p = this.parent(index);
            if (index > 0 && this.heap[index] > this.heap[p]) {
                this.heapifyUp(index);
            } else {
                this.heapifyDown(index);
            }
        }

        this.addStep('done', [], 'Delete Complete');
        return { heap: [...this.heap], steps: [...this.steps] };
    }

    updateKey(index, newValue) {
        this.clearSteps();
        if (index >= this.heap.length) return { heap: [...this.heap], steps: [] };

        const oldValue = this.heap[index];
        this.heap[index] = newValue;
        this.addStep('highlight', [index], `Update index ${index}: ${oldValue} -> ${newValue}`);

        if (newValue > oldValue) {
            this.heapifyUp(index);
        } else {
            this.heapifyDown(index);
        }

        this.addStep('done', [], 'Update Key Complete');
        return { heap: [...this.heap], steps: [...this.steps] };
    }

    heapSort() {
        this.clearSteps();
        // We will copy the heap to avoid destroying the current visualization state permanently if not desired, 
        // but usually Heap Sort is done ON the array. 
        // For visualization purposes, we assume we are sorting the current heap structure.

        const originalHeap = [...this.heap];
        const n = this.heap.length;

        // Build heap (already built if using the class, but good to ensure)
        // For sort visualization, we usually show the extraction phase

        for (let i = n - 1; i > 0; i--) {
            this.swap(0, i);
            this.addStep('lock', [i], `${this.heap[i]} is sorted`);
            this.heapifyDown(0, i);
        }

        const sorted = [...this.heap];
        this.heap = originalHeap; // Restore for the sake of the 'Heap' object specific state, or keep sorted?
        // Usually Heap Sort destroys the Heap property.
        // Let's decide to Keep it sorted (Min Heap shape essentially or just identifying it's done)
        // But for a "Heap Visualizer", usually you want to keep it as a Heap. 
        // Let's return the steps and revert internal state or let the specific "Sort" button handle a temporary visualization.
        // We will return steps but NOT permute the internal official 'this.heap' to be a sorted non-heap, 
        // UNLESS the user explicitly wants to transform it. 
        // Steps will reflect the sort.

        return { heap: sorted, steps: [...this.steps] };
    }

    createRandom(size = 10, maxVal = 100) {
        this.clearSteps();
        this.heap = [];
        for (let i = 0; i < size; i++) {
            this.heap.push(Math.floor(Math.random() * maxVal) + 1);
        }
        // Bulk build
        for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            this.heapifyDown(i);
        }
        this.addStep('done', [], 'Random Heap Created');
        return { heap: [...this.heap], steps: [] }; // No steps for instant creation
    }
}
