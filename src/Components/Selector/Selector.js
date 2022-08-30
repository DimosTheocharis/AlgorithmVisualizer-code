import React, { useState } from 'react';
import SelectorCSS from './Selector.module.css';

function Selector({showSelector}) {
    return (
        <div className={`${SelectorCSS.container} ${showSelector ? null : SelectorCSS.containerHidden}`}>
            hoo
        </div>
    )
}

export default Selector;