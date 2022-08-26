import Node from "./Node";

class PriorityQueue {
    //implemented as min heap
    constructor() {
        this.nodes = [];
        this.size = 0;
    }

    swap(index1, index2) {
        const temp = this.nodes[index1];
        this.nodes[index1] = this.nodes[index2];
        this.nodes[index2] = temp;
    }

    isEmpty() {
        return this.size === 0;
    }


    find(node) {
        let i = 0, found = false;
        while (i < this.size && !found) {
            found = this.nodes[i] === node;
            i++;
        }
        return found;
    }
}

export default PriorityQueue;