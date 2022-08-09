import React from 'react';
import TimerCSS from './Timer.module.css';

function Timer({duration}) {
    const minutes = duration / 1000000;
    const seconds = (duration - minutes * 1000000) / 1000;
    return (
        <div className={TimerCSS.container}>
            {minutes} : {seconds}
        </div>
    )
}

export default Timer;