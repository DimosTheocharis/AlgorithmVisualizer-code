import React from 'react';
import Setting from '../Setting/Setting';
import SettingsCSS  from './Settings.module.css';

function Settings({showSettings, settings}){
    return (
        <div className={`${SettingsCSS.container} ${!showSettings ? SettingsCSS.containerHidden : null}`}>
            <h2 className={SettingsCSS.title}>Settings</h2>

            <div className={SettingsCSS.settingsSection}>
                {
                    settings.map((setting, index) => {
                        return (
                            <Setting title={setting.title} toggleFunction={setting.toggleFunction} enabled={setting.enabled} key={index}/>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Settings;