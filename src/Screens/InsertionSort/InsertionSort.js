import React, { useState, useContext, useEffect, useRef } from 'react';
import SortingTemplate from '../../Templates/SortingTemplate/SortingTemplate';
import BarNode from '../../Data Structures/BarNode';
import { AppContext } from '../../App';


function InsertionSort() {
    const { animationDuration, sleep } = useContext(AppContext);
    const [board, setBoard] = useState(null); //saves the bars as objects
    const [savedBoards, setSavedBoards] = useState(false);
    let algorithmState = useRef("unbegun"); //a mutable value that tells the holds the state of the algorithm. 
    //unbegan if it has not started yet
    //pending if algorithm is currently running
    //finished if either algorithm either has normally ended, or manually stopped
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

    const insertionSortAlgorithm = async () => {
        let i,j,temp,changes,resolvedValue;
        for (i = 1; i < board.length; i++) {
            temp = board[i].getValue();
            j = i - 1;
            changes = [];
            changes.push({"index": i, "status": "prePlaced", "value": board[i].getValue()});
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration);
            while (j >= 0 && board[j].getValue() > temp) {
                //highlight the bar whose value is  greater than temp's value
                changes = [];
                changes.push({"index": j, "status": "examining", "value": board[j].getValue()});
                performBoardChanges(changes);
                resolvedValue = await sleep(animationDuration);
                //highlight the bar at index j + 1 which will gonna copy the bar at index j
                changes = [];
                changes.push({"index": j + 1, "status": "copied", "value": board[j + 1].getValue()});
                performBoardChanges(changes);
                resolvedValue = await sleep(animationDuration);
                //perform the change and set the bars as unexamined
                changes = [];
                changes.push({"index": j, "status": "unexamined", "value": board[j].getValue()});
                changes.push({"index": j + 1, "status": "unexamined", "value": board[j].getValue()});
                performBoardChanges(changes);
                resolvedValue = await sleep(animationDuration);
                j -= 1;

                if (algorithmState.current === "finished") {
                    handleSortingTermination();
                    return 0;
                }
            }
            //highlight the bar after the bar whose value is smaller than temp's value
            changes = [];
            changes.push({"index": j + 1, "status": "minimum", "value": board[j + 1].getValue()});
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration);
            changes = [];
            changes.push({"index": j + 1, "status": "unexamined", "value": temp});
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration);
        }
        handleSortingTermination();
    }

    return (
        <SortingTemplate
            algorithm={insertionSortAlgorithm}
            algorithmState={algorithmState}
            board={board}
            createBoard={createBoard}
            isDisabled={isDisabled}
            savedBoards={savedBoards}
            setBoard={setBoard}
            setIsDisabled={setIsDisabled}
            setSavedBoards={setSavedBoards}
        />
    )
}

export default InsertionSort;