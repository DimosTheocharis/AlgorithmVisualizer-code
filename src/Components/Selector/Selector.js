import React, { useState, useContext } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { AppContext } from '../../App';
import { RiDeleteBin6Line } from "react-icons/ri";
import SelectorCSS from './Selector.module.css';

function Selector({ grids, loadGrid, setNextBlock, setSavedGrids}) {
    const { algorithmState, setDisabled, setShowSelector, showSelector } = useContext(AppContext);
    const [expand, setExpand] = useState(false);

    const toggleSelector = () => {
        setExpand(prev => !prev);
    }

    const selectGrid = (gridName) => {
        //takes the name of the selected grid, loads the grid and prepares the algorithm for running
        loadGrid(gridName);
        setExpand(false);
        setShowSelector(false);
        setDisabled(false);
        algorithmState.current = "unbegun";
        setNextBlock("blocked");
    }

    const deleteGrid = (gridName) => {
        //deletes the name of the selected grid
        const newGrids = {...grids};
        delete newGrids[gridName];
        localStorage.setItem("grids", JSON.stringify(newGrids));
        setSavedGrids(newGrids);
        setExpand(false);
        setShowSelector(false);
    }

    return (
        <div className={`${SelectorCSS.container} ${showSelector ? null : SelectorCSS.containerHidden}`}>
            <div className={SelectorCSS.selectorContainer}>
                <div className={SelectorCSS.selectionContainer}>
                    <p className={SelectorCSS.selectionMessage}>Select a grid</p>
                </div>
                <div className={SelectorCSS.button} onClick={toggleSelector}>
                    {
                        expand ?
                            <IoMdArrowDropup className={SelectorCSS.icon}/>
                        :
                            <IoMdArrowDropdown className={SelectorCSS.icon}/>
                    }
                </div>
            </div>
            {  
                expand ? 
                    <div className={SelectorCSS.valuesContainer}>
                        {
                            Object.keys(grids).map((name, index) => {
                                return (
                                    <div className={SelectorCSS.valueItem} key={index}>
                                        <div className={SelectorCSS.valueContainer} onClick={() => selectGrid(name)}>
                                            <p className={SelectorCSS.value}>{name}</p>
                                        </div>
                                        <div className={SelectorCSS.deleteButton} onClick={() => deleteGrid(name)}>
                                            <RiDeleteBin6Line/>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                :
                    null
            }
        </div>
    )
}

export default Selector;