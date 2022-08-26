import PriorityQueue from "./PriorityQueue";

class PriorityQueueDijkstra extends PriorityQueue {
    //the particular priority queue class that will be used by the Dijkstra algorithm
    constructor() {
        super();
    }

    minIndex(index1, index2) {
        if (this.nodes[index1].getValueD() < this.nodes[index2].getValueD()) {
            return index1;
        } else {
            return index2;
        }
    }

    insertNode(node) {
        this.nodes.push(node); //adds the new node to the end of the heap
        let stop = false;
        let currentIndex = this.size;
        let parentIndex;
        //heapify up. The added node ascents to the right level
        while (!stop && currentIndex > 0) {
            parentIndex = parseInt((currentIndex - 1) / 2);
            if (this.nodes[currentIndex].getValueD() < this.nodes[parentIndex].getValueD()) {
                    this.swap(currentIndex, parentIndex);
                    currentIndex = parentIndex;
            } else {
                stop = true;
            } 
        }
        this.size += 1;
    }


    extractMin() {
        if (this.size === 0) return null;
        this.size -= 1;
        const min = this.nodes[0];
        this.nodes[0] = this.nodes[this.size]; //put the last node to the root. The previous root is therefore removed
        this.nodes.pop();
        let stop = false;
        let currentIndex = 0;
        let leftChildIndex, rightChildIndex, minIndex;
        //heapify down. The new root (ie the previous last item) descent to the right level
        while (!stop && currentIndex < this.size) {
            leftChildIndex = 2 * currentIndex + 1;
            rightChildIndex = 2 * currentIndex + 2;
            if (leftChildIndex < this.size && rightChildIndex < this.size) {
                minIndex = this.minIndex(leftChildIndex, rightChildIndex); //returns the index of the child with the smallest f value
                if (this.nodes[minIndex].getValueD() < this.nodes[currentIndex].getValueD()) {
                    this.swap(currentIndex, minIndex);
                    currentIndex = minIndex;
                } else {
                    stop = true;
                }
            } 
            else if (leftChildIndex < this.size) {
                if (this.nodes[leftChildIndex].getValueD() < this.nodes[currentIndex].getValueD()) {
                    this.swap(currentIndex, leftChildIndex);
                    currentIndex = leftChildIndex;
                } else {
                    stop = true;
                }
            }
            else {
                stop = true;
            }
        }
        return min;
    }


    printNodes() {
        let i;
        for (i = 0; i < this.size; i++) {
            console.log(this.nodes[i].getValueD(), this.nodes[i].getRow(), this.nodes[i].getColumn());
        }
        console.log("---------");
    }
}

export default PriorityQueueDijkstra;
