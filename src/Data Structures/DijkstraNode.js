import Node from "./Node";

class DijkstraNode extends Node {
    constructor(row, column, status) {
        super(row, column, status);
        this._valueD = 10 ** 6; //the estimated distance. It is true that this._valueD is always bigger than the true weight of the path from the source to the node
    }   

    setValueD(valueD) {
        this._valueD = valueD;
    }

    getValueD() {
        return this._valueD;
    }
}

export default DijkstraNode;