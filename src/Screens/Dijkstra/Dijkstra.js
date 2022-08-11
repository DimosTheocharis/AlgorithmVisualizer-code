import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../../App';

function Dijkstra() {
    const {rows, columns, createGrid, getStatus, grid, setGrid} = useContext(AppContext);
    const [nextBlock, setNextBlock] = useState("source"); //determines what the next block is going to be
    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState(null);
    const [animationDuration, setAnimationDuration] = useState(0);
    const [disabled, setDisabled] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    let algorithmState = useRef("unbegun"); //a mutable value that tells the holds the state of the algorithm. 

    useEffect(() => {    
        createGrid();
    }, []);


    const getBlocks = () => {
        //create the grid. That is, 20x20 blocks
        const blocks = [];
        let distance;
        let i,j;
        for (i = 0; i < rows; i++) {
            for (j = 0; j < columns; j++) {

            }
        }
    }


    return (
        <div>dIJKSTRA</div>
    )
}

export default Dijkstra;