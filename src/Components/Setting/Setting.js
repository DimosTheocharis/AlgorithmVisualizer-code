import React, { useState } from 'react';
import SettingCSS from './Setting.module.css';

function Setting({title, toggleFunction, enabled}) {

    const handleClick = () => {
        toggleFunction();
    }

    return (
        <div className={SettingCSS.container}>
            <p className={SettingCSS.title}>{title}</p>
            <div className={`${SettingCSS.bar} ${enabled ? SettingCSS.barEnabled : SettingCSS.barDisabled} `} onClick={handleClick}>
                <div className={`${SettingCSS.eye} ${enabled ? SettingCSS.eyeEnabled : SettingCSS.eyeDisabled}`}></div>
            </div>
        </div>
    )
}

export default Setting;