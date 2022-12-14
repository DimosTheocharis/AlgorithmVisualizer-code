import React, { useState, useContext, useRef } from 'react';
import SortingTemplate from '../../Templates/SortingTemplate/SortingTemplate';
import BarNode from '../../Data Structures/BarNode';
import { AppContext } from '../../App';

function MergeSort() {
    const { algorithmState, animationDuration, sleep } = useContext(AppContext);
    const [board, setBoard] = useState([]); //saves the bars as objects
    const [messages, setMessages] = useState(["No message yet."]); //the messages that the algorithm will display at the panel
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

    const performBoardChanges = (changes) => {
        const newBoard = [...board];
        changes.forEach(change => {
            newBoard[change.index].setStatus(change.status);
            newBoard[change.index].setValue(change.value);
        })
        setBoard(newBoard);
    }

    const pushIndexes = (arrayMessages, i, j) => {
        //arrayMessages: an array like this ["Left sub-array: [a,b,c]", ["Right sub-array: [d,e,f]"]]
        //returned value: the same array but each string has been concatenated with a string like this "i: ${i}"
        //this function takes a frequently used immutable array of messages and concatenates each message with a mutable string
        
        arrayMessages[0] += ` i:${i}`;
        arrayMessages[1] += ` j:${j}`;
        return arrayMessages;
    }

    const stringify = (array) => {
        //creates a formatted string as "[a,b,c,...]" where a,b,c,... are items of the given array
        let result, i;
        result = `[${array[0].toString()}`;
        for (i = 1; i < array.length; i++) {
            result += ', ';
            result += array[i].toString();
        }
        result += ']';
        return result;
    }
    

    const mergeSortAlgorithm = async (array, left, right) => {
        //array will be an array of heights with which the algorithm will work. All the swaps will happend at this array and the function performBoardChanges
        //will undertake the matching with the actual board with bars. 
        //left and right are variables that hold the indexes of the start and end of the sub-array at the actual board
        //ie if left = 2 and right = 5 then we are proccessing the [2,5] sub-array of the actual board
        let changes, resolvedValue;
        if (right > left) {
            let i,j,k,mid,leftArray,rightArray,leftArrayString,rightArrayString,arrayMessages;
            mid = Math.floor((left + right) / 2);

            //visibility
            changes = [];
            for (i = left; i <= right; i++) {
                changes.push({"index": i, "status": "examining", "value": board[i].getValue()});
            }
            performBoardChanges(changes);
            setMessages([`Current sub-board: [${board[left].getValue()}...${board[right].getValue()}].`]);
            resolvedValue = await sleep(animationDuration);
            changes = [];
            for (i = left; i <= right; i++) {
                changes.push({"index": i, "status": "unexamined", "value": board[i].getValue()});
            }
            performBoardChanges(changes);
            setMessages(["Merging down."]);
            resolvedValue = await sleep(animationDuration / 2);

            //algorithm
            leftArray = []; //creating the half left sub-array
            for (i = left; i <= mid; i++) {
                leftArray.push(board[i].getValue());
            }

            rightArray = []; //creating the half right sub-array
            for (j = mid + 1; j <= right; j++) {
                rightArray.push(board[j].getValue());
            }

            if (algorithmState.current === "finished") {
                handleSortingTermination();
                return 0;
            }

            leftArray = await mergeSortAlgorithm(leftArray, left, mid);
            rightArray = await mergeSortAlgorithm(rightArray, mid + 1, right);

            leftArrayString = stringify(leftArray); //get the items of leftArray in a string like "[a,b,c]"
            rightArrayString = stringify(rightArray); //get the items of rightArray in a string like "[a,b,c]"

            //merging up
            i = 0; //the index of the left sub-array
            j = 0; //the index of the right sub-array
            k = 0; //the index of the main sub-array

            //the messages that represent arrays will be displayed frequently, at the entire proccess of merging up so i save it to a variable
            arrayMessages = [
                `Left sub-array: ${leftArrayString}.`,
                `Right sub-array: ${rightArrayString}.`,
            ]

            //putting items from the 2 sub-arrays to the main array at ascending order
            while (i < leftArray.length && j < rightArray.length) {
                if (algorithmState.current === "finished") {
                    handleSortingTermination();
                    return 0;
                }
                //leftArray[i] --> board[left + i]
                //rightArray[j] --> board[mid + 1 + j]

                setMessages([
                    ...pushIndexes([...arrayMessages], i, j),
                    `Examining ${leftArray[i]} and ${rightArray[j]}`
                ]);
                resolvedValue = await sleep(animationDuration);
                           
                if (leftArray[i] <= rightArray[j]) {
                    setMessages([
                        ...pushIndexes([...arrayMessages], i, j),
                        `${leftArray[i]} <= ${rightArray[j]}.`,
                        `Putting ${leftArray[i]} at index ${left + k}.`
                    ]);
                    resolvedValue = await sleep(animationDuration);
                    
                    changes = [];
                    changes.push({"index": left + k, "status": "placed", "value": leftArray[i]});
                    performBoardChanges(changes);
                    setMessages([
                        ...pushIndexes([...arrayMessages], i, j),
                        `${leftArray[i]} <= ${rightArray[j]}.`,
                        "Done."
                    ]);
                    resolvedValue = await sleep(animationDuration);

                    array[k] = leftArray[i];
                    i += 1;

                    setMessages([
                        ...pushIndexes([...arrayMessages], i, j),
                        "Set i += 1."
                    ])
                    resolvedValue = await sleep(animationDuration);
                } else {
                    setMessages([
                        ...pushIndexes([...arrayMessages], i, j),
                        `${leftArray[i]} > ${rightArray[j]}.`,
                        `Putting ${rightArray[j]} at index ${left + k}.`
                    ]);
                    resolvedValue = await sleep(animationDuration);
                    
                    changes = [];
                    changes.push({"index": left + k, "status": "placed", "value": rightArray[j]});
                    performBoardChanges(changes);
                    setMessages([
                        ...pushIndexes([...arrayMessages], i, j),
                        `${leftArray[i]} > ${rightArray[j]}.`,
                        "Done"
                    ]);
                    resolvedValue = await sleep(animationDuration);

                    array[k] = rightArray[j];
                    j += 1;

                    setMessages([
                        ...pushIndexes([...arrayMessages], i, j),
                        "Set j += 1."
                    ])
                    resolvedValue = await sleep(animationDuration);
                }
                k += 1;
            }

            while (i < leftArray.length) {
                setMessages([
                    ...pushIndexes([...arrayMessages], i, j),
                    `Putting ${leftArray[i]} at index ${left + k}.`
                ]);
                resolvedValue = await sleep(animationDuration);
                
                changes = [];
                changes.push({"index": left + k, "status": "placed", "value": leftArray[i]});
                performBoardChanges(changes);
                setMessages([
                    ...pushIndexes([...arrayMessages], i, j),
                    "Done."
                ]);
                resolvedValue = await sleep(animationDuration);


                array[k] = leftArray[i];
                i += 1;
                k += 1; 
            }

            while (j < rightArray.length) {
                setMessages([
                    ...pushIndexes([...arrayMessages], i, j),
                    `Putting ${rightArray[j]} at index ${left + k}.`
                ]);
                resolvedValue = await sleep(animationDuration);
                
                changes = [];
                changes.push({"index": mid + 1 + j, "status": "placed", "value": rightArray[j]});
                performBoardChanges(changes);
                setMessages([
                    ...pushIndexes([...arrayMessages], i, j),
                    "Done"
                ]);
                resolvedValue = await sleep(animationDuration);

                array[k] = rightArray[j];
                j += 1;
                k += 1;
            }

            setMessages([`Sub-board: [${board[left].getValue()}...${board[right].getValue()}] is sorted.`]);
            resolvedValue = await sleep(animationDuration);

        } else if (right === left) {
            //sub-board has only one element.
            changes = [];
            changes.push({"index": left, "status": "examining", "value": board[left].getValue()});
            performBoardChanges(changes);
            setMessages([`Current sub-board: [${board[left].getValue()}].`]);
            resolvedValue = await sleep(animationDuration);
            changes = [];
            changes.push({"index": left, "status": "unexamined", "value": board[left].getValue()});
            performBoardChanges(changes);
            setMessages(["Merging up."]);
            resolvedValue = await sleep(animationDuration / 2);
        }

        //at the end of the process, prepare the sub-board for the next recursive call, by setting the status of all bars as 'unexamined'
        let i;
        if (array.length !== board.length) {
            changes = [];
            for (i = left; i <= right; i++) {
                changes.push({"index": i, "status": "unexamined", "value": board[i].getValue()});
            }
            performBoardChanges(changes);
            resolvedValue = await sleep(animationDuration);
        } else {
            //call functions to handle the end of the first call of the recursive function
            setMessages(["Board is sorted."]);
            handleSortingTermination();
        }
        return array;
    }

    return (
        <SortingTemplate
            algorithm={() => {mergeSortAlgorithm(extractHeights(board), 0, board.length - 1)}}
            algorithmState={algorithmState}
            board={board}
            isDisabled={isDisabled}
            messages={messages}
            setBoard={setBoard}
            setIsDisabled={setIsDisabled}
        />
    )
}

export default MergeSort;