import AVLNode from "./AVLNode";

class AVL {
    constructor() {
        this._root = null;
    }

    setRoot(root) {
        this._root = root;
    }

    getRoot() {
        return this._root;
    }

    computeHeight(node) {
        if (node === null) {
            return -1;
        } 
        const leftHeight = this.computeHeight(node.getLeftChild());
        const rightHeight = this.computeHeight(node.getRightChild());
        return this.max(leftHeight, rightHeight) + 1;
    }

    max(valueA, valueB) {
        return valueA > valueB ? valueA : valueB;
    }

    balanceFactor(node) {
        //returns the balance factor of the node. Balance factor is the difference of the heights of the children of this node
        const leftHeight = this.computeHeight(node.getLeftChild());
        const rightHeight = this.computeHeight(node.getRightChild());
        return leftHeight - rightHeight;
    } 

    insertNode(root, node) {
        if (root === null) {
            return node;
        } else {
            if (node.getValue() < root.getValue()) { //node has f-value smaller than the one of the root
                const leftChild = this.insertNode(root.getLeftChild(), node);
                root.setLeftChild(leftChild);
            } else if (node.getValue() > root.getValue()) {
                const rightChild = this.insertNode(root.getRightChild(), node);
                root.setRightChild(rightChild);
            }
        }

        root.setHeight(this.computeHeight(root)); //recompute the height of the node, cause it may changed due to the insertion of the new node

        const balanceFactor = this.balanceFactor(root);

        //inserted the node to the avl tree and now we balance the tree so as the height of the left and right child of the root, comes from
        //[-1,1]
        
        if (balanceFactor > 1) {
            if (node.getValue() < root.getLeftChild().getValue()) {
                root = this.simpleRightRotation(root);;
            } else if (node.getValue() > root.getLeftChild().getValue()) {
                root = this.doubleLeftRotation(root);
            }
        } else if (balanceFactor < -1) {
            if (node.getValue() > root.getRightChild().getValue()) {
                root = this.simpleLeftRotation(root);
            } else if (node.getValue() < root.getRightChild().getValue()) {
                root = this.doubleRightRotation(root);
            }
        }
        
        return root;
    }

    ///////////////////////////////////
    //          A           B        //
    //         B    ===>   C A       //
    //        C                      //  
    ///////////////////////////////////
    simpleRightRotation(node) {
        const temp = node.getLeftChild();
        node.setLeftChild(temp.getRightChild());
        temp.setRightChild(node);
        return temp;
    }

    ///////////////////////////////////
    //       A             B         //
    //        B    ===>   A C        //
    //         C                     //  
    ///////////////////////////////////
    simpleLeftRotation(node) {
        const temp = node.getRightChild();
        node.setRightChild(temp.getLeftChild());
        temp.setLeftChild(node);
        return temp;
    }


    ///////////////////////////////////
    //   A           A          B    //
    //     c  ===>    B   ==>  A C   //
    //    B            C             //  
    ///////////////////////////////////
    doubleRightRotation(node) {
        const rightChild = this.simpleRightRotation(node.getRightChild());
        node.setRightChild(rightChild);
        const temp = this.simpleLeftRotation(node);
        return temp;
    }

    ///////////////////////////////////
    //    C          C          B    //
    //  A   ===>    B   ==>    A C   //
    //   B         A                 //  
    ///////////////////////////////////
    doubleLeftRotation(node) {
        const leftChild = this.simpleLeftRotation(node.getLeftChild());
        node.setLeftChild(leftChild);
        const temp = this.simpleRightRotation(node);
        return temp;
    }

    find(root, node) {
        if (root === null) {
            return false;
        } else {
            if (root === node) {
                return true;
            } else if (node.getValue()< root.getValue()) {
                return this.find(root.getLeftChild(), node);
            } else {
                return this.find(root.getRightChild(), node);
            }
        }
    }

    getNodes(node) {
        if (node === null) return;
        let nodes = [node];
        let leftNodes, rightNodes;
        
        if (node.getLeftChild() !== null) {
            leftNodes = this.getNodes(node.getLeftChild());
            nodes = nodes.concat(leftNodes);
        }

        if (node.getRightChild() !== null) {
            rightNodes = this.getNodes(node.getRightChild());
            nodes = nodes.concat(rightNodes);
        }

        return nodes;
    }

    printTree(node) {
        if (node === null) {
            console.log("brhka keno, paw panw");
        } else {
            console.log("paw aristera");
            this.printTree(node.getLeftChild());
            console.log(node.getValue());
            console.log("paw deksia");
            this.printTree(node.getRightChild());
            console.log("paw panw");
        }
    } 
}

export default AVL;