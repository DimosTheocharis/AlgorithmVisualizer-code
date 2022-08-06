import React, { useState} from 'react';

import BlockCSS from './Block.module.css';

function Block({handleClickBlock, status, row, column, valueF, valueG}) {

    const handleClick = () => {
        handleClickBlock(row, column);
    }
    
    return (
        <div className={`${BlockCSS.container} ${BlockCSS[status]}`} onClick={handleClick}>
            <p className={BlockCSS.valueF}>{valueF}</p>
            <p className={BlockCSS.valueG}>{valueG}</p>
        </div>
    )
}

export default Block;