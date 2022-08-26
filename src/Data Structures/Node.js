class Node {
    constructor(row, column, status) {
        this.reset(row, column, status);
    }

    reset(row, column, status) {
        this._row = row;
        this._column = column;
        this._status = status; //unblocked, blocked, source, destination etc
        this._parent = null;
    }

    setRow(row) {
        this._row = row;
    }

    setColumn(column) {
        this._column = column;
    }

    setStatus(status) {
        this._status = status;
    }

    setParent(node) {
        this._parent = node;
    }

    getRow() {
        return this._row;
    }

    getColumn() {
        return this._column;
    }

    getStatus() {
        return this._status;
    }

    getParent() {
        return this._parent;
    }

}

export default Node;