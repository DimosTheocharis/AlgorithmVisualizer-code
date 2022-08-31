import React, { useState, useContext, useEffect, useRef } from 'react';
import DijkstraNode from '../../Data Structures/DijkstraNode';
import PriorityQueueDijkstra from '../../Data Structures/PriorityQueueDijkstra';
import Block from '../../Components/Block/Block';
import Settings from '../../Components/Settings/Settings';
import Timer from '../../Components/Timer/Timer';
import Selector from '../../Components/Selector/Selector';
import { IoSettingsOutline } from "react-icons/io5";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { AppContext } from '../../App';

import styles from './Dijkstra.module.css';

function Dijkstra() {
    const {rows, columns, algorithmState, animationDuration, calculateDistance, computeNeighbours, destination, disabled, durationInterval, 
           getStatus, grid, gridNameInputRef, handleLoadButton, handleSaveButton, isDisabled, loadSavedGrids, pause, performGridChanges, 
           savedGrids, saveGrid,setAnimationDuration, setDestination, setDisabled, setGrid, setIsDisabled, setSavedGrids, setShowSelector, 
           setSource, showGridInput, showSelector, sleep, source, visualizePath} = useContext(AppContext);
    const [nextBlock, setNextBlock] = useState("source"); //determines what the next block is going to be
    const [showSettings, setShowSettings] = useState(false);
    const [showValueD, setShowValueD] = useState(false);
    const [duration, setDuration] = useState(0); //the running time of the algorithm

    useEffect(() => {
        const grids = loadSavedGrids();
        setSavedGrids(grids);  
        createGrid();
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
                        showValueD={showValueD}
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
          setIsDisabled(prev => {
            return {...prev, "saveButton": true}
          })
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
        setIsDisabled(prev => {
          return {...prev, "loadButton": false}
        });
      } else {
        algorithmState.current = "pending";
        setDisabled(prev => !prev);
      }
    }


    const handleResetButton = () => {
      resetGrid();
      algorithmState.current = "unbegun";
      setDuration(0);
      setIsDisabled(prev => {
        return {...prev, "saveButton" : false}
      });
    }
    
  
    const handleSlider = (e) => {
      setAnimationDuration(e.target.value);
    }


    const loadGrid = (gridName) => {
      const deconstructedGrid = savedGrids[gridName];
      const dictionary = {
        "S": "source",
        "D": "destination",
        "B": "blocked",
        "U": "unblocked",
      }
      let grid = [];
      let i, j, row, status;
      for (i = 0; i < rows; i++) {
        row = [];
        for (j = 0; j < columns; j++) {
          status = dictionary[deconstructedGrid[i][j]];
          row.push(new DijkstraNode(i, j, status));
          if (status === "source") {
            setSource(row[j]);
            row[j].setValueD(0);
          } else if (status === "destination") {
            setDestination(row[j]);
          }
        }
        grid.push(row);
      }
      setGrid(grid);
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
              prev[i][j].setValueD(0);
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


    const toggleSettings = () => {
      setShowSettings(prev => !prev);
    }

    const toggleValueD = () => {
      setShowValueD(prev => !prev);
    }



    const Dijkstra = async (source, destination) => {
      const Q = new PriorityQueueDijkstra();
      let current, neighbours, neighbor, newDistance, changes, resolvedValue;

      Q.insertNode(source);
      while (!Q.isEmpty()) {
        changes = [];
        current = Q.extractMin();
        changes.push({row: current.getRow(), column: current.getColumn(), status: "evaluated"});
        if (current === destination) {
          visualizePath(source, destination);
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

    //object that holds the information about the settings section of the AsteriskPathFinding screen
    const settings = [
      {title: "Show d-value", toggleFunction: toggleValueD, enabled: showValueD}
    ]

    //determine the color of the operator button (start/stop button) here to avoid confusion at the the render block
    const operatorButtonClassName = algorithmState.current === "pending" ? "stop" : "start";


    return (
        <div className={styles.container}>
            <div className={styles.settings}>
              <IoSettingsOutline className={styles.settingsIcon} onClick={toggleSettings}/>
            </div>
            <Settings showSettings={showSettings} settings={settings}/>
            <Timer duration={duration}/>
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
              <button  
                onClick={handlePauseButton} 
                className={`${styles.button} ${algorithmState.current === "unbegun" || algorithmState.current === "finished" ? `${styles.disabled}` : null}`} 
                disabled={algorithmState.current === "unbegun" || algorithmState.current === "finished"}
              >
                {algorithmState.current === "paused" ? "Resume" : "Pause"}</button>
              <div className='sliderContainer'>
                <input type="range" min={0} max={5000} value={animationDuration} className={`${styles.slider} ${algorithmState.current !== "unbegun" && algorithmState.current !== "finished" ? `${styles.sliderDisabled}` : `${styles.sliderEnabled}`}`} onChange={handleSlider} disabled={algorithmState.current !== "unbegun" && algorithmState.current !== "finished"}/>
                <p className={styles.sliderText}>Animation duration: {animationDuration} milliseconds</p>
              </div>
              <button 
                onClick={handleResetButton} 
                className={`${styles.button} ${disabled ? `${styles.disabled}` : null}`} 
                disabled={disabled}
              >
                Reset
              </button>
              <button 
                onClick={handleClearButton} 
                className={`${styles.button} ${disabled ? `${styles.disabled}` : null}`} 
                disabled={disabled}
              >
                Clear
              </button>

              <div className={styles.saveLoadGridContainer}>
                <div className={styles.saveGridContainer}>
                  <button
                    className={`${styles.button} ${isDisabled["saveButton"] ? `${styles.disabled}` : null}`}
                    disabled={isDisabled["saveButton"]}
                    onClick={handleSaveButton}
                  >
                    {
                      showGridInput ? "Close" : "Save grid"
                    }
                  </button>
                  <input 
                    type="text"
                    hidden={!showGridInput}
                    className={styles.gridNameInput}
                    ref={gridNameInputRef}
                  />
                  <BsFillArrowRightSquareFill
                    className={`${styles.submitGridName} ${showGridInput ? null : styles.submitGridNameHidden}`}
                    onClick={saveGrid}
                  />
                </div>


                <div className={styles.loadGridContainer}>
                  <button
                    className={`${styles.button} ${isDisabled["loadButton"] ? `${styles.disabled}` : null}`}
                    disabled={isDisabled["loadButton"]}
                    onClick={handleLoadButton}
                  >
                    {
                      showSelector ? "Close" : "Load grid"
                    }
                  </button>
                  <Selector grids={savedGrids} loadGrid={loadGrid} setNextBlock={setNextBlock} setSavedGrids={setSavedGrids}/>
                </div>

              </div>
            </div>

            <div className={styles.grid}>
                {getBlocks()}
            </div>
        </div>
    )
}

export default Dijkstra;