import React, { useEffect, useRef, useState } from 'react';
import BarCSS from './Bar.module.css';

function Bar({ bar, deleteBar, editBoard, showHeight, showIndex }) {
    const [height, setHeight] = useState(bar.getValue());
    const resizableRef = useRef(null);
    const resizerRef = useRef(null);

    useEffect(() => {
        if (resizerRef.current === null) return;
        const barElement = resizableRef.current;
        const styles = window.getComputedStyle(barElement);
        let y = 0;
        let height = bar.getValue();


        const onMouseDownResizer = (event) => {
            y = event.clientY;
            barElement.style.bottom = styles.bottom;
            barElement.style.top = null;
            
            document.addEventListener("mousemove", onMouseMoveResizer);
            document.addEventListener("mouseup", onMouseUpResizer);
        }

        const onMouseMoveResizer = (event) => {
            const dy = y - event.clientY;
            height = height + dy;
            bar.setValue(height);
            setHeight(height);
            barElement.style.height = `${height}px`;
            y = event.clientY;
        }

        const onMouseUpResizer = () => {
            document.removeEventListener("mousemove", onMouseMoveResizer);
        }

        const resizerElement = resizerRef.current;
        resizerElement.addEventListener("mousedown", onMouseDownResizer);

        return () => {
            resizerElement.removeEventListener("mousedown", onMouseDownResizer);
        }
    }, [editBoard, bar])
    
    const determineBarTools = () => {
        if (editBoard) {
            return (
                <>
                    <div className={BarCSS.resizer} ref={resizerRef}/>
                    <div className={BarCSS.deleteButton} onClick={() => deleteBar(bar.getIndex())}>
                        <p className={BarCSS.deleteButtonText}>X</p>
                    </div>
                </>
            )
        } else {
            return null;
        }
    }

    return (
        <div className={`${BarCSS.container} ${BarCSS[bar.getStatus()]}`} style={{height: `${bar.getValue()}px`}} ref={resizableRef}>
            {
                showHeight 
                ? 
                    <p>{bar.getValue()}</p>
                :
                    null
            }
            {
                showIndex
                ?
                    <p className={BarCSS.index}>{bar.getIndex()}</p>
                :
                    null
            }
            {determineBarTools()}
        </div>
    )
}

export default Bar;