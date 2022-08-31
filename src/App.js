import React, { useState, createContext, useRef } from 'react';
import NavBar from './Components/NavBar/NavBar';
import { Routes, Route } from 'react-router-dom';
import './App.css';

//screens
import AsteriskPathFinding from './Screens/AsteriskPathFinding/AsteriskPathFinding';
import Dijkstra from './Screens/Dijkstra/Dijkstra';

const rows = 20;
const columns = 20;

export const AppContext = createContext(); //create a context to easily pass values to child elements

function App() {
  const [grid, setGrid] = useState(null); //the grid of nodes that will be used in the algorithms
  const [animationDuration, setAnimationDuration] = useState(0); //how fast the algorithm will run
  const [disabled, setDisabled] = useState(false); //whether or not some buttons are disabled 
  const [isDisabled, setIsDisabled] = useState({
    "loadButton": false,
    "saveButton": false,
  })
  const [showGridInput, setShowGridInput] = useState(false); //whether the input for typing the name of the grid you want to save is visible
  const [showSelector, setShowSelector] = useState(false); //whether the drop-down menu of saved grids is visible
  const [savedGrids, setSavedGrids] = useState(null);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  let durationInterval = useRef(null);
  let algorithmState = useRef("unbegun"); //a mutable value that tells the holds the state of the algorithm. 
  //unbegan if it has not started yet
  //pending if algorithm is currently running
  //finished if either algorithm either has normally ended, or manually stopped
  const gridNameInputRef = useRef(null);

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


  const getStatus = (row, column) => {
    if (grid === null) return "unblocked";
    return grid[row][column].getStatus();
  }


  const handleLoadButton = () => {
    setShowSelector(prev => !prev);
  }


  const handleSaveButton = () => {
    setShowGridInput(prev => !prev);
  }


  const loadSavedGrids = () => {
    const grids = JSON.parse(localStorage.getItem("grids"));
    return grids === null ? {} : grids;
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


  const saveGrid = () => {
    const newName = gridNameInputRef.current.value; //take the name of the grid we want to save
    if (newName === "") { //empty name
      alert("The name of the grid is empty. Try typing a name for the grid you want to save.");
    }
    let grids = JSON.parse(localStorage.getItem("grids")); //all the saved grids
    if (grids !== null) {
      if (Object.keys(grids).find(name => name === newName)) { //grid with name already takenn
        alert("There is already a grid with the same name.");
        return;
      } else {
        grids[newName] = deconstructGrid(grid); //create a 2d array with the the first letter of all the nodes of the current grid and put it in the grids object
        setSavedGrids(grids);
        localStorage.setItem("grids", JSON.stringify(grids)); //save the object in the local storage
      }
    } else {
      //first create the grids object and then do the same job
      grids = {};
      grids[newName] = deconstructGrid(grid);
      setSavedGrids(grids);
      localStorage.setItem("grids", JSON.stringify(grids));
    }
    setShowGridInput(false);
  }


  const sleep = async (duration) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(`${duration / 1000} seconds have passed.`);
      }, duration)
    })
  }


  const visualizePath = async (source, destination) => {
    let current, parent, resolvedValue;
    let changes = [];
    current = destination;
    changes.push({row: current.getRow(), column: current.getColumn(), status: "destination"});
    performGridChanges(changes);
    parent = current.getParent();
    while (parent !== null && (algorithmState.current === "pending" || algorithmState.current === "paused")) {
      changes = [];
      current = parent;
      changes.push({row: current.getRow(), column: current.getColumn(), status: "path"});
      performGridChanges(changes);
      parent = current.getParent();
      await sleep(animationDuration);

      if (algorithmState.current === "paused") {
        resolvedValue = await pause();
      }      
    }
    if (algorithmState.current === "pending") {
      changes.push({row: current.getRow(), column: current.getColumn(), status: "source"});
      performGridChanges(changes);
      clearInterval(durationInterval.current);
      durationInterval.current = null;
      algorithmState.current = "finished";
      setDisabled(false);
      setIsDisabled(prev => {
        return {...prev, "loadButton": false}
      })
    }
  }

  return (
    <AppContext.Provider value={{ algorithmState, animationDuration, calculateDistance, columns, computeNeighbours, destination, disabled, 
      durationInterval, getStatus, grid, gridNameInputRef, handleLoadButton, handleSaveButton, isDisabled, loadSavedGrids, pause, 
      performGridChanges, rows, savedGrids, saveGrid, setAnimationDuration, setDestination, setDisabled, setGrid, setIsDisabled, setSavedGrids, 
      setShowGridInput, setShowSelector, setSource, showGridInput, showSelector, sleep, source, visualizePath}}>
      <NavBar/>
      <Routes>
        <Route exact path="/asterisk" element={<AsteriskPathFinding/>}/>
        <Route path="/dijkstra" element={<Dijkstra/>}/>
        <Route path="*" element={<AsteriskPathFinding/>}/>
      </Routes>
    </AppContext.Provider>
  );
}

export default App;  


