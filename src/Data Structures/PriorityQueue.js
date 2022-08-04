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

    insertNode(node) {
        this.nodes.push(node); //adds the new node to the end of the heap
        let stop = false;
        let currentIndex = this.size;
        let parentIndex;
        //heapify up. The added node ascents to the right level
        while (!stop && currentIndex > 0) {
            /*
            parentIndex = parseInt((currentIndex - 1) / 2);
            if ((this.nodes[parentIndex].getValueF() <= this.nodes[currentIndex].getValueF()) ||
                (this.nodes[parentIndex].getValueF() === this.nodes[currentIndex] && this.nodes[parentIndex])) {
                stop = true;
            } else {
                this.swap(currentIndex, parentIndex);
                currentIndex = parentIndex;
            } 
            */
            ///*
            parentIndex = parseInt((currentIndex - 1) / 2);
            if ((this.nodes[currentIndex].getValueF() < this.nodes[parentIndex].getValueF()) ||
                (this.nodes[currentIndex].getValueF() === this.nodes[parentIndex].getValueF() && 
                this.nodes[currentIndex].getValueH() < this.nodes[parentIndex].getValueH())) {
                    this.swap(currentIndex, parentIndex);
                    currentIndex = parentIndex;
            } else {
                stop = true;
            } 
            //*/
        }
        this.size += 1;
    }

    minIndex(index1, index2) {
        if (this.nodes[index1].getValueF() < this.nodes[index2].getValueF()) {
            return index1;
        } else {
            return index2;
        }
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
                if (this.nodes[minIndex].getValueF() < this.nodes[currentIndex].getValueF() || (this.nodes[minIndex].getValueF() === this.nodes[currentIndex].getValueF() && this.nodes[minIndex].getValueH() < this.nodes[currentIndex].getValueH())) {
                    this.swap(currentIndex, minIndex);
                    currentIndex = minIndex;
                } else {
                    stop = true;
                }
            } 
            else if (leftChildIndex < this.size) {
                if (this.nodes[leftChildIndex].getValueF() < this.nodes[currentIndex].getValueF() || (this.nodes[leftChildIndex].getValueF() === this.nodes[currentIndex].getValueF() && this.nodes[leftChildIndex].getValueH() < this.nodes[currentIndex].getValueH())) {
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

    printNodes() {
        let i;
        for (i = 0; i < this.size; i++) {
            console.log(this.nodes[i].getValueF(), this.nodes[i].getRow(), this.nodes[i].getColumn());
        }
        console.log("---------");
    }
}

export default PriorityQueue;