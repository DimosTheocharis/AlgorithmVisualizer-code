import React, { useState} from 'react';

import BlockCSS from './Block.module.css';

function Block({handleClickBlock, algorithm, status, row, column, valueG, valueH, valueF, valueD, showValueG, showValueH, showValueF, showValueD}) {

    const handleClick = () => {
        handleClickBlock(row, column);
    }
    
    if (algorithm === "Asterisk") {
        return (
            <div className={`${BlockCSS.container} ${BlockCSS[status]}`} onClick={handleClick}>
                {(showValueG && status !== "unblocked") && <p className={BlockCSS.valueG}>{valueG}</p>}
                {(showValueH && status !== "unblocked") && <p className={BlockCSS.valueH}>{valueH}</p>}
                {(showValueF && status !== "unblocked") && <p className={BlockCSS.valueF}>{valueF}</p>}
            </div>
        )
    } else if (algorithm === "Dijkstra") {
        return (
            <div className={`${BlockCSS.container} ${BlockCSS[status]}`} onClick={handleClick}>
                {(showValueD && status !== "unblocked") && <p className={BlockCSS.valueD}>{valueD}</p>}
            </div>
        )
    }
}

export default Block;