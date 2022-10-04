class BarNode {
    constructor(value, index) {
        this._value = value;
        this._index = index;
        this._status = "unchecked";
    }
    
    getValue() {
        return this._value;
    }

    getIndex() {
        return this._index;
    }

    setValue(value) {
        this._value = value;
    }

    setIndex(index) {
        this._index = index;
    }
}

export default BarNode;