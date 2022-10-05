import React, { useState, useEffect, useContext } from 'react';
import Bar from '../../Components/Bar/Bar';
import Slider from '../../Components/Slider/Slider';
import AddBarButton from '../../Components/AddBarButton/AddBarButton';
import BarNode from '../../Data Structures/BarNode';
import { AppContext } from '../../App';
import styles from './BubbleSort.module.css';


function BubbleSort() {
    const { algorithmState, animationDuration, sleep } = useContext(AppContext);
    const [board, setBoard] = useState(null);
    const [editBoard, setEditBoard] = useState(false); //whether or not the user wants to add/delete/resize a bar

    useEffect(() => {
        const customHeights = [120,70,90,50]; //70,120,80,50,60,50,70,50,200
        const newBoard = [];
        customHeights.forEach((height, index) => {
            newBoard.push(
                new BarNode(height, index)
            );
        })
        setBoard(newBoard);
    },[])

    
    const addBar = (index) => {
        let i;
        const newBoard = [...board];
        // the height of the new bar will be the value of the previous bar (at the left) or the value of the first of index is 0
        const newHeight = index === 0 ? board[0].getValue() : board[index - 1].getValue();
        newBoard.splice(index, 0, new BarNode(newHeight, index)); //add the bar to the board
        for (i = index + 1; i < newBoard.length; i++) { //change the indexes of the bars at the right
            newBoard[i].setIndex(newBoard[i].getIndex() + 1);
        }
        setBoard(newBoard);
    }


    const determineVisibleContent = () => {
        let elements = [];
        const bars = getBars();
        if (editBoard) {
            const addButtons = getAddButtons();
            let i;
            elements.push(addButtons[0]);
            for (i = 0; i < bars.length; i++) {
                elements.push(bars[i]);
                elements.push(addButtons[i + 1]);
            }
        } else {
            elements = bars;
        }
        return elements;
    }

    const deleteBar = (index) => {
        let i;
        const newBoard = [...board];
        newBoard.splice(index, 1); //removes the item at the position: index
        for (i = index; i < newBoard.length; i++) {
            newBoard[i].setIndex(newBoard[i].getIndex() - 1);
        }
        setBoard(newBoard);
    }

    
    const getAddButtons = () => {
        //creates and returns a list with buttons that when clicked will create a vertical bar
        if (board === null) return;
        const addButtons = [];
        let i;
        for (i = 0; i < board.length + 1; i++) {
            addButtons.push(
                <AddBarButton 
                    key={(i + 1) * 100 + i}
                    index={i}
                    addBar={addBar}
                />
            )
        }
        return addButtons;
    }

    const getBars = () => {
        //creates and returns a list with the vertical bars that represent values to be sorted
        if (board === null) return;
        const bars = [];
        board.forEach(bar => {
            bars.push(
                <Bar
                    key={bar.getIndex()}
                    bar={bar}
                    deleteBar={deleteBar}
                    editBoard={editBoard}
                />
            )
        })
        return bars;
    }

    const handleOperationButton = () => {
        if (algorithmState.current === "unbegun") {
            algorithmState.current = "pending";
            BubbleSort();
        }
    }

    const performBoardChanges = (changes) => {
        const newBoard = [...board];
        changes.forEach(change => {
            newBoard[change.index].setStatus(change.status);
            newBoard[change.index].setValue(change.value);
        })
        setBoard(newBoard);
    }

    const swapBars = (indexA, indexB) => {

    }

    const toggleEditButton = () => {
        setEditBoard(prev => !prev);
    }


    const BubbleSort = async () => {
        let i,j, resolvedValue, changes;
        let stop = false;
        for (i = 1; i < board.length && !stop; i++) {
            stop = true;
            for (j = board.length - 1; j >= i; j--) {
                changes = [];
                
                changes.push({"index": j, "status": "examining", "value": board[j].getValue()});
                changes.push({"index": j-1, "status": "examining", "value": board[j-1].getValue()});
                performBoardChanges(changes);
                resolvedValue = await sleep(animationDuration);

                changes = [];
                if (board[j].getValue() < board[j-1].getValue()) {
                    //if items at j and j-1 indexes are at wrong places, then swap them and set their status as unexamined
                    stop = false;
                    changes.push({"index": j, "status": "unexamined", "value": board[j-1].getValue()});
                    changes.push({"index": j-1, "status": "unexamined", "value": board[j].getValue()});
                    performBoardChanges(changes);
                    resolvedValue = await sleep(animationDuration);
                } else {
                    //if items at j and j-1 indexes are at correct places, just set their status as unexamined
                    changes.push({"index": j, "status": "unexamined", "value": board[j].getValue()});
                    changes.push({"index": j-1, "status": "unexamined", "value": board[j-1].getValue()});
                    performBoardChanges(changes);
                    resolvedValue = await sleep(animationDuration);
                }
            }
            changes = [];
            changes.push({"index": i-1, "status": "placed", "value": board[i-1].getValue()});
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration);
        }
        changes = [];
        changes.push({"index": i-1, "status": "placed", "value": board[i-1].getValue()});
        performBoardChanges(changes);
        resolvedValue = await sleep(animationDuration);
        algorithmState.current = "finished";
    }

    //determine the color of the operator button (start/stop button) here to avoid confusion at the the render block
    const operatorButtonClassName = algorithmState.current === "pending" ? "stop" : "start";

    return (
        <div className={styles.container}>
            <section className={styles.barsContainer} style={{columnGap: `${editBoard ? 15 : 30}px`}}>
                {determineVisibleContent()}
            </section>
            <section className={styles.functionalityContainer}>
                <button 
                    className={styles.button} 
                    onClick={toggleEditButton}
                >
                    {editBoard ? "Finish" : "Edit"}
                </button>
                <button 
                    onClick={handleOperationButton} 
                    className={`${styles.button} ${(algorithmState.current === "finished" || algorithmState.current === "paused") ? `${styles.disabled}` : `${styles[operatorButtonClassName]}`}`} 
                    disabled={algorithmState.current === "finished" || algorithmState.current === "paused"}
                >
                    {algorithmState.current === "pending" ? "Stop" : "Start"}
                </button>
                <Slider/>
            </section>
        </div>
    )
}

export default BubbleSort;