import React, { useState, useEffect, useContext, useRef } from 'react';
import PriorityQueueAsterisk from '../../Data Structures/PriorityQueueAsterisk';
import AVL from '../../Data Structures/AVL';
import AsteriskNode from '../../Data Structures/AsteriskNode';
import Block from '../../Components/Block/Block';
import Settings from '../../Components/Settings/Settings';
import Timer from '../../Components/Timer/Timer';
import Selector from '../../Components/Selector/Selector';
import { AppContext } from '../../App';
import { IoSettingsOutline } from "react-icons/io5";
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import styles from './AsteriskPathFinding.module.css';


function AsteriskPathFinding() {
  const {rows, algorithmState, animationDuration, calculateDistance, columns, computeNeighbours, disabled, durationInterval, getStatus, grid, pause, 
         performGridChanges, setAnimationDuration, setDisabled, setGrid, setShowGridInput, setShowSelector, showGridInput, showSelector, sleep, visualizePath} = useContext(AppContext);
  const [nextBlock, setNextBlock] = useState("source"); //determines what the next block is going to be
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  //the next 3 values are for the nodes of the algorithm. 
  const [showValueG, setShowValueG] = useState(false);
  const [showValueH, setShowValueH] = useState(false);
  const [showValueF, setShowValueF] = useState(false);
  const [duration, setDuration] = useState(0); //the running time of the algorithm
  const gridNameInputRef = useRef(null);

  useEffect(() => {    
    createGrid();
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


  const deconstructGrid = (grid) => {
    //this function takes a grid of node instances as input and returns a 2d array of letters that correspond to the status of the nodes
    //ie "U" means unblocked, "D" means destination, "S" means source etc
    const newGrid = [];
    let newRow;
    grid.forEach(row => {
      newRow = [];
      row.forEach(node => {
        newRow.push(node.getStatus()[0].toUpperCase());
      })
      newGrid.push(newRow);
    })
    return newGrid;
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
    } else {
      algorithmState.current = "pending";
      setDisabled(prev => !prev);
    }
  }
  

  const handleResetButton = () => {
    resetGrid();
    algorithmState.current = "unbegun";
    setDuration(0);
  }

  const handleSlider = (e) => {
    setAnimationDuration(e.target.value);
  }


  const insideOfGrid = (row, column) => {
    return (0 <= row < rows) && (0 <= column < columns);
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


  const saveGridName = () => {
    const newName = gridNameInputRef.current.value; //take the name of the grid we want to save
    if (newName === "") {
      alert("The name of the grid is empty. Try typing a name for the grid you want to save.");
    }
    let grids = JSON.parse(localStorage.getItem("grids")); //all the saved grids
    console.log(grids);
    if (grids !== null) {
      if (Object.keys(grids).find(name => name === newName)) {
        alert("There is already a grid with the same name.");
        return;
      } else {
        grids[newName] = deconstructGrid(grid);
        localStorage.setItem("grids", JSON.stringify(grids));
      }
    } else {
      grids = {};
      grids[newName] = deconstructGrid(grid);
      localStorage.setItem("grids", JSON.stringify(grids));
    }
    setShowGridInput(false);
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
    console.log(source.getValueG());
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

  //object that holds the information about the settings section of the AsteriskPathFinding screen
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
          <div className='sliderContainer'>
            <input 
              type="range" 
              min={0} 
              max={5000} 
              value={animationDuration} 
              className={`${styles.slider} ${algorithmState.current !== "unbegun" && algorithmState.current !== "finished" ? `${styles.sliderDisabled}` : `${styles.sliderEnabled}`}`} 
              onChange={handleSlider} 
              disabled={algorithmState.current !== "unbegun" && algorithmState.current !== "finished"}
            />
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
                className={`${styles.button} ${disabled ? `${styles.disabled}` : null}`}
                disabled={disabled}
                onClick={() => setShowGridInput(true)}
              >
                Save grid
              </button>
              <input 
                type="text"
                hidden={!showGridInput}
                className={styles.gridNameInput}
                ref={gridNameInputRef}
              />
              <BsFillArrowRightSquareFill
                className={`${styles.submitGridName} ${showGridInput ? null : styles.submitGridNameHidden}`}
                onClick={saveGridName}
              />
            </div>


            <div className={styles.loadGridContainer}>
              <button
                className={`${styles.button} ${disabled ? `${styles.disabled}` : null}`}
                disabled={disabled}
                onClick={() => setShowSelector(true)}
              >
                Load grid
              </button>
              <Selector showSelector={showSelector}/>
            </div>

          </div>
        </div>
        <div className={styles.grid}>
          {getBlocks()}
        </div>
      </div>
  );
}

export default AsteriskPathFinding;