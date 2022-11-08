import React, { useState, useContext } from 'react';
import SortingTemplate from '../../Templates/SortingTemplate/SortingTemplate';
import BarNode from '../../Data Structures/BarNode';
import { AppContext } from '../../App';


function BubbleSort() {
    const { algorithmState, animationDuration, pause, sleep } = useContext(AppContext);
    const [board, setBoard] = useState([]); //saves the bars as objects
    const [messages, setMessages] = useState(["No message yet."]); //the message that the algorithm will display at the panel
    const [isDisabled, setIsDisabled] = useState({ //whether or not some buttons are disabled 
        "clearButton": false,
        "editButton": false,
        "loadButton": false,
        "operationButton": false,
        "resetButton": true,
        "saveButton": false,
        "shuffleButton": false,
        "slider": false    
    })

    const handleSortingTermination = () => {
        //this function is called when the algorithm ends or is stopped by the user
        algorithmState.current = "finished";
        setIsDisabled(prev => {
            return {...prev, "loadButton": false, "operationButton": true, "resetButton": false}
        })
    }

    const performBoardChanges = (changes) => {
        const newBoard = [...board];
        changes.forEach(change => {
            newBoard[change.index].setStatus(change.status);
            newBoard[change.index].setValue(change.value);
        })
        setBoard(newBoard);
    }

    const BubbleSortAlgorithm = async () => {
        let i,j, resolvedValue, changes;
        let stop = false;
        for (i = 1; i < board.length && !stop; i++) {
            stop = true;
            for (j = board.length - 1; j >= i && (algorithmState.current === "pending" || algorithmState.current === "paused"); j--) {
                if (algorithmState.current === "paused") {
                    resolvedValue = await pause();
                    //User clicked pause button and then reset button
                    if (algorithmState.current === "unbegun") {
                        return 0;
                    }
                }

                if (algorithmState.current === "finished") {
                    handleSortingTermination();
                    return 0;
                }

                changes = [];
                changes.push({"index": j, "status": "examining", "value": board[j].getValue()});
                changes.push({"index": j-1, "status": "examining", "value": board[j-1].getValue()});
                setMessages([`Examining values ${board[j-1].getValue()} and ${board[j].getValue()}.`]);
                performBoardChanges(changes);
                resolvedValue = await sleep(animationDuration);

                changes = [];
                if (board[j].getValue() < board[j-1].getValue()) {
                    //if items at j and j-1 indexes are at wrong places, then swap them and set their status as unexamined
                    stop = false;
                    changes.push({"index": j, "status": "unexamined", "value": board[j-1].getValue()});
                    changes.push({"index": j-1, "status": "unexamined", "value": board[j].getValue()});
                    setMessages([`${board[j-1].getValue()} > ${board[j].getValue()}. Swap!`]);
                    performBoardChanges(changes);
                    resolvedValue = await sleep(animationDuration);
                } else {
                    //if items at j and j-1 indexes are at correct places, just set their status as unexamined
                    changes.push({"index": j, "status": "unexamined", "value": board[j].getValue()});
                    changes.push({"index": j-1, "status": "unexamined", "value": board[j-1].getValue()});
                    setMessages([`${board[j-1].getValue()} < ${board[j].getValue()}. Don't change their position.`]);
                    performBoardChanges(changes);
                    resolvedValue = await sleep(animationDuration);
                }
            }
            changes = [];
            changes.push({"index": i-1, "status": "placed", "value": board[i-1].getValue()});
            setMessages([`${board[i-1].getValue()} is at the correct spot!`]);
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration);
        }
        //if bubbleSort ends sooner than expected, ie it determined that bars are already sorted, then the algorithm will let at the right
        //side of the board some bars with status "examining" even though they are already placed. For that reason, set them placed.
        changes = [];
        while (i <= board.length) {
            changes.push({"index": i-1, "status": "placed", "value": board[i-1].getValue()});
            i += 1;
        }
        performBoardChanges(changes);
        resolvedValue = await sleep(animationDuration);
        handleSortingTermination();
    }

    return (
        <SortingTemplate
            algorithm={BubbleSortAlgorithm}
            algorithmState={algorithmState}
            board={board}
            isDisabled={isDisabled}
            messages={messages}
            setBoard={setBoard}
            setIsDisabled={setIsDisabled}
        />
    )
}

export default BubbleSort;