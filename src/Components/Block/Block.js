import React, { useState} from 'react';

import BlockCSS from './Block.module.css';

function Block({handleClickBlock, status, row, column, valueG, valueH, valueF, showValueG, showValueH, showValueF}) {

    const handleClick = () => {
        handleClickBlock(row, column);
    }
    
    return (
        <div className={`${BlockCSS.container} ${BlockCSS[status]}`} onClick={handleClick}>
            {showValueG && <p className={BlockCSS.valueG}>{valueG}</p>}
            {showValueH && <p className={BlockCSS.valueH}>{valueH}</p>}
            {showValueF && <p className={BlockCSS.valueF}>{valueF}</p>}
        </div>
    )
}

export default Block;