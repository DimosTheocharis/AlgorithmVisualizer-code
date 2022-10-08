import React, { useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { RiDeleteBin6Line } from "react-icons/ri";
import SelectorCSS from './Selector.module.css';

function Selector({ defaultMessage, elements, handleSelectElement, handleDeleteElement, selectedElementName, setSelectedElementName, showSelector}) {
    //this component is used in 2 different places, in an algorithm screen like Asterisk, and in Comparison screen with different type of grids
    //and purpose. Thus, there is a need to call different functions when a grid is saved and deleted.
    const [expand, setExpand] = useState(false);

    const toggleSelector = () => {
        setExpand(prev => !prev);
    }

    const selectGrid = (gridName) => {
        //takes the name of the selected grid, loads the grid and prepares the algorithm for running
        setExpand(false);
        setSelectedElementName(gridName);
        handleSelectElement(gridName)
    }

    const deleteGrid = (gridName) => {
        //deletes the name of the selected grid
        setExpand(false); 
        handleDeleteElement(gridName);
    }

    return (
        <div className={`${SelectorCSS.container} ${showSelector ? null : SelectorCSS.containerHidden}`}>
            <div className={SelectorCSS.selectorContainer}>
                <div className={SelectorCSS.selectionContainer}>
                    <p className={SelectorCSS.selectionMessage}>{selectedElementName === "" ? defaultMessage: selectedElementName}</p>
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
                            Object.keys(elements).map((name, index) => {
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