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
  let durationInterval = useRef(null);
  let algorithmState = useRef("unbegun"); //a mutable value that tells the holds the state of the algorithm. 
  //unbegan if it has not started yet
  //pending if algorithm is currently running
  //finished if either algorithm either has normally ended, or manually stopped

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


  const getStatus = (row, column) => {
    if (grid === null) return "unblocked";
    return grid[row][column].getStatus();
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
    console.log("algorith state is: ", algorithmState.current);
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
    }
  }

  return (
    <AppContext.Provider value={{rows, algorithmState, animationDuration, calculateDistance, columns, computeNeighbours, disabled, durationInterval, getStatus, grid, pause, 
    performGridChanges, setAnimationDuration, setDisabled, setGrid, sleep, visualizePath}}>
      <NavBar/>
      <Routes>
        <Route path="/asterisk" element={<AsteriskPathFinding/>}/>
        <Route path="/dijkstra" element={<Dijkstra/>}/>
        <Route path="*" element={<AsteriskPathFinding/>}/>
      </Routes>
    </AppContext.Provider>
  );
}

export default App;  


