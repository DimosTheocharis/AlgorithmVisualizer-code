import React, { useState, useEffect, useContext, useRef } from 'react';
import PriorityQueue from '../../Data Structures/PriorityQueue';
import AVL from '../../Data Structures/AVL';
import Block from '../../Components/Block/Block';
import Settings from '../../Components/Settings/Settings';
import Timer from '../../Components/Timer/Timer';
import { AppContext } from '../../App';
import { IoSettingsOutline } from "react-icons/io5";
import styles from './AsteriskPathFinding.module.css';


function AsteriskPathFinding() {
  const {rows, columns, createGrid, getStatus, grid, setGrid} = useContext(AppContext);
  const [nextBlock, setNextBlock] = useState("source"); //determines what the next block is going to be
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [animationDuration, setAnimationDuration] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showValueG, setShowValueG] = useState(false);
  const [showValueH, setShowValueH] = useState(false);
  const [showValueF, setShowValueF] = useState(false);
  const [duration, setDuration] = useState(0); //the running time of the algorithm
  let algorithmState = useRef("unbegun"); //a mutable value that tells the holds the state of the algorithm. 
  //unbegan if it has not started yet
  //pending if algorithm is currently running
  //finished if either algorithm either has normally ended, or manually stopped

  useEffect(() => {    
    createGrid();
  }, [])


  const calculateDistance = (source, destination) => {
    const verticalDistance = Math.abs(destination.getRow() - source.getRow());
    const horizontalDistance = Math.abs(destination.getColumn() - source.getColumn());
    const distance = min(verticalDistance, horizontalDistance) * 14 + Math.abs(verticalDistance - horizontalDistance) * 10;
    return distance;
  }

  const computeNeighbours = (node) => {
    let i, j, neighbor, row, column;
    const neighbours = [];
    for (i = -1; i <= 1; i++) {
      for (j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        row = node.getRow();
        column = node.getColumn();
        if ((0 <= row + i && row + i < rows) && (0 <= column + j && column + j < columns)) {
          neighbor = grid[row + i][column + j];
          neighbours.push(neighbor);
        }
      }
    }
    return neighbours;
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
            status={getStatus(i, j)} 
            row={i} column={j} 
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
        algorithmState.current = "pending";
        setDisabled(true);
        AsteriskPathFinding(source, destination);
      }
      //if algorithm is running, stop it
    } else if (algorithmState.current === "pending") {
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


  const insideOfGrid = (row, column) => {
    return (0 <= row < rows) && (0 <= column < columns);
  }

  const min = (value1, value2) => {
    return value1 < value2 ? value1 : value2;
  }


  const pause = async () => {
    let pauseTime = 0, resolvedValue;

    while (algorithmState.current === "paused") {
      resolvedValue = await sleep(300);
      pauseTime += 300;
    }

    return new Promise((resolve, reject) => {
      resolve(`Paused for ${pauseTime / 1000} seconds`);
    })
  }


  const performGridChanges = (changes) => {
    const newGrid = [...grid];
    changes.forEach(change => {
      newGrid[change.row][change.column].setStatus(change.status);
    })
    setGrid(newGrid);
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


  const sleep = async (duration) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`${duration / 1000} seconds have passed.`);
      }, duration)
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


  const visualizePath = async (source, destination) => {
    let current, parent, resolvedValue;
    let changes = [];
    current = destination;
    changes.push({row: current.getRow(), column: current.getColumn(), status: "destination"});
    performGridChanges(changes);
    parent = current.getParent();
    while (parent !== null && (algorithmState.current === "pending" || algorithmState.current === "paused")) {
      current = parent;
      changes.push({row: current.getRow(), column: current.getColumn(), status: "path"});
      performGridChanges(changes);
      parent = current.getParent();
      await sleep(animationDuration);

      if (algorithmState.current === "paused") {
        resolvedValue = await pause();
        console.log(resolvedValue);
      }      
    }
    if (algorithmState.current === "pending") {
      changes.push({row: current.getRow(), column: current.getColumn(), status: "source"});
      performGridChanges(changes);
      algorithmState.current = "finished";
      setDisabled(false);
    }
  }


  const AsteriskPathFinding = async (source, destination) => {
    const open = new PriorityQueue(); //contains nodes to be evaluated
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
  );
}

export default AsteriskPathFinding;