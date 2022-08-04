import React, { useState} from 'react';

import BlockCSS from './Block.module.css';

function Block({handleClickBlock, status, row, column, valueF}) {

    const handleClick = () => {
        handleClickBlock(row, column);
    }
    
    return (
        <div className={`${BlockCSS.container} ${BlockCSS[status]}`} onClick={handleClick}>
            <p className={BlockCSS.valueF}>{valueF}</p>
        </div>
    )
}

export default Block;