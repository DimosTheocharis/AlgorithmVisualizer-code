import React, { useState, useContext } from 'react';
import SortingTemplate from '../../Templates/SortingTemplate/SortingTemplate';
import BarNode from '../../Data Structures/BarNode';
import { AppContext } from '../../App';


function QuickSort() {
    const { algorithmState, animationDuration, pause, sleep } = useContext(AppContext);
    const [board, setBoard] = useState([]); //saves the bars as objects
    const [messages, setMessages] = useState(["No message yet."]);
    const [isDisabled, setIsDisabled] = useState({ //whether or not some buttons are disabled 
        "clearButton": false,
        "editButton": false,
        "loadButton": false,
        "operationButton": false,
        "pauseButton": true,
        "resetButton": true,
        "saveButton": false,
        "shuffleButton": false,
        "slider": false    
    })
    

    const extractHeights = (board) => {
        //this function creates and return an array of the heights of the bars. The result is saved at the variable barHeights
        const heights = [];
        let i;
        for (i = 0; i < board.length; i++) {
            heights.push(board[i].getValue());
        }
        return heights;
    }

    const handleSortingTermination = () => {
        //this function is called when the algorithm ends or is stopped by the user
        algorithmState.current = "finished";
        setIsDisabled(prev => {
            return {...prev, "loadButton": false, "operationButton": true, "resetButton": false}
        })
    }

    const partition = async (array, low, high) => {
        const pivot = array[high]; //the bar that will be placed at the correct position in the sorted array
        let i = low - 1; //the index of the rightmost bar that its value is smaller than pivots value
        let j, changes, pivotMessage, resolvedValue, temp;
        pivotMessage = `Current pivot: ${pivot}.`;
        changes = [];
        changes.push({"index": high, "status": "prePlaced", "value": board[high].getValue()});
        setMessages([pivotMessage]);
        performBoardChanges(changes);
        resolvedValue = await sleep(animationDuration);
        for (j = low; j < high && (algorithmState.current === "pending" || algorithmState.current === "paused"); j++) {
            //check the state of the algorithm
            if (algorithmState.current === "paused") {
                resolvedValue = await pause();
                //user clicked pause button and then reset button.
                if (!(algorithmState.current === "pending" || algorithmState.current === "paused")) return;
            }

            changes = [];
            changes.push({"index": j, "status": "examining", "value": board[j].getValue()});
            setMessages([
                pivotMessage + ` i= ${i}.`,
                `Examining ${board[j].getValue()}.`,
            ]);
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration);

            if (array[j] < pivot) {
                //each time a smaller bar than pivot is found, we want to move this smaller bar to the left of the pivot, at the leftmost position ie at position i 
                i += 1;
                setMessages([
                    pivotMessage + ` i=${i}.`,
                    `${array[j]} < pivot. Swap ${array[i]} and ${array[j]}.`
                ])
                resolvedValue = await sleep(animationDuration);

                temp = array[i];
                array[i] = array[j];
                array[j] = temp;
                changes = [];
                changes.push({"index": i, "status": "unexamined", "value": board[j].getValue()});
                changes.push({"index": j, "status": "unexamined", "value": board[i].getValue()});
                performBoardChanges(changes);
                setMessages([
                    pivotMessage + ` i= ${i}.`,
                    `Done.`
                ]);
                resolvedValue = await sleep(animationDuration);
            } else {
                setMessages([
                    pivotMessage + ` i= ${i}.`,
                    `${array[j]} > pivot. Continue.`
                ]);
                resolvedValue = await sleep(animationDuration);
            }

            changes = [];
            changes.push({"index": j, "status": "unexamined", "value": board[j].getValue()});
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration / 2);
        }

        //swap pivot with the bar at the right of the rightmost bar that its value is smaller than pivots ie i + 1
        //i stopped at the index from where and at the left there are bars with smaller value than pivots value
        i += 1;
        setMessages([
            pivotMessage + ` i= ${i}.`,
            `Swap pivot with ${board[i].getValue()}.`
        ])
        resolvedValue = await sleep(animationDuration);

        temp = array[high];
        array[high] = array[i];
        array[i] = temp;
        changes = [];
        changes.push({"index": high, "status": "unexamined", "value": board[i].getValue()});
        changes.push({"index": i, "status": "placed", "value": board[high].getValue()});
        performBoardChanges(changes);
        setMessages([
            pivotMessage,
            `Done. ${pivot} is now in correct position.`
        ]);
        resolvedValue = await sleep(animationDuration);

        return i;
    }

    const performBoardChanges = (changes) => {
        const newBoard = [...board];
        changes.forEach(change => {
            newBoard[change.index].setStatus(change.status);
            newBoard[change.index].setValue(change.value);
        })
        setBoard(newBoard);
    }

    const quickSortAlgorithm = async (array, low, high) => {
        let resolvedValue;
        if (!(algorithmState.current === "pending" || algorithmState.current === "paused")) return;
        if (low < high) {
            const pi = await partition(array, low, high); //the index of the bar that got placed at the correct position in the sorted board
            if (!(algorithmState.current === "pending" || algorithmState.current === "paused"));
            
            await quickSortAlgorithm(array, low, pi - 1);
            await quickSortAlgorithm(array, pi + 1, high);
        } else if (low === high) {
            //there is only on bar to be put at the correct place. Obviously, it's already at the correct position.
            let changes = [], resolvedValue;
            changes.push({"index": low, "status": "placed", "value": board[low].getValue()});
            performBoardChanges(changes);
            setMessages([`${board[low].getValue()} is already at the correct position.`]);
            resolvedValue = await sleep(animationDuration);
        }
    }

    //this is function that will be called when operation button gets clicked. It calls quikSortAlgorithm and handle the end of it
    const finalAlgorithm = async () => {  
        let resolvedValue, abnormalCompletion, normalCompletion;
        await quickSortAlgorithm(extractHeights(board), 0, board.length - 1);  
        //if algorithm got paused and then reset button got clicked then algorithm didn't finish normally.
        //reset button is already clicked, so operation button can be clicked to start the algorithm again. We don't want to set operation button
        //as disabled at the handleSortingTermination().
        normalCompletion = algorithmState.current === "pending";
        if (normalCompletion) {
            setMessages(["Board is sorted."]);
            resolvedValue = await sleep(animationDuration);
            handleSortingTermination();
        } else {
            if (algorithmState.current === "finished") {
                handleSortingTermination();
            }
            setMessages(["Click Start button to run again."]);
        }
    }

    return (
        <SortingTemplate
            algorithm={async () => {finalAlgorithm()}}
            algorithmState={algorithmState}
            board={board}
            isDisabled={isDisabled}
            messages={messages}
            setBoard={setBoard}
            setIsDisabled={setIsDisabled}
        />
    )
}

export default QuickSort;
