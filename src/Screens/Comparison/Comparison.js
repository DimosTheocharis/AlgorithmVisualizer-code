import React, { useState, useEffect, useContext } from 'react';
import Selector from '../../Components/Selector/Selector';
import { AppContext } from '../../App';
import ComparisonCSS from './Comparison.module.css';

const dictionary = {
    "B": "blocked",
    "D": "destination",
    "E1": "evaluated",
    "E2": "evaluating",
    "P": "path",
    "S": "source",
    "U": "unblocked",
  }

function Comparison() {
    //the screen will display snapshots of algorithms for the grid with the same name as the selectedGridName
    const { columns, rows, savedGrids, selectedGridName, setSavedGrids, setSelectedGridName, setSnapshots, snapshots, } = useContext(AppContext);
    const [asteriskSnapshot, setAsteriskSnapshot] = useState(null); //the snapshot of the selected grid for the algorithm Asterisk
    const [dijkstraSnapshot, setDijkstraSnapshot] = useState(null); //the snapshot of the selected grid for the algorithm Dijkstra


    useEffect(() => {
        setSelectedGridName("");
    }, [])

    const determineAsteriskPlaceholder = () => {
        //determines what react code will be displayed at the placeholder for the grid of the asterisk algorithm
        if (selectedGridName === "") {
            return (
                <p className={ComparisonCSS.placeholderText}>Select a grid from the selector.</p>
            )
        }
        if (asteriskSnapshot === null) {
            return (
                <p className={ComparisonCSS.placeholderText}>
                    It seems that you don't have a snapshot of the grid: "{selectedGridName}" for the algorithm "Asterisk".
                    Go to the screen "Asterisk", select this grid and click "Take snapshot". Then try again here.
                </p>
            )
        } else {
            //returns 20x20 grid of blocks
            console.log(asteriskSnapshot);
            return (
                <div className={ComparisonCSS.grid}>
                    {
                        asteriskSnapshot.map((row, index1) => {
                            return row.map((block, index2) => {
                                return (
                                    <div className={`${ComparisonCSS.block} ${ComparisonCSS[dictionary[block]]}`} key={index1 * columns + index2}></div>
                                )
                            })
                        })
                    }
                </div>
            )
        }
    }


    const determineDijkstraPlaceholder = () => {
        //determines what react code will be displayed at the placeholder for the grid of the dijkstra algorithm
        if (selectedGridName === "") {
            return (
                <p className={ComparisonCSS.placeholderText}>Select a grid from the selector.</p>
            )
        }
        if (dijkstraSnapshot === null) {
            return (
                <p className={ComparisonCSS.placeholderText}>
                    It seems that you don't have a snapshot of the grid: "{selectedGridName}" for the algorithm "Dijkstra".
                    Go to the screen "Dijkstra", select this grid and click "Take snapshot". Then try again here.
                </p>
            )
        } else {
            //returns 20x20 grid of blocks
            return (
                <div className={ComparisonCSS.grid}>
                    {
                        dijkstraSnapshot.map((row, index1) => {
                            return row.map((block, index2) => {
                                return (
                                    <div className={`${ComparisonCSS.block} ${ComparisonCSS[dictionary[block]]}`} key={index1 * columns + index2}></div>
                                )
                            })
                        })
                    }
                </div>
            )
        }
    }


    const handleDeleteGrid = (gridName) => {
        //the function that will be called when a user deletes a grid from the selector
        
        //delete the grid of the gridName from the grids and save the change to localStorage
        const newGrids = {...savedGrids};
        delete newGrids[gridName];
        setSavedGrids(newGrids);
        localStorage.setItem("grids", JSON.stringify(newGrids));

        //delete the snapshot of the gridName from the grids and save the change to localStorage
        const newSnaps = {...snapshots};
        delete newSnaps["Asterisk"][gridName];
        delete newSnaps["Dijkstra"][gridName];
        setSnapshots(newSnaps);
        localStorage.setItem("snapshots", JSON.stringify(newSnaps));
    }
    

    const handleSelectGrid = (gridName) => {
        //the function that will be called when the user selects a grid from the selector
        
        //process for Asterisk algorithm
        let snapshotIndex = Object.keys(snapshots["Asterisk"]).findIndex(item => item === gridName);
        let snapshot = snapshotIndex === -1 ? null : snapshots["Asterisk"][gridName];
        setAsteriskSnapshot(snapshot);

        //process for Dijkstra algorithm
        snapshotIndex = Object.keys(snapshots["Dijkstra"]).findIndex(item => item === gridName);
        snapshot = snapshotIndex === -1 ? null : snapshots["Dijkstra"][gridName];
        setDijkstraSnapshot(snapshot);
    }


    return (
        <div className={ComparisonCSS.container}>
            <div className={ComparisonCSS.algorithmsContainer}>
                <div className={`${ComparisonCSS.algorithmContainer} ${ComparisonCSS.algorithmLeft}`}>
                    <h2 className={ComparisonCSS.algorithmTitle}>Asterisk</h2>
                    <div className={ComparisonCSS.gridPlaceholder}>
                        {determineAsteriskPlaceholder()}
                    </div>
                </div>
                <div className={`${ComparisonCSS.algorithmContainer} ${ComparisonCSS.algorithmRight}`}>
                    <h2 className={ComparisonCSS.algorithmTitle}>Dijkstra</h2>
                    <div className={ComparisonCSS.gridPlaceholder}>
                        {determineDijkstraPlaceholder()}
                    </div>
                </div>           
            </div>
            <div className={ComparisonCSS.loadGridContainer}>
                <Selector
                  grids={savedGrids} 
                  gridsName="grids" 
                  handleSelectGrid={handleSelectGrid} 
                  handleDeleteGrid={handleDeleteGrid} 
                  showSelector={true}
                />
            </div>
        </div>
    )
}

export default Comparison;