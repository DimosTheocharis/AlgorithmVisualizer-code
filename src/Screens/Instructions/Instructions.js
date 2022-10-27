import React from 'react';
import InstructionsCSS from './Instructions.module.css';

function Instructions() {
    return (
        <div className={InstructionsCSS.container}>
            <section className={InstructionsCSS.section}>
                <div className={InstructionsCSS.sectionTitle}>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                    <h2 className={InstructionsCSS.sectionTitleText}>ABOUT</h2>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                </div>
                <div className={InstructionsCSS.sectionContent}>
                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>General</h3>
                        <p className={InstructionsCSS.pieceText}>
                            <p className={`${InstructionsCSS.textMedium} ${InstructionsCSS.textItalic}`}>Algorithm's Visualizer</p> is an app that shows how the algorithms work.
                            At the current time the app visualizes 2 path-finding algorithms: <p className={InstructionsCSS.textItalic}>A*(Asterisk)</p> and <p className={InstructionsCSS.textItalic}>Dijkstra</p>.
                            It is consisted of 4 screens: 2 screens for the algorithms, one used to compare them, and the current screen. The algorithms run with the most efficient way:
                            they use appropriate data structures like Priority Queue implemented as min heap, and AVL tree. The goal of this app is to implement the knowledge i learnt about
                            data structures and algorithms from a course at univercity.
                        </p>
                    </div>

                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>Functionality</h3>
                        <p className={InstructionsCSS.pieceText}>
                            Both path-finding algorithms work in the same way. First, you click a cell where you want to place the source-cell <div className={InstructionsCSS.blockSource}/>.
                            After that, you place the destination-cell <div className={InstructionsCSS.blockDestination}/>. Eventually, you may put some cells that represent obstacles <div className={InstructionsCSS.blockBlocked}/> which 
                            the path <div className={InstructionsCSS.blockPath}/> can't reach. When you are done, click Start and the algorithm will start running. You can always click Pause to think about the next move of the algorithm
                            by yourself. Also, it is possible to adjust the speed of the algorithm, ie how fast it runs, with the slider between the buttons.
                        </p>
                        <br/>
                        <p className={InstructionsCSS.pieceText}>
                            The app supports a load/save system. You can draw a grid that consists of source, destination and obstacles and then save it with a custom name 
                            so as to use it for future needs, or at different algorithm.
                        </p>

                    </div>
                </div>
            </section>


            <section className={InstructionsCSS.section}>
                <div className={InstructionsCSS.sectionTitle}>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                        <h2 className={InstructionsCSS.sectionTitleText}>ASTERISK</h2>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                </div>
                <div className={InstructionsCSS.sectionContent}>
                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>General</h3>
                        <p className={InstructionsCSS.pieceText}>
                            <p className={`${InstructionsCSS.textMedium} ${InstructionsCSS.textItalic}`}>Asterisk</p> is a path-finding algorithm which means that it finds the shortest path <div className={InstructionsCSS.blockPath}/> from
                            the source node <div className={InstructionsCSS.blockSource}/> to the destination node <div className={InstructionsCSS.blockDestination}/>. Every node has
                            3 values:
                            <ul className={InstructionsCSS.list}>
                                <li className={InstructionsCSS.listItem}>
                                    <p className={InstructionsCSS.textUnderline}>Value-g</p>: The movement cost from the source node <div className={InstructionsCSS.blockSource}/> to the destination node <div className={InstructionsCSS.blockDestination}/> following 
                                    the path <div className={InstructionsCSS.blockPath}/> generated to get there.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    <p className={InstructionsCSS.textUnderline}>Value-h</p>: The estimated movement cost from the source node <div className={InstructionsCSS.blockSource}/> to the destination node <div className={InstructionsCSS.blockDestination}/>. It is referred
                                    as "heuristic" which is nothing but a kind of smart guess. We really don’t know the actual distance until we find the path <div className={InstructionsCSS.blockPath}/>, because all sorts of things can be in the way like blocked nodes <div className={InstructionsCSS.blockBlocked}/>.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    <p className={InstructionsCSS.textUnderline}>Value-f</p>: The sum of value-g and value-h.
                                </li>
                            </ul>
                        </p>
                    </div>

                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>Algorithm</h3>
                        <p className={InstructionsCSS.pieceText}>
                            The idea is that in every step the algorithm chooses the node with the smallest value-f, where value-f = value-g + value-h.
                            We create two lists, a) open-list, b) closed-list. Inside of the open-list there are the nodes that are currently been evaluating <div className={InstructionsCSS.blockEvaluating}/> and 
                            inside of the closed-list there are the nodes that have already been evaluated <div className={InstructionsCSS.blockEvaluated}/>. The algorithm follows these steps: 
                            <ol className={InstructionsCSS.list}>
                                <li className={InstructionsCSS.listItem}>
                                    Initialize the open list.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    Initialize the closed list. Put the source node <div className={InstructionsCSS.blockSource}/> inside.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    While the open list is not empty repeat: 
                                    <ol className={InstructionsCSS.listAlphabetical}>
                                        <li className={InstructionsCSS.listItem}>
                                            Find the node with the smallest value-f in the open-list, let it be q.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Pop q off the open list.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Generate q's 8 successors (neighbours at all directions) and set their parent to q. 
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            For every sussessor:
                                            <ol className={InstructionsCSS.listRoman}>
                                                <li className={InstructionsCSS.listItem}>
                                                    If successor is the goal, stop search.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    Otherwise, compute the value-g and value-h of the sussessor where:
                                                    <ul className={InstructionsCSS.list}>
                                                        <li className={InstructionsCSS.listItem}>
                                                            Value-g is the sum of the q's value-g and the distance between q and successor.
                                                        </li>
                                                        <li className={InstructionsCSS.listItem}>
                                                            Value-h is the distance between the sussessor and the destination node <div className={InstructionsCSS.blockDestination}/>.
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    If there is a node at the open-list with the same position as the successor and has lower value-f than him, the skip this successor.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    If there is a node at the closed-list with the same position as the successor and has lower value-f than him, then skip this successor.
                                                    Otherwise, insert the successor at the open-list. 
                                                </li>   
                                            </ol>
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Insert the q at the closed-list.
                                        </li>   
                                    </ol>
                                </li>
                            </ol>
                        </p>
                    </div>
                </div>
            </section>


            <section className={InstructionsCSS.section}>
                <div className={InstructionsCSS.sectionTitle}>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                    <h2 className={InstructionsCSS.sectionTitleText}>Dijkstra</h2>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                </div>
                <div className={InstructionsCSS.sectionContent}>
                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>General</h3>
                        <p className={InstructionsCSS.pieceText}>
                            Like <p className={`${InstructionsCSS.textMedium} ${InstructionsCSS.textItalic}`}>Asterisk</p>, <p className={`${InstructionsCSS.textMedium} ${InstructionsCSS.textItalic}`}>Dijkstra</p> is 
                            a path-finding algorithm. Every node has a property named value-d which is an estimation of the actual distance between this node and the source node <div className={InstructionsCSS.blockSource}/>. 
                            For every node v it is true that v.valueD {">="} distance(source node, v) and only when the node v becomes evaluated <div className={InstructionsCSS.blockEvaluated}/> will they be equal.
                        </p>
                    </div>

                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>Algorithm</h3>
                        <p className={InstructionsCSS.pieceText}>
                            The idea is that we have a set S which keeps track of the nodes included at the shortest path <div className={InstructionsCSS.blockPath}/> between the source node <div className={InstructionsCSS.blockSource}/> and the destination
                            node <div className={InstructionsCSS.blockDestination}/>. The algorithm follows these steps:
                            <ol className={InstructionsCSS.list}>
                                <li className={InstructionsCSS.listItem}>
                                    Initialize the set S as empty. The nodes inside S are the ones whose minimum distance from the source is calculated and finalized.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    Set infinite as the value-d of all vertices except the source node <div className={InstructionsCSS.blockSource}/> which should be 0.
                                </li>   
                                <li className={InstructionsCSS.listItem}>
                                    While the destination source <div className={InstructionsCSS.blockDestination}/> has not been found:
                                    <ol className={InstructionsCSS.listAlphabetical}>
                                        <li className={InstructionsCSS.listItem}>
                                            Pick a vertex u which is not there in S and has a minimum value-d.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Insert u into S.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Generate u's 8 successors.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            For every sussessor that is neither obstacle <div className={InstructionsCSS.blockBlocked}/> nor evaluated node <div className={InstructionsCSS.blockEvaluated}/>:
                                            <ol className={InstructionsCSS.listRoman}>
                                                <li className={InstructionsCSS.listItem}>
                                                    Mark the node as evaluating <div className={InstructionsCSS.blockEvaluating}/> (it is going to be evaluted).
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    For every sussessor v, if the sum of u.valueD and distance(u, v), 
                                                    is less than the value-d of v, then update the value-d of v and set u as the parent of v.
                                                </li>
                                            </ol>
                                        </li>
                                    </ol>
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    When the algorithm finishes, the shortest path <div className={InstructionsCSS.blockPath}/> can be found by starting from the destination node <div className={InstructionsCSS.blockDestination}/> and going back torwards
                                    source node <div className={InstructionsCSS.blockSource}/> by using the property "parent".
                                </li>

                            </ol>
                        </p>
                    </div>

                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>Notes</h3>
                        <p className={InstructionsCSS.pieceText}>
                            <ol className={InstructionsCSS.list}>
                                <li className={InstructionsCSS.listItem}>
                                    The set S can be represented in many ways. In my code, i set a property "status" for every node, and the ones that have status="evaluated"
                                    form the set S.
                                </li>
                                <li className={InstructionsCSS}>
                                    The selection of the node with the minimun value-d (step 3a) can be done by inserting all nodes that are going to be evaluating <div className={InstructionsCSS.blockEvaluating}/> to
                                    a Priority Queue implemented as min heap and use the extract-min method.
                                </li>
                            </ol>
                        </p>
                    </div>
                </div>
            </section>


            <section className={InstructionsCSS.section}>
                <div className={InstructionsCSS.sectionTitle}>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                    <h2 className={InstructionsCSS.sectionTitleText}>Comparison</h2>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                </div>
                <div className={InstructionsCSS.sectionContent}>
                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>General</h3>
                        <p className={InstructionsCSS.pieceText}>
                            Comparison is the screen where you can compare the shortest paths <div className={InstructionsCSS.blockPath}/> between a source node <div className={InstructionsCSS.blockSource}/> and 
                            a destination node <div className={InstructionsCSS.blockDestination}/> generated by the algorithms <p className={`${InstructionsCSS.textMedium} ${InstructionsCSS.textItalic}`}>Asterisk</p> and <p className={`${InstructionsCSS.textMedium} ${InstructionsCSS.textItalic}`}>Dijkstra</p>. 
                            You can only compare paths <div className={InstructionsCSS.blockPath}/> generated from saved grids. In order to see the differences of the 2 algorithms at a 
                            certain grid X, you should follow these steps:
                            <ol className={InstructionsCSS.list}>
                                <li className={InstructionsCSS.listItem}>
                                    Go to Asterisk screen and load the grid X.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    Run the algorithm and when it ends click Take snapshot. Snapshots are 20x20 grids that store the status of the nodes of the actual grids.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    Repeat the previous steps for the screen Dijkstra.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    Go to the Comparison screen and select the grid X from the selector at the bottom of the screen.
                                </li>
                            </ol>
                        </p>
                    </div>
                </div>
            </section>

            
            <section className={InstructionsCSS.section}>
                <div className={InstructionsCSS.sectionTitle}>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                    <h2 className={InstructionsCSS.sectionTitleText}>Bubble Sort</h2>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                </div>
                <div className={InstructionsCSS.sectionContent}>
                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>General</h3>
                        <p className={InstructionsCSS.pieceText}>
                            <p className={`${InstructionsCSS.textMedium} ${InstructionsCSS.textItalic}`}>Bubble Sort</p> is a sorting algorithm 
                                that compares two adjacent elements and swaps them until they are in the intended order. The elements here are bars inside a board.
                                Each bar has a value (height) that is used to determine the tallest bar between 2 bars.
                        </p>
                    </div>

                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>Algorithm</h3>
                        <p className={InstructionsCSS.pieceText}>
                            The idea of the algorithm is to run n-1 times, where n is the number of bars and at each iteration one bar is placed <div className={InstructionsCSS.barPlaced}/> at 
                            the correct spot. The algorithm follows these steps: 
                            <ol className={InstructionsCSS.list}>
                                <li className={InstructionsCSS.listItem}>
                                    Initialize i = 0;
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    <ol className={InstructionsCSS.listAlphabetical}>
                                        <li className={InstructionsCSS.listItem}>
                                            Initialize j = n - 1;
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Start from the end of the board and compare the bar at index j with its previous. These bars are now being examined <div className={InstructionsCSS.barExamining}/>.
                                        </li>   
                                        <li className={InstructionsCSS.listItem}>
                                            If the bars are at the desired order, then continue. Otherwise, swap them.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Decrement j and repeat the process examining 2 adjacent bars until you reach the bar at the position i.
                                        </li>
                                    </ol>
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    When you are done, the bar at index i is placed at the correct spot. Mark it as placed <div className={InstructionsCSS.barPlaced}/>.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    Increment i and repeat the process at steps 2 to 4 until i == n.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    Now the entire board is sorted. 
                                </li>
                            </ol>
                        </p>
                    </div>
                </div>
            </section>


            <section className={InstructionsCSS.section}>
                <div className={InstructionsCSS.sectionTitle}>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                    <h2 className={InstructionsCSS.sectionTitleText}>Selection Sort</h2>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                </div>
                <div className={InstructionsCSS.sectionContent}>
                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>General</h3>
                        <p className={InstructionsCSS.pieceText}>
                            <p className={`${InstructionsCSS.textMedium} ${InstructionsCSS.textItalic}`}>Selection Sort</p> is a sorting algorithm which repeatedly finds the minimun 
                                element from the unsorted part and places <div className={InstructionsCSS.barPlaced}/> it at the beginning. The elements here are bars inside a board.
                                Each bar has a value (height) that is used to determine the tallest bar between 2 bars.
                        </p>
                    </div>

                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>Algorithm</h3>
                        <p className={InstructionsCSS.pieceText}>
                            The idea of the algorithm is that we maintain 2 sub-boards of the original board. The algorithm runs n-1 times, where n is the number of bars and at each iteration 
                            one bar is placed <div className={InstructionsCSS.barPlaced}/> at the correct spot. The sub-boards are:
                            <ul className={InstructionsCSS.list}>
                                <li className={InstructionsCSS.listItem}>
                                    The sub-board which is already sorted.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    The sub-board which has not been sorted yet.
                                </li>
                            </ul>
                            At each iteration, the shortest bar from the unsorted sub-board is picked and placed at the sorted sub-board. The algorithm follows these steps: 
                            <ol className={InstructionsCSS.list}>
                                <li className={InstructionsCSS.listItem}>
                                    Initialize i = 0.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    Repeat until i = n - 1:
                                    <ol className={InstructionsCSS.listAlphabetical}>
                                        <li className={InstructionsCSS.listItem}>
                                            Set the bar at index i as minimum <div className={InstructionsCSS.barMinimum}/>.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Initialize j = i + 1.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Repeat the following process until j = n:
                                            <ol className={InstructionsCSS.listRoman}>
                                                <li className={InstructionsCSS.listItem}>
                                                    Check if the bar at index j is shorter than minimum <div className={InstructionsCSS.barMinimum}/>. Set the status of this bar as 
                                                    examining <div className={InstructionsCSS.barExamining}/>.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    If the bar at index j is shorter than minimum <div className={InstructionsCSS.barMinimum}/>, then set it as 
                                                    the new minimum <div className={InstructionsCSS.barMinimum}/>. Otherwise, continue.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    Increment j.
                                                </li>
                                            </ol>
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Now we have the shortest bar from the unsorted sub-board (minimum <div className={InstructionsCSS.barMinimum}/>).
                                            We also have the bar at index i which is marked as pre-placed <div className={InstructionsCSS.barPrePlaced}/> because i is the position where the minimum
                                            bar <div className={InstructionsCSS.barMinimum}/> is going to be placed <div className={InstructionsCSS.barPlaced}/>.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Swap them. Now bar at index i is placed <div className={InstructionsCSS.barPlaced}/> at the correct spot.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Increment i.
                                        </li>
                                    </ol>
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    Finally, the first n-1 bars are placed <div className={InstructionsCSS.barPlaced}/> at the correct spot resulting also at the correct placing 
                                    of the last bar. Board is sorted.
                                </li>
                            </ol>
                        </p>
                    </div>
                </div>
            </section>


            <section className={InstructionsCSS.section}>
                <div className={InstructionsCSS.sectionTitle}>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                    <h2 className={InstructionsCSS.sectionTitleText}>Insertion Sort</h2>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                </div>
                <div className={InstructionsCSS.sectionContent}>
                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>General</h3>
                        <p className={InstructionsCSS.pieceText}>
                            <p className={`${InstructionsCSS.textMedium} ${InstructionsCSS.textItalic}`}>Insertion Sort</p> is a sorting algorithm that works similar to the way you sort playing cards 
                            in your hands. The array is virtually split into a sorted and an unsorted part. Values from the unsorted part are picked and placed <div className={InstructionsCSS.barPlaced}/> at the correct position in the sorted part.
                            The elements here are bars inside a board. Each bar has a value (height) that is used to determine the tallest bar between 2 bars.
                        </p>
                    </div>

                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>Algorithm</h3>
                        <p className={InstructionsCSS.pieceText}>
                            The idea of the algorithm is that we maintain 2 sub-boards of the original board. The algorithm runs n-1 times, where n is the number of bars and at each iteration one bar is placed 
                            at the correct spot. The sub-boards are:
                            <ul className={InstructionsCSS.list}>
                                <li className={InstructionsCSS.listItem}>
                                    The sub-board which is already sorted.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    The sub-board which has not been sorted yet.
                                </li>
                            </ul>
                            At each iteration, the first bar from the unsorted sub-board is picked and placed at the sorted sub-board. The algorithm follows these steps: 
                            <ol className={InstructionsCSS.list}>
                                <li className={InstructionsCSS.listItem}>
                                    Initialize i = 1.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    Repeat until i = n:
                                    <ol className={InstructionsCSS.listAlphabetical}>
                                        <li className={InstructionsCSS.listItem}>
                                            Initialize z = i - 1.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Mark the bar at index i as pre-placed <div className={InstructionsCSS.barPrePlaced}/> because this particular bar is going to be 
                                            placed <div className={InstructionsCSS.barPlaced}/> at the correct position inside sorted sub-board in this iteration. The bar at index i is now called as key. 
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Repeat the following process while j {'>'} 0 and the bar at index j is bigger than key:
                                            <ol className={InstructionsCSS.listRoman}>
                                                <li className={InstructionsCSS.listItem}>
                                                    Mark the bar at index j as examining <div className={InstructionsCSS.barExamining}/>. This bar is bigger than key so we want to 
                                                    move it to the right in order for the key to be placed <div className={InstructionsCSS.barPlaced}/> at the correct position of 
                                                    the sorted sub-board.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    Mark the bar at index j + 1 as 'copied' <div className={InstructionsCSS.barCopied}/>. The bar at index j will move to the right
                                                    by letting the bar at the right, (j + 1), to copy its height.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    Set the height of the bar at index j + 1 as the height of the bar at index j.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    Decrement j.
                                                </li>
                                            </ol>
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            When we are done, the bar at index j + 1 will be the leftmost bar whose value is bigger thank key's value. Mark it as minimum <div className={InstructionsCSS.barMinimum}/>.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Put the key bar in the index j + 1.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Now the bars from index 0 to index i are placed <div className={InstructionsCSS.barPlaced}/> correctly, ie the sub-board [0-i] is sorted.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Increment i.
                                        </li>
                                    </ol>
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    Now the bars from index 0 to index i are placed <div className={InstructionsCSS.barPlaced}/> correctly, ie the whole board [0-i] is sorted.
                                </li>
                            </ol>
                        </p>
                    </div>
                </div>
            </section>


            <section className={InstructionsCSS.section}>
            <div className={InstructionsCSS.sectionTitle}>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                    <h2 className={InstructionsCSS.sectionTitleText}>Merge Sort</h2>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                </div>
                <div className={InstructionsCSS.sectionContent}>
                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>General</h3>
                        <p className={InstructionsCSS.pieceText}>
                            <p className={`${InstructionsCSS.textMedium} ${InstructionsCSS.textItalic}`}>Merge Sort</p> is a recursive sorting algorithm which works by dividing the array we are working on
                                into two equal halves and then they are combined in a sorted manner. The elements here are bars inside a board. Each bar has a value (height) that is used to determine the 
                                tallest bar between 2 bars.
                        </p>
                    </div>

                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>Algorithm</h3>
                        <p className={InstructionsCSS.pieceText}>
                            The idea of the algorithm is that we are constantly dividing the board in halves until it can not be further splitted. This means that when the sub-board has only one or zero bars, the 
                            division will stop. With other words, if the sub-board has many bars (2+), we divide it in 2 halves and then call Merge Sort for each of the half. When both halves are finally
                            sorted <div className={InstructionsCSS.barPlaced}/>, merge operation is applied. Merge operation is the process of combining 2 sorted sub-boards into one board which will be also 
                            sorted <div className={InstructionsCSS.barPlaced}/>. Assume that the original board has n bars.
                            The algorithm follows these steps:

                            <ol className={InstructionsCSS.list}>
                                <li className={InstructionsCSS.listItem}>
                                    Call Merge Sort with parameters:
                                    <ul className={InstructionsCSS.list}>
                                        <li className={InstructionsCSS.listItem}>
                                            Sub-board: the entire board.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            <p className={InstructionsCSS.textGreen}>Left</p>: 0.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            <p className={InstructionsCSS.textRed}>Right</p>: n - 1.
                                        </li>
                                    </ul>
                                    <p className={InstructionsCSS.textGreen}>Left</p> and <p className={InstructionsCSS.textRed}>Right</p> denote the start and end of the sub-board we are working on respectively.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    Repeat the following process recursively, until the sub-board we are working on cannot be further diveded:
                                    <ol className={InstructionsCSS.listAlphabetical}>
                                        <li className={InstructionsCSS.listItem}>
                                            If <p className={InstructionsCSS.textRed}>Right</p> {'>'} <p className={InstructionsCSS.textGreen}>Left</p> compute 
                                            mid = (<p className={InstructionsCSS.textGreen}>Left</p> + <p className={InstructionsCSS.textRed}>Right</p>) / 2. This 
                                            is the index of the middle bar of the given sub-board. Else, return the given sub-board.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Compute the left and right sub-boards which are the board [<p className={InstructionsCSS.textGreen}>Left</p>, mid] and 
                                            [mid + 1, <p className={InstructionsCSS.textRed}>Right</p>] respectively. 
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Call Merge Sort with parameters:
                                            <ul className={InstructionsCSS.list}>
                                                <li className={InstructionsCSS.listItem}>
                                                    Sub-board: the left sub-board.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    <p className={InstructionsCSS.textGreen}>Left</p>: <p className={InstructionsCSS.textGreen}>Left</p>.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    <p className={InstructionsCSS.textRed}>Right</p>: mid.
                                                </li>
                                            </ul>
                                            Save the result to left sub-board.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Call Merge Sort with parameters:
                                            <ul className={InstructionsCSS.list}>
                                                <li className={InstructionsCSS.listItem}>
                                                    Sub-board: the right sub-board.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    <p className={InstructionsCSS.textGreen}>Left</p>: mid + 1.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    <p className={InstructionsCSS.textRed}>Right</p>: <p className={InstructionsCSS.textRed}>Right</p>.
                                                </li>
                                            </ul>
                                            Save the result to right sub-board.
                                        </li>
                                    </ol>
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    As soon as the whole board has been divided into sub-boards with 0 or 1 bars due to the recursive calls of Merge Sort, the 
                                    merging proccess is applied. We saw that each call of Merge Sort for a certain sub-board calls Merge Sort for the left and right sub-boards
                                    of the given sub-board. Lets assume that:
                                    <ul className={InstructionsCSS.list}>
                                        <li className={InstructionsCSS.listItem}>GB is the given sub-board.</li>
                                        <li className={InstructionsCSS.listItem}>LB is the left sub-board.</li>
                                        <li className={InstructionsCSS.listItem}>RB is the right sub-board.</li>
                                    </ul>
                                    It is true that LB and RB united result to GB.
                                    After these 2 recursive calls mentioned above end, we do the following process:
                                    <ol className={InstructionsCSS.listAlphabetical}>
                                        <li className={InstructionsCSS.listItem}>
                                            Initialization:
                                            <ul className={InstructionsCSS.list}>
                                                <li className={InstructionsCSS.listItem}>
                                                    Initialize i = 0 which is the index that will be used for the LB.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    Initialize j = 0 which is the index that will be used for the RB.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    Initialize k = 0 which is the index that will be used for the GB.
                                                </li>
                                            </ul>
                                            We also assume that I and J are the lengths of LB and RB respectively.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            While i {'<'} I and j {'<'} J repeat:
                                            <ol className={InstructionsCSS.listRoman}>
                                                <li className={InstructionsCSS.listItem}>
                                                    Set the bars: LB[i] and RB[j] as examining <div className={InstructionsCSS.barExamining}/>.
                                                    We are going to examing which one is taller.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    If LB[i] {'<='} RB[j] then:
                                                    <ol className={InstructionsCSS.list}>
                                                        <li className={InstructionsCSS.listItem}>
                                                            Set GB[k] = LB[i]. Now GB[k] is placed <div className={InstructionsCSS.barPlaced}/>.
                                                        </li>
                                                        <li className={InstructionsCSS.listItem}>
                                                            Increment i.
                                                        </li>
                                                    </ol>
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    Else, ie LB[i] {'>'} RB[j] then:
                                                    <ol className={InstructionsCSS.list}>
                                                        <li className={InstructionsCSS.listItem}>
                                                            Set GB[k] = RB[j]. Now GB[k] is placed <div className={InstructionsCSS.barPlaced}/>.
                                                        </li>
                                                        <li className={InstructionsCSS.listItem}>
                                                            Increment j.
                                                        </li>
                                                    </ol>
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    Increment k.
                                                </li>
                                            </ol>
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            The next step is two put any bars left from the LB to GB. So, while i {'<'} I:
                                            <ol className={InstructionsCSS.listRoman}>
                                                <li className={InstructionsCSS.listItem}>
                                                    Set GB[k] = LB[i]. Now GB[k] is placed <div className={InstructionsCSS.barPlaced}/>.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    Increment i.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    Increment k.
                                                </li>
                                            </ol>
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            The next step is two put any bars left from the RB to GB. So, while j {'<'} J:
                                            <ol className={InstructionsCSS.listRoman}>
                                                <li className={InstructionsCSS.listItem}>
                                                    Set GB[k] = RB[j]. Now GB[k] is placed <div className={InstructionsCSS.barPlaced}/>.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    Increment j.
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    Increment k.
                                                </li>
                                            </ol>
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            By this far, sub-board [<p className={InstructionsCSS.textGreen}>Left</p>, <p className={InstructionsCSS.textRed}>Right</p>] 
                                            is sorted <div className={InstructionsCSS.barPlaced}/>.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Return GB.
                                        </li>
                                    </ol>
                                </li>
                            </ol>
                        </p>
                    </div>
                </div>
            </section>


            <section className={InstructionsCSS.section}>
                <div className={InstructionsCSS.sectionTitle}>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                    <h2 className={InstructionsCSS.sectionTitleText}>Quick Sort</h2>
                    <div className={InstructionsCSS.sectionTitleLine}/>
                </div>
                <div className={InstructionsCSS.sectionContent}>
                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>General</h3>
                        <p className={InstructionsCSS.pieceText}>
                            <p className={`${InstructionsCSS.textMedium} ${InstructionsCSS.textItalic}`}>Quick Sort</p> is a recursive sorting algorithm which picks an element as pivot and 
                                partitions the given array around pivot. The elements here are bars inside a board. Each bar has a value (height) that is used to determine the tallest bar between 2 bars.
                        </p>
                    </div>

                    <div className={InstructionsCSS.sectionContentPiece}>
                        <h3 className={InstructionsCSS.pieceTitle}>Algorithm</h3>
                        <p className={InstructionsCSS.pieceText}>
                            The key process of the algorithm is the partition procedure. The goal of partition is, given a board and a bar as a pivot, to put pivot at its correct position <div className={InstructionsCSS.barPlaced}/> in 
                            a sorted board and put all shorter bars before pivot and all taller bars after pivot. After that, we have to call quickSort for the sub-boards created before and after pivot.
                            The partition can be done by starting from the leftmost bar and keeping track of the index of shorter (or equal) bars than pivot. While traversing, if we find a bar that is shorter than pivot, we can swap It
                            with the bar at the index we saved before. Otherwise, continue. 
                            Assume that the original board has n bars. The algorithm follows these steps:
                            <ol className={InstructionsCSS.list}>
                                <li className={InstructionsCSS.listItem}>
                                    Call Quick Sort with parameters:
                                    <ul className={InstructionsCSS.list}>
                                        <li className={InstructionsCSS.listItem}>
                                            Sub-board: the entire sub-board.
                                        </li>                   
                                        <li className={InstructionsCSS.listItem}>
                                            <p className={InstructionsCSS.textGreen}>Left</p>: 0.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            <p className={InstructionsCSS.textRed}>Right</p>: n - 1.
                                        </li>
                                    </ul>
                                    <p className={InstructionsCSS.textGreen}>Left</p> and <p className={InstructionsCSS.textRed}>Right</p> denote the start and end of the sub-board we are working on respectively.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    Quick Sort works repeatedly like this. If <p className={InstructionsCSS.textGreen}>Left</p> {'<'} <p className={InstructionsCSS.textRed}>Right</p> then:
                                    <ol className={InstructionsCSS.listAlphabetical}>
                                       <li className={InstructionsCSS.listItem}>
                                            Call Partition with parameters:
                                            <ul className={InstructionsCSS.list}>
                                                <li className={Instructions.listItem}>
                                                    Sub-board: the given sub-board.
                                                </li>
                                                <li className={Instructions.listItem}>
                                                    <p className={InstructionsCSS.textGreen}>Left</p>: <p className={InstructionsCSS.textGreen}>Left</p>.
                                                </li>
                                                <li className={Instructions.listItem}>
                                                    <p className={InstructionsCSS.textRed}>Right</p>: <p className={InstructionsCSS.textRed}>Right</p>.
                                                </li>
                                            </ul>
                                            Save result to a variable named PI that is the index of the pivot.
                                       </li>
                                       <li className={InstructionsCSS.listItem}>
                                            Call Quick Sort with parameters:
                                            <ul className={InstructionsCSS.list}>
                                                <li className={Instructions.listItem}>
                                                    Sub-board: the given sub-board.
                                                </li>
                                                <li className={Instructions.listItem}>
                                                    <p className={InstructionsCSS.textGreen}>Left</p>: <p className={InstructionsCSS.textGreen}>Left</p>.
                                                </li>
                                                <li className={Instructions.listItem}>
                                                    <p className={InstructionsCSS.textRed}>Right</p>: PI - 1.
                                                </li>
                                            </ul>
                                       </li>
                                       <li className={InstructionsCSS.listItem}>
                                            Call Quick Sort with parameters:
                                            <ul className={InstructionsCSS.list}>
                                                <li className={Instructions.listItem}>
                                                    Sub-board: the given sub-board.
                                                </li>
                                                <li className={Instructions.listItem}>
                                                    <p className={InstructionsCSS.textGreen}>Left</p>: PI + 1.
                                                </li>
                                                <li className={Instructions.listItem}>
                                                    <p className={InstructionsCSS.textRed}>Right</p>: <p className={InstructionsCSS.textRed}>Right</p>.
                                                </li>
                                            </ul>
                                       </li>
                                    </ol>
                                    When all recursive calls of Quick Sort end, then the entire board will be sorted <div className={InstructionsCSS.barPlaced}/>.
                                </li>
                                <li className={InstructionsCSS.listItem}>
                                    It is obvious that each call of Quick Sort may call Partition function. Lets assume that: 
                                    <ul className={InstructionsCSS.list}>
                                        <li className={InstructionsCSS.listItem}>GB is the given sub-board.</li>
                                    </ul>
                                    Partition follows these steps:
                                    <ol className={InstructionsCSS.listAlphabetical}>
                                        <li className={InstructionsCSS.listItem}>
                                            Set pivot = GB[<p className={InstructionsCSS.textRed}>Right</p>].
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Initialize i = <p className={InstructionsCSS.textGreen}>Left</p> - 1.
                                            Initialize j = <p className={InstructionsCSS.textGreen}>Left</p>.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Set pivot as prePlaced <div className={InstructionsCSS.barPrePlaced}/> because this is the bar that is going to be
                                            placed <div className={InstructionsCSS.barPlaced}/> at the correct position in the sorted board.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            While j {'<'} <p className={InstructionsCSS.textRed}>Right</p> repeat:
                                            <ol className={InstructionsCSS.listRoman}>
                                                <li className={InstructionsCSS.listItem}>
                                                    Set GB[j] as examining <div className={InstructionsCSS.barExamining}/> because we are going to check if GB[j] is shorter than pivot. 
                                                    If GB[j] {'<'} pivot then:
                                                    <ol className={InstructionsCSS.list}>
                                                        <li className={InstructionsCSS.listItem}>
                                                            Increment i.
                                                        </li>
                                                        <li className={InstructionsCSS.listItem}>
                                                            Swap GB[i] with GB[j]. This is done because we want to put all bars that are shorter than pivot at its left side.
                                                        </li>
                                                    </ol>
                                                </li>
                                                <li className={InstructionsCSS.listItem}>
                                                    Increment j.
                                                </li>
                                            </ol>
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Increment i.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Swap pivot with GB[i]. 
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Set the status of pivot as placed <div className={InstructionsCSS.barPlaced}/> because now pivot is put at its correct position. All the bars
                                            that are shorter than pivot are at its left side, and all bars that are taller than pivot are at its right side.
                                        </li>
                                        <li className={InstructionsCSS.listItem}>
                                            Return i.
                                        </li>
                                    </ol>
                                </li>
                            </ol>
                        </p>
                    </div>
                </div>

            </section>
        </div>
    )
}

export default Instructions;