class BarNode {
    constructor(value, index) {
        this._value = value;
        this._index = index;
        this._status = "unexamined";
    }
    
    getValue() {
        return this._value;
    }

    getIndex() {
        return this._index;
    }

    getStatus() {
        return this._status;
    }

    setValue(value) {
        this._value = value;
    }

    setIndex(index) {
        this._index = index;
    }

    setStatus(status) {
        this._status = status;
    }
}

export default BarNode;