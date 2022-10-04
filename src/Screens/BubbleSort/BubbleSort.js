import React, { useState, useEffect } from 'react';
import styles from './BubbleSort.module.css';
import Bar from '../../Components/Bar/Bar';
import BarNode from '../../Data Structures/BarNode';
import AddBarButton from '../../Components/AddBarButton/AddBarButton';

function BubbleSort() {
    const [board, setBoard] = useState(null);
    const [editBoard, setEditBoard] = useState(false); //whether or not the user wants to add/delete/resize a bar

    useEffect(() => {
        const customHeights = [70,120,80,50,60,50,70,50,200]; //70,120,80,50,60,50,70,50,200
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

    const toggleEditButton = () => {
        setEditBoard(prev => !prev);
    }

    return (
        <div className={styles.container}>
            <section className={styles.barsContainer}>
                {determineVisibleContent()}
            </section>
            <section className={styles.functionalityContainer}>
                <button 
                    className={styles.button} 
                    onClick={toggleEditButton}
                >
                    {editBoard ? "Finish" : "Edit"}
                </button>
            </section>
        </div>
    )
}

export default BubbleSort;