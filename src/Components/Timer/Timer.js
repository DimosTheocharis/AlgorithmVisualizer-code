import React from 'react';
import TimerCSS from './Timer.module.css';

function Timer({duration}) {
    const minutes = Math.floor(duration / 1000000);
    const seconds = (duration - minutes * 1000000) / 1000;
    return (
        <div className={TimerCSS.container}>
            <p className={TimerCSS.text}>{minutes} : {seconds < 10 ? `0${seconds}` : seconds}</p>
        </div>
    )
}

export default Timer;