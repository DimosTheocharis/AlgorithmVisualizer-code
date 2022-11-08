import React, { useState, useContext } from 'react';
import SortingTemplate from '../../Templates/SortingTemplate/SortingTemplate';
import BarNode from '../../Data Structures/BarNode';
import { AppContext } from '../../App';


function InsertionSort() {
    const { algorithmState, animationDuration, pause, sleep } = useContext(AppContext);
    const [board, setBoard] = useState([]); //saves the bars as objects
    const [messages, setMessages] = useState(["No message yet."]);
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
    //unbegan if it has not started yet
    //pending if algorithm is currently running
    //finished if either algorithm either has normally ended, or manually stopped

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

    const insertionSortAlgorithm = async () => {
        let i,j,key,changes,resolvedValue;
        for (i = 1; i < board.length; i++) {
            key = board[i].getValue();
            j = i - 1;
            changes = [];
            changes.push({"index": i, "status": "prePlaced", "value": board[i].getValue()});
            setMessages([`Current key is ${key}.`]);
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration);
            while (j >= 0 && board[j].getValue() > key) {
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

                
                //highlight the bar whose value is greater than key's value
                changes = [];
                changes.push({"index": j, "status": "examining", "value": board[j].getValue()});
                setMessages([
                    `Current key is ${key}.`,
                    `Examining ${board[j].getValue()}.`,
                    `${board[j].getValue()} > ${key}.`
                ]);
                performBoardChanges(changes);
                resolvedValue = await sleep(animationDuration);
                //highlight the bar at index j + 1 which will gonna copy the bar at index j
                changes = [];
                changes.push({"index": j + 1, "status": "copied", "value": board[j + 1].getValue()});
                setMessages([
                    `Current key is ${key}.`,
                    `${board[j].getValue()} will move to the right.`
                ]);
                performBoardChanges(changes);
                resolvedValue = await sleep(animationDuration);
                //perform the change and set the bars as unexamined
                changes = [];
                changes.push({"index": j, "status": "unexamined", "value": board[j].getValue()});
                changes.push({"index": j + 1, "status": "unexamined", "value": board[j].getValue()});
                setMessages([
                    `Current key is ${key}.`,
                    `Moved.`
                ]);
                performBoardChanges(changes);
                resolvedValue = await sleep(animationDuration);
                j -= 1;

            }
            //highlight the bar after the bar whose value is smaller than key's value
            changes = [];
            changes.push({"index": j + 1, "status": "minimum", "value": board[j + 1].getValue()});
            setMessages([
                `Current key is ${key}.`,
                j >= 0 ? `${board[j].getValue()} < ${key}.` : '',
                `${key} will take place of ${board[j+1].getValue()}.`
            ]);
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration);
            changes = [];
            changes.push({"index": j + 1, "status": "unexamined", "value": key});
            setMessages(["Done."]);
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration);
            changes = [];
            for (j = 0; j <= i; j++) {
                changes.push({"index": j, "status": "placed", "value": board[j].getValue()});
            }
            setMessages([`Sub-board from ${board[0].getValue()} to ${board[i].getValue()} is sorted.`]);
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration);

            changes = [];
            for (j = 0; j <= i; j++) {
                changes.push({"index": j, "status": "unexamined", "value": board[j].getValue()});
            }
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration / 2);
        }
        changes = [];
        for (j = 0; j < i; j++) {
            changes.push({"index": j, "status": "placed", "value": board[j].getValue()});
        }
        setMessages(["Board is sorted."]);
        performBoardChanges(changes);
        resolvedValue = await sleep(animationDuration);
        handleSortingTermination();
    }

    return (
        <SortingTemplate
            algorithm={insertionSortAlgorithm}
            algorithmState={algorithmState}
            board={board}
            isDisabled={isDisabled}
            messages={messages}
            setBoard={setBoard}
            setIsDisabled={setIsDisabled}
        />
    )
}

export default InsertionSort;