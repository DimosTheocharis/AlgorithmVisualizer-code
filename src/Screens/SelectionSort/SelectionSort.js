import React, { useState, useContext, useEffect, useRef } from 'react';
import SortingTemplate from '../../Templates/SortingTemplate/SortingTemplate';
import BarNode from '../../Data Structures/BarNode';
import { AppContext } from '../../App';


function SelectionSort() {
    const { algorithmState, animationDuration, pause, sleep } = useContext(AppContext);
    const [board, setBoard] = useState(null); //saves the bars as objects
    const [savedBoards, setSavedBoards] = useState(false);
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
    //unbegan if it has not started yet
    //pending if algorithm is currently running
    //finished if either algorithm either has normally ended, or manually stopped
    
    useEffect(() => {
        //load saved boards
        const boards = loadSavedBoards();
        setSavedBoards(boards);

        //create a default board
        const customHeights = [120,70,90,50]; //70,120,80,50,60,50,70,50,200
        createBoard(customHeights);
        
    },[])
    
    
    const createBoard = (heights) => {
        //takes an array of integers as parameter and creates the board with a bar for each height
        const newBoard = [];
        heights.forEach((height, index) => {
            newBoard.push(
                new BarNode(height, index)
            );
        })
        setBoard(newBoard);
    }

    const handleSortingTermination = () => {
        //this function is called when the algorithm ends or is stopped by the user
        algorithmState.current = "finished";
        setIsDisabled(prev => {
            return {...prev, "loadButton": false, "operationButton": true, "resetButton": false}
        })
    }

    const loadSavedBoards = () => {
        const boards = JSON.parse(localStorage.getItem("boards"));
        return boards === null ? {} : boards;
      }

    const performBoardChanges = (changes) => {
        const newBoard = [...board];
        changes.forEach(change => {
            newBoard[change.index].setStatus(change.status);
            newBoard[change.index].setValue(change.value);
        })
        setBoard(newBoard);
    }

    const SelectionSortAlgorithm = async () => {
        let i, j, changes, minIndex, resolvedValue;
        for (i = 0; i < board.length - 1 && (algorithmState.current === "pending" || algorithmState.current === "paused"); i++) {
            minIndex = i;
            changes = [];
            changes.push({"index": i, "status": "minimum", "value": board[i].getValue()});
            setMessages([`Current minimum is ${board[minIndex].getValue()}.`]);
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration);

            for (j = i + 1; j < board.length && (algorithmState.current === "pending" || algorithmState.current === "paused"); j++) {
                if (algorithmState.current === "paused") {
                    resolvedValue = await pause();
                    //User clicked pause button and then reset button
                    if (algorithmState.current === "unbegun") {
                        return;
                    }
                }

                if (algorithmState.current === "finished") {
                    handleSortingTermination();
                    return 0;
                }


                changes = [];
                changes.push({"index": j, "status": "examining", "value": board[j].getValue()});
                setMessages([`Examining ${board[j].getValue()}.`]);
                performBoardChanges(changes);
                resolvedValue = await sleep(animationDuration);
                if (board[minIndex].getValue() > board[j].getValue()) {
                    changes = [];
                    changes.push({"index": j, "status": "minimum", "value": board[j].getValue()});
                    changes.push({"index": minIndex, "status": "unexamined", "value": board[minIndex].getValue()});
                    setMessages([`${board[minIndex].getValue()} > ${board[j].getValue()}. New minimum: ${board[j].getValue()}.`]);
                    performBoardChanges(changes);
                    resolvedValue = await sleep(animationDuration);
                    minIndex = j;
                } else {
                    changes = [];
                    changes.push({"index": j, "status": "unexamined", "value": board[j].getValue()});
                    performBoardChanges(changes);
                    resolvedValue = await sleep(animationDuration);
                }

                if (algorithmState.current === "finished") {
                    handleSortingTermination();
                    return 0;
                }
            }
            changes = [];
            changes.push({"index": i, "status": "prePlaced", "value": board[i].getValue()});
            setMessages([`The minimum bar (${board[minIndex].getValue()}) will swap with ${board[i].getValue()}.`]);
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration > 1000 ? animationDuration : 1000); //provides better visibility cause user can see for more time the final swap that puts one bar to the correct spot 
            //swap the current minimum bar with the bar at the index i
            changes = [];
            changes.push({"index": minIndex, "status": "unexamined", "value": board[i].getValue()});
            changes.push({"index": i, "status": "placed", "value": board[minIndex].getValue()});
            performBoardChanges(changes);
            setMessages([`Swap the bars. ${board[i].getValue()} is at the correct spot.`]);
            resolvedValue = await sleep(animationDuration);

        }

        //set the right-most bar of the board as placed. It is already at the correct spot
        changes = [];
        changes.push({"index": i, "status": "placed", "value": board[i].getValue()});
        setMessages([`${board[i].getValue()} is at the correct spot.`]);
        performBoardChanges(changes);
        resolvedValue = await sleep(animationDuration);
        handleSortingTermination();
    }

    return (
        <SortingTemplate
            algorithm={SelectionSortAlgorithm}
            algorithmState={algorithmState}
            board={board}
            createBoard={createBoard}
            isDisabled={isDisabled}
            messages={messages}
            savedBoards={savedBoards}
            setBoard={setBoard}
            setIsDisabled={setIsDisabled}
            setSavedBoards={setSavedBoards}
        />
    )
}

export default SelectionSort;