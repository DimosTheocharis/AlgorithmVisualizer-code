import Node from "./Node";

class AsteriskPathFinding extends Node {
    constructor(row, column, status) {
        super(row, column, status);
        this._valueG = 10 ** 6; //distance of this node from the source
        this._valueH = 10 ** 6; //estimated distance of this node from the destination
        this._valueF = this._valueG + this._valueH;
        this._height = 0;
        this._leftChild = null;
        this._rightChild = null;
        this._value = this._row * 100 + this._column;
    }
}

export default AsteriskPathFinding;