import React, { useState, useEffect, useContext, useRef } from 'react';
import Bar from '../../Components/Bar/Bar';
import Slider from '../../Components/Slider/Slider';
import AddBarButton from '../../Components/AddBarButton/AddBarButton';
import Selector from '../../Components/Selector/Selector';
import Settings from '../../Components/Settings/Settings';
import BarNode from '../../Data Structures/BarNode';
import { AppContext } from '../../App';
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import styles from './BubbleSort.module.css';


function BubbleSort() {
    const { algorithmState, animationDuration, handleLoadButton, setShowSelector, showSelector, sleep } = useContext(AppContext);
    const [board, setBoard] = useState(null); //saves the bars as objects
    const [barHeights, setBarHeights] = useState(null); //saves the heights of the bars. It's used when the user wants to reset the board to the previous state
    const [editBoard, setEditBoard] = useState(false); //whether or not the user wants to add/delete/resize a bar
    const [savedBoards, setSavedBoards] = useState(false);
    const [showBoardInput, setShowBoardInput] = useState(false);
    const boardNameInputRef = useRef(null); //it is used when the arrow button is clicked, so as to get access to the name of the board the user wants to save
    const [selectedBoardName, setSelectedBoardName] = useState(""); //the name of the saved board that got selected from the selector. 
    const [showHeight, setShowHeight] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
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

    
    const addBar = (index) => {
        let i;
        const newBoard = [...board];
        //The height of the new bar will be the value of the previous bar (at the left) or the value of the first of index is 0
        //If there is no bar, then the new bar will have a default height of 50px
        const newHeight = index === 0 ? (board.length > 0 ? board[0].getValue() : 50 ): board[index - 1].getValue();
        newBoard.splice(index, 0, new BarNode(newHeight, index)); //add the bar to the board
        for (i = index + 1; i < newBoard.length; i++) { //change the indexes of the bars at the right
            newBoard[i].setIndex(newBoard[i].getIndex() + 1);
        }
        setBoard(newBoard);
    }

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


    const determineVisibleContent = () => {
        //if the user has clicked the edit button, then the bars and among them some buttons to add more bars will be displayed
        //otherwise, only the bars will be displayed
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

    const extractHeights = (board) => {
        //this function creates and return an array of the heights of the bars. The result is saved at the variable barHeights
        const heights = [];
        let i;
        for (i = 0; i < board.length; i++) {
            heights.push(board[i].getValue());
        }
        return heights;
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
                    showHeight={showHeight}
                />
            )
        })
        return bars;
    }

    const handleAlgorithmTermination = () => {
        //this function is called when the algorithm ends or is stopped by the user
        algorithmState.current = "finished";
        setIsDisabled(prev => {
            return {...prev, "loadButton": false, "operationButton": true, "resetButton": false}
        })
    }

    const handleClearButton = () => {
        //this function is called when the user clicks the button Clear. It removes all bars from the board.
        createBoard([]);
        setSelectedBoardName("");
    }

    const handleDeleteBoard = (boardName) => {
        //this function is called when the user clicks the trash-can-button of a boardName at the selector.
        //It deletes the saved board with name: boardName
        const newBoards = {...savedBoards};
        delete newBoards[boardName];
        setSavedBoards(newBoards);
        localStorage.setItem("boards", JSON.stringify(newBoards));
        setShowSelector(false);
    }

    const handleEditButton = () => {
        //This function is called when the user clickes the button Edit.
        if (editBoard) {
            setIsDisabled(prev => {
                return {...prev, "loadButton": false, "operationButton": false, "resetButton": false, "saveButton": false}
            })
        } else {
            setIsDisabled(prev => {
                return {...prev, "loadButton": true, "operationButton": true, "resetButton": true, "saveButton": true}
            })
        }
        setEditBoard(prev => !prev);
    }

    const handleOperationButton = () => {
        //this function is called when the user clickes the button Start/stop.
        if (algorithmState.current === "unbegun") {
            algorithmState.current = "pending";
            setBarHeights(extractHeights(board)); //save the present state of the board
            setIsDisabled(prev => {
                return {...prev, "clearButton": true, "editButton": true, "loadButton": true, "resetButton": true, 
                                 "saveButton": true, "shuffleButton": true, "slider": true}
            })
            BubbleSort();
        } else {
            algorithmState.current = "finished";
        }
    }

    const handleResetButton = () => {
        //resets the board to the previous state ie to the particular sequence of the bars before the start button got clicked
        algorithmState.current = "unbegun";
        createBoard(barHeights);
        setIsDisabled({"editButton": false, "operationButton": false, "resetButton": true, "saveButton": false, 
                       "shuffleButton": false, "slider": false});
    }

    const handleSaveButton = () => {
        setShowBoardInput(prev => !prev);
    }

    const handleSelectBoard = (boardName) => {
        //This function is called when the user selects a board name from the selector.
        setSelectedBoardName(boardName);
        const heights = savedBoards[boardName];
        createBoard(heights);
        algorithmState.current = "unbegun";
        setShowSelector(false);
        setIsDisabled({
            "clearButton": false, "editButton": false, "loadButton": false, "operationButton": false,
            "resetButton": true, "saveButton": false, "shuffleButton": false, "slider": false   
        })
    }   

    const handleShuffleButton = () => {
        //this function is called when the user clickes the button Shuffle. It randomly changes the position of the bars.
        const currentBarHeights = extractHeights(board);
        const newBarHeights = []; //the array of heights for the new bars. (same bars but with different sequence)
        let i, length, randomNumber, extractedItem;
        length = currentBarHeights.length;
        i = 0;
        //one by one randomly remove heights from the currentBarHeights and push them to the newBarHeights
        while (i < length) {
            randomNumber = Math.floor(Math.random() * currentBarHeights.length);
            extractedItem = currentBarHeights.splice(randomNumber, 1)[0]; //splice returns an array with the extracted items
            newBarHeights.push(extractedItem);
            i += 1;
        }
        createBoard(newBarHeights);
        setSelectedBoardName("");
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

    const saveBoard = () => {
        //this function gets called when the user clicks the arrow button after clicked the save button.
        //It saves an array with the heights of the board's bars to the localStorage
        const boardName = boardNameInputRef.current.value;
        console.log(boardName);
        let boards;
        if (savedBoards === {}) {
            boards = {};
        } else {
            boards = {...savedBoards};
            //check if boardName is already saved
            if (Object.keys(boards).find(name => name === boardName)) {
                alert("There is already a board with name: ", boardName, " saved!");
                return 0;
            } 
        }
        boards[boardName] = extractHeights(board); 
        setSavedBoards(boards);
        localStorage.setItem("boards", JSON.stringify(boards));
        setShowBoardInput(false);
    }

    const toggleHeight = () => {
        setShowHeight(prev => !prev);
    }

    const toggleSettings = () => {
        setShowSettings(prev => !prev);
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

                if (algorithmState.current === "finished") {
                    handleAlgorithmTermination();
                    return 0;
                }

            }
            changes = [];
            changes.push({"index": i-1, "status": "placed", "value": board[i-1].getValue()});
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
        handleAlgorithmTermination();
    }

    //object that holds the information about the settings section of the Asterisk screen
    const settings = [
        {title: "Show height", toggleFunction: toggleHeight, enabled: showHeight},
    ]

    //determine the color of the operator button (start/stop button) here to avoid confusion at the the render block
    const operatorButtonClassName = algorithmState.current === "pending" ? "stop" : "start";

    return (
        <div className={styles.container}>
            <div className={styles.settings}>
                <IoSettingsOutline className={styles.settingsIcon} onClick={toggleSettings}/>
            </div>
            <Settings showSettings={showSettings} settings={settings}/>
            <section className={styles.board} style={{columnGap: `${editBoard ? 15 : 30}px`}}>
                {determineVisibleContent()}
            </section>
            <section className={styles.functionalityContainer}>
                <button 
                    onClick={handleEditButton}
                    className={`${styles.button} ${isDisabled["editButton"] ? styles.disabled : null}`} 
                    disabled={isDisabled["editButton"]}
                >
                    {editBoard ? "Finish" : "Edit"}
                </button>
                <button 
                    onClick={handleOperationButton} 
                    className={`${styles.button} ${isDisabled["operationButton"] ? `${styles.disabled}` : `${styles[operatorButtonClassName]}`}`} 
                    disabled={isDisabled["operationButton"]}
                >
                    {algorithmState.current === "pending" ? "Stop" : "Start"}
                </button>
                <Slider/>
                <button 
                    onClick={handleResetButton}
                    className={`${styles.button} ${isDisabled["resetButton"] ? styles.disabled : null}`}
                    disabled={isDisabled["resetButton"]}
                >
                    Reset
                </button>
                <button 
                    onClick={handleClearButton}
                    className={`${styles.button} ${isDisabled["clearButton"] ? styles.disabled : null}`}
                    disabled={isDisabled["clearButton"]}
                >
                    Clear
                </button>
                <button
                    onClick={handleShuffleButton}
                    className={`${styles.button} ${isDisabled["shuffleButton"] ? styles.disabled : null}`}
                    disabled={isDisabled["shuffleButton"]}
                >
                    Shuffle
                </button>

                <div className={styles.saveLoadBoardContainer}>
                    <div className={styles.saveBoardContainer}>
                        <button
                            className={`${styles.button} ${isDisabled["saveButton"] ? `${styles.disabled}` : null}`}
                            disabled={isDisabled["saveButton"]}
                            onClick={handleSaveButton}
                        >
                            {
                                showBoardInput ? "Close" : "Save board"
                            }
                        </button>
                        <input 
                            type="text"
                            hidden={!showBoardInput}
                            className={styles.boardNameInput}
                            ref={boardNameInputRef}
                        />
                        <BsFillArrowRightSquareFill
                            className={`${styles.submitBoardName} ${showBoardInput ? null : styles.submitBoardNameHidden}`}
                            onClick={saveBoard}
                        />
                    </div>
                    <div className={styles.loadBoardContainer}>
                        <button
                            className={`${styles.button} ${isDisabled["loadButton"] ? `${styles.disabled}` : null}`}
                            disabled={isDisabled["loadButton"]}
                            onClick={handleLoadButton}
                        >
                            {
                            showSelector ? "Close" : "Load board"
                            }
                        </button>
                        <Selector
                            defaultMessage="Select a board"
                            elements={savedBoards} 
                            handleSelectElement={handleSelectBoard} 
                            handleDeleteElement={handleDeleteBoard} 
                            selectedElementName={selectedBoardName}
                            setSelectedElementName={setSelectedBoardName}
                            showSelector={showSelector}
                        /> 
                    </div>
                </div>
            </section>
        </div>
    )
}

export default BubbleSort;