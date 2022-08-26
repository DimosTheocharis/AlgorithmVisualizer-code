import React, { useState, useContext, useEffect, useRef } from 'react';
import DijkstraNode from '../../Data Structures/DijkstraNode';
import PriorityQueueDijkstra from '../../Data Structures/PriorityQueueDijkstra';
import Block from '../../Components/Block/Block';
import { AppContext } from '../../App';

import styles from './Dijkstra.module.css';

function Dijkstra() {
    const {rows, columns, algorithmState, animationDuration, calculateDistance, computeNeighbours, disabled, getStatus, grid, pause, 
      performGridChanges, setAnimationDuration, setDisabled, setGrid, sleep, visualizePath} = useContext(AppContext);
    const [nextBlock, setNextBlock] = useState("source"); //determines what the next block is going to be
    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [showValueD, setShowValueD] = useState(false);
    const [duration, setDuration] = useState(0); //the running time of the algorithm
    let durationInterval = useRef(null);

    useEffect(() => {    
        createGrid();
        /*
        const minHeap = new PriorityQueueDijkstra();
        const n1 = new DijkstraNode(5,5,"unblocked");
        const n2 = new DijkstraNode(5,5,"unblocked");
        const n3 = new DijkstraNode(5,5,"unblocked");
        const n4 = new DijkstraNode(5,5,"unblocked");
        const n5 = new DijkstraNode(5,5,"unblocked");
        n1.setValueD(15);
        n2.setValueD(10);
        n3.setValueD(4);
        n4.setValueD(2);
        n5.setValueD(1);
        minHeap.insertNode(n1);
        minHeap.insertNode(n2);
        minHeap.insertNode(n3);
        minHeap.insertNode(n4);
        minHeap.insertNode(n5);
        minHeap.printNodes();
        minHeap.extractMin()
        minHeap.printNodes();
        minHeap.extractMin()
        minHeap.printNodes();
        */
    }, []);
    

    const createGrid = () => {
        //gets called only at the first render of the app, and creates a default grid with blocks that are unblocked
        let startGrid = [];
        let i,j,row;
        for (i = 0; i < rows; i++) {
          row = [];
          for (j = 0; j < columns; j++) {
            row.push(new DijkstraNode(i, j, "unblocked"));
          }
          startGrid.push(row);
        }
        setGrid(startGrid);
      }


    const getBlocks = () => {
        //create the grid. That is, 20x20 blocks
        const blocks = [];
        let valueD;
        let i,j;
        for (i = 0; i < rows; i++) {
            for (j = 0; j < columns; j++) {
                valueD = grid === null ? null : grid[i][j].getValueD();
                blocks.push(
                    <Block
                        key={i * columns + j}
                        handleClickBlock={handleClickBlock}
                        algorithm="Dijkstra"
                        status={getStatus(i, j)} 
                        row={i} 
                        column={j} 
                        valueD={valueD === 1000000 ? "1m" : valueD}
                    />
                )
            }
        }
        return blocks;
    }


    const handleClearButton = () => {
      createGrid();
      setSource(null);
      setDestination(null);
      setNextBlock("source");
      algorithmState.current = "unbegun";
    }
    

    const handleClickBlock = (row, column) => {
        //change the status of a block
        const newGrid = [...grid];
        
        if (nextBlock === "source") { //put the source block
          newGrid[row][column].setStatus("source");
          newGrid[row][column].setValueD(0);
          setSource(newGrid[row][column]);
          setNextBlock("destination");
        } 
        else if (nextBlock === "destination") { //put the destination block
          newGrid[row][column].setStatus("destination");
          setDestination(newGrid[row][column]);
          setNextBlock("block");
        } 
        else { //change the state of the block that is neither source nor destination
          if (getStatus(row, column) === "blocked") { 
            newGrid[row][column].setStatus("unblocked");
          } else {
            newGrid[row][column].setStatus("blocked");
          }
        }
        
        setGrid(newGrid);
    }

    const handleOperationButton = () => {
      //if algorithm is not running, then run.
      if (algorithmState.current === "unbegun") {
        if (source !== null && destination !== null) {
          //activate the timer
          durationInterval.current = setInterval(() => {
            setDuration(prev => prev + 1000);
          }, 1000);
          algorithmState.current = "pending";
          setDisabled(true);
          Dijkstra(source, destination);
        }
        //if algorithm is running, stop it
      } else if (algorithmState.current === "pending") {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
        algorithmState.current = "finished";
        setDisabled(false);
      } 
    }


    const handlePauseButton = () => {
      if (algorithmState.current === "pending") {
        algorithmState.current = "paused";
        setDisabled(prev => !prev);
      } else {
        algorithmState.current = "pending";
        setDisabled(prev => !prev);
      }
    }


    const handleResetButton = () => {
      resetGrid();
      algorithmState.current = "unbegun";
    }
  
    const handleSlider = (e) => {
      setAnimationDuration(e.target.value);
    }


    const resetGrid = () => {
      //this function set all the blocks of the grid to unblocked, except the source, destination and blocked blocks
      setGrid(prev => {
        let i,j, row, column, status;
        for (i = 0; i < rows; i++) {
          for (j = 0; j < columns; j++) {
            row = prev[i][j].getRow();
            column = prev[i][j].getColumn();
            status = prev[i][j].getStatus();
            if (prev[i][j] === source) {
              //source
              prev[i][j].reset(row, column, "source");
            } else if (prev[i][j] === destination) {
              //destination
              prev[i][j].reset(row, column, "destination");
            } else if (status === "blocked") {
              //blocked blocks
              prev[i][j].reset(row, column, "blocked");
            } else {
              //we want all the unblocked, evaluated and evaluating blocks to become unblocked
              prev[i][j].reset(row, column, "unblocked");
            }
          }
        }
        return [...prev];
      })
    }
  


    const Dijkstra = async (source, destination) => {
      const Q = new PriorityQueueDijkstra();
      let i,j, current, neighbours, neighbor, newDistance, changes, resolvedValue;
      /*
      for (i = 0; i < rows; i++) {
        for (j = 0; j < columns; j++) {
          Q.insertNode(grid[i][j]);
        }
      }
      */
     Q.insertNode(source);
      while (!Q.isEmpty()) {
        changes = [];
        current = Q.extractMin();
        changes.push({row: current.getRow(), column: current.getColumn(), status: "evaluated"});
        if (current === destination) {
          console.log("algorith state is: ", algorithmState.current);
          console.log("mpainw");
          visualizePath(source, destination);
          console.log("bghka");
          return;
        }

        neighbours = computeNeighbours(current);
        neighbours.forEach(neighbor => {
          if (neighbor.getStatus() !== "blocked" && neighbor.getStatus() !== "evaluated") {
            changes.push({row: neighbor.getRow(), column: neighbor.getColumn(), status: "evaluating"});
            newDistance = current.getValueD() + calculateDistance(current, neighbor);
            if (newDistance < neighbor.getValueD()) {
              neighbor.setValueD(newDistance);
              neighbor.setParent(current);
              Q.insertNode(neighbor);
            }
          }
        })
        performGridChanges(changes);
        if (algorithmState.current === "paused") {
          resolvedValue = await pause();
        }
        
        resolvedValue = await sleep(animationDuration);
      }
    }

    //determine the color of the operator button (start/stop button) here to avoid confusion at the the render block
    const operatorButtonClassName = algorithmState.current === "pending" ? "stop" : "start";


    return (
        <div className={styles.container}>

            <div className={styles.componentsContainer}>
              <div className={styles.component}>
                <div className={`${styles.componentBlock} ${styles.source}`}></div>
                <p className={styles.componentTitle}>Source</p>
              </div>

              <div className={styles.component}>
                <div className={`${styles.componentBlock} ${styles.destination}`}></div>
                <p className={styles.componentTitle}>Destination</p>
              </div>

              <div className={styles.component}>
                <div className={`${styles.componentBlock} ${styles.blocked}`}></div>
                <p className={styles.componentTitle}>Blocked</p>
              </div>

              <div className={styles.component}>
                <div className={`${styles.componentBlock} ${styles.evaluated}`}></div>
                <p className={styles.componentTitle}>Evaluated</p>
              </div>

              <div className={styles.component}>
                <div className={`${styles.componentBlock} ${styles.evaluating}`}></div>
                <p className={styles.componentTitle}>Evaluating</p>
              </div>

              <div className={styles.component}>
                <div className={`${styles.componentBlock} ${styles.path}`}></div>
                <p className={styles.componentTitle}>Path</p>
              </div>
            </div>

            <div className={styles.functionalityContainer}>
              <button 
                onClick={handleOperationButton} 
                className={`${styles.button} ${(algorithmState.current === "finished" || algorithmState.current === "paused") ? `${styles.disabled}` : `${styles[operatorButtonClassName]}`}`} 
                disabled={algorithmState.current === "finished" || algorithmState.current === "paused"}
              >
                {algorithmState.current === "pending" ? "Stop" : "Start"}
              </button>
              <button  onClick={handlePauseButton} className={`${styles.button} ${algorithmState.current === "unbegun" || algorithmState.current === "finished" ? `${styles.disabled}` : null}`} disabled={algorithmState.current === "unbegun" || algorithmState.current === "finished"}>{algorithmState.current === "paused" ? "Resume" : "Pause"}</button>
              <div className='sliderContainer'>
                <input type="range" min={0} max={5000} value={animationDuration} className={`${styles.slider} ${algorithmState.current !== "unbegun" && algorithmState.current !== "finished" ? `${styles.sliderDisabled}` : `${styles.sliderEnabled}`}`} onChange={handleSlider} disabled={algorithmState.current !== "unbegun" && algorithmState.current !== "finished"}/>
                <p className={styles.sliderText}>Animation duration: {animationDuration} milliseconds</p>
              </div>
              <button onClick={handleResetButton} className={`${styles.button} ${disabled ? `${styles.disabled}` : null}`} disabled={disabled}>Reset</button>
              <button onClick={handleClearButton} className={`${styles.button} ${disabled ? `${styles.disabled}` : null}`} disabled={disabled}>Clear</button>
            </div>

            <div className={styles.grid}>
                {getBlocks()}
            </div>
        </div>
    )
}

export default Dijkstra;