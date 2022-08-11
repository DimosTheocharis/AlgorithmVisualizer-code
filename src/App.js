import React, { useState, createContext, useRef } from 'react';
import Node from './Data Structures/Node';
import './App.css';

//screens
import AsteriskPathFinding from './Screens/AsteriskPathFinding/AsteriskPathFinding';
import Dijkstra from './Screens/Dijkstra/Dijkstra';

const rows = 20;
const columns = 20;

export const AppContext = createContext(); //create a context to easily pass values to child elements

function App() {
  const [grid, setGrid] = useState(null);  
  let algorithmState = useRef("unbegun"); //a mutable value that tells the holds the state of the algorithm. 
  //unbegan if it has not started yet
  //pending if algorithm is currently running
  //finished if either algorithm either has normally ended, or manually stopped

  const createGrid = () => {
    //gets called only at the first render of the app, and creates a default grid with blocks that are unblocked
    let startGrid = [];
    let i,j,row;
    for (i = 0; i < rows; i++) {
      row = [];
      for (j = 0; j < columns; j++) {
        row.push(new Node(i, j, "unblocked"));
      }
      startGrid.push(row);
    }
    setGrid(startGrid);
  }


  const getStatus = (row, column) => {
    if (grid === null) return "unblocked";
    return grid[row][column].getStatus();
  }



  return (
    <AppContext.Provider value={{rows, columns, createGrid, getStatus, grid, setGrid}}>
      <AsteriskPathFinding/>
    </AppContext.Provider>
  );
}

export default App;  


