import Node from "./Node";

class AVLNode extends Node {
    constructor(row, column, status) {
        super(row, column, status);
        this._height = 0;
        this._leftChild = null;
        this._rightChild = null;
        this._value = this._row * 100 + this._column;
    }

    reset(row, column, status) {
        
    }

    setHeight(height) {
        this._height = height;
    }
    
    setLeftChild(node) {
        this._leftChild = node;
    }

    setRightChild(node) {
        this._rightChild = node;
    }

    getHeight() {
        return this._height;
    }

    getLeftChild() {
        return this._leftChild;
    }

    getRightChild() {
        return this._rightChild;
    }

    getValue() {
        return this._value;
    }
}

export default AVLNode;