import Node from "./Node";

class AsteriskPathFinding extends Node {
    constructor(row, column, status) {
        super(row, column, status);
        this.reset(row, column, status);
    }

    reset(row, column, status) {
        super.reset(row, column, status);
        this._valueG = 10 ** 6; //distance of this node from the source
        this._valueH = 10 ** 6; //estimated distance of this node from the destination
        this._valueF = this._valueG + this._valueH;
        this._height = 0;
        this._leftChild = null;
        this._rightChild = null;
        this._value = this._row * 100 + this._column;
    }

    setValueG(valueG) {
        this._valueG = valueG;
    }

    setValueH(valueH) {
        this._valueH = valueH;
    }

    setValueF(valueF) {
        this._valueF = valueF;
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

    getValueG() {
        return this._valueG;
    }

    getValueH() {
        return this._valueH;
    }

    getValueF() {
        return this._valueF;
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

export default AsteriskPathFinding;