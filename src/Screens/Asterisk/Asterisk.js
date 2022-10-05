import React, { useState, useEffect, useContext,  } from 'react';
import PriorityQueueAsterisk from '../../Data Structures/PriorityQueueAsterisk';
import AVL from '../../Data Structures/AVL';
import AsteriskNode from '../../Data Structures/AsteriskNode';
import Block from '../../Components/Block/Block';
import Settings from '../../Components/Settings/Settings';
import Timer from '../../Components/Timer/Timer';
import Selector from '../../Components/Selector/Selector';
import Slider from '../../Components/Slider/Slider';
import { AppContext } from '../../App';
import { IoSettingsOutline } from "react-icons/io5";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import styles from './Asterisk.module.css';


function Asterisk() {
  const { algorithmState, animationDuration, calculateDistance, columns, computeNeighbours, destination, disabled, durationInterval, getStatus, 
          grid, gridNameInputRef, handleLoadButton, handleSaveButton, isDisabled, loadSavedGrids, nextBlock, pause, performGridChanges, rows, 
          savedGrids, saveGrid, setAnimationDuration, setDestination, setDisabled, setGrid, setIsDisabled, setNextBlock, setSavedGrids, 
          setSelectedGridName, setShowSelector, setSource, showGridInput, showSelector, sleep, source, takeSnapshot, visualizePath} = useContext(AppContext);
  const [showSettings, setShowSettings] = useState(false);
  //the next 3 values are for the nodes of the algorithm. 
  const [showValueG, setShowValueG] = useState(false);
  const [showValueH, setShowValueH] = useState(false);
  const [showValueF, setShowValueF] = useState(false);
  const [duration, setDuration] = useState(0); //the running time of the algorithm

  useEffect(() => {  
    const grids = loadSavedGrids();
    setSavedGrids(grids);
    createGrid();
    setIsDisabled(prev => ({...prev, "snapshotButton": true}));
  }, [])

  
  const createGrid = () => {
    //gets called only at the first render of the app, and creates a default grid with blocks that are unblocked
    let startGrid = [];
    let i,j,row;
    for (i = 0; i < rows; i++) {
      row = [];
      for (j = 0; j < columns; j++) {
        row.push(new AsteriskNode(i, j, "unblocked"));
      }
      startGrid.push(row);
    }
    setGrid(startGrid);
  }


  const getBlocks = () => {
    //create the grid. That is, 20x20 blocks
    const blocks = [];
    let valueG, valueF, valueH;
    let i,j;
    for (i = 0; i < rows; i++) {
      for (j = 0; j < columns; j++) {
        valueG = grid === null ? null : grid[i][j].getValueG();
        valueH = grid === null ? null : grid[i][j].getValueH();
        valueF = grid === null ? null : grid[i][j].getValueF();
        blocks.push(
          <Block 
            key={i * columns + j} 
            handleClickBlock={handleClickBlock} 
            algorithm="Asterisk"
            status={getStatus(i, j)} 
            row={i} 
            column={j} 
            valueG={valueG === 1000000 ? "1m" : valueG} 
            valueH={valueH === 1000000 ? "1m" : valueH} 
            valueF={valueF === 2000000 ? "2m" : valueF}
            showValueG={showValueG}
            showValueH={showValueH}
            showValueF={showValueF}
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
    setSelectedGridName("");
    algorithmState.current = "unbegun";
  }


  const handleClickBlock = (row, column) => {
    //change the status of a block
    const newGrid = [...grid];
    
    if (nextBlock === "source") { //put the source block
      newGrid[row][column].setStatus("source");
      newGrid[row][column].setValueG(0);
      newGrid[row][column].setValueF(0);
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


  const handleDeleteGrid = (gridName) => {
    //the function that will be called when the user deletes a grid from the selector
    const newGrids = [...savedGrids];
    delete newGrids[gridName];
    setSavedGrids(newGrids); 
    setShowSelector(false); 
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
        Asterisk(source, destination);
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
      setIsDisabled(prev => {
        return {...prev, "loadButton": true}
      })
    }
  }
  

  const handleResetButton = () => {
    resetGrid();
    algorithmState.current = "unbegun";
    setDuration(0);
    setIsDisabled(prev => {
      return {...prev, "saveButton" : false, "snapshotButton": true}
    });
  }

  const handleSelectGrid = (gridName) => {
    //the function that will be called when the user selects a grid from the selector
    loadGrid(gridName); 
    setShowSelector(false); 
    setDisabled(false); 
    algorithmState.current = "unbegun"; 
    setNextBlock("blocked"); 
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
        row.push(new AsteriskNode(i, j, status));
        if (status === "source") {
          setSource(row[j]);
          row[j].setValueG(0);
          row[j].getValueF(0);
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
            prev[i][j].setValueG(0);
            prev[i][j].setValueF(0);
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

  const toggleValueG = () => {
    setShowValueG(prev => !prev);
  }

  const toggleValueH = () => {
    setShowValueH(prev => !prev);
  }

  const toggleValueF = () => {
    setShowValueF(prev => !prev);
  }



  const Asterisk = async (source, destination) => {
    const open = new PriorityQueueAsterisk(); //contains nodes to be evaluated
    const closed = new AVL(); //contains evaluated nodes
    let current, neighbours, newDistance, found, hValue, resolvedValue, changes; //changes will be an array containing the coordinates 
    //of a node that needs to be changed and its new status
    open.insertNode(source);
    while (!open.isEmpty() && (algorithmState.current === "pending" || algorithmState.current === "paused")) {
      changes = [];
      current = open.extractMin();
      closed.setRoot(closed.insertNode(closed.getRoot(), current));
      changes.push({row: current.getRow(), column: current.getColumn(), status: "evaluated"});
      
      if (current === destination) {
        visualizePath(source, destination);
        return 0;
      }

      neighbours = computeNeighbours(current);
      neighbours.forEach(neighbor => {
        if (neighbor.getStatus() !== "blocked" && !closed.find(closed.getRoot(), neighbor)) {
          newDistance = current.getValueG() + calculateDistance(current, neighbor);
          found = open.find(neighbor);
          if (newDistance < neighbor.getValueG() || !found) {
            neighbor.setValueG(newDistance);
            hValue = calculateDistance(neighbor, destination);
            neighbor.setValueH(hValue);
            neighbor.setValueF(neighbor.getValueG() + neighbor.getValueH());
            neighbor.setParent(current);
            if (!found) {
              open.insertNode(neighbor);
              changes.push({row: neighbor.getRow(), column: neighbor.getColumn(), status: "evaluating"});
            }
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

  //object that holds the information about the settings section of the Asterisk screen
  const settings = [
    {title: "Show g-value", toggleFunction: toggleValueG, enabled: showValueG},
    {title: "Show h-value", toggleFunction: toggleValueH, enabled: showValueH},
    {title: "Show f-value", toggleFunction: toggleValueF, enabled: showValueF}
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
            {algorithmState.current === "paused" ? "Resume" : "Pause"}
          </button>
          <Slider/>
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
              <Selector
                grids={savedGrids} 
                gridsName="grids" 
                handleSelectGrid={handleSelectGrid} 
                handleDeleteGrid={handleDeleteGrid} 
                showSelector={showSelector}
              />
              
            </div>

          </div>

          <button
            className={`${styles.button} ${isDisabled["snapshotButton"] ? `${styles.disabled}` : null}`}
            disabled={isDisabled["snapshotButton"]}
            onClick={() => takeSnapshot("Asterisk")}
          >
            Take snapshot
          </button>
        </div>
        <div className={styles.grid}>
          {getBlocks()}
        </div>
      </div>
  );
}

export default Asterisk;