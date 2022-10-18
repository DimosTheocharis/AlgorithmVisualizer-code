import React, { useState } from 'react';
import { FaTools} from "react-icons/fa";
import PanelCSS from './Panel.module.css';

//This component is responsible for displaying messages about how sorting algorithms run ie what they do at each step

const colorOptions = [
    {"backgroundColor": "rgb(0,0,0)", "color": "rgb(230,230,200)", "borderColor": "rgb(230,230,200)", "colorOptionClass": "black"},
    {"backgroundColor": "rgb(40,20,0)", "color": "rgb(200,200,0)", "borderColor": "rgb(0,0,0)", "colorOptionClass": "brown"},
    {"backgroundColor": "rgb(0,20,40)", "color": "rgb(160,160,160)", "borderColor": "rgb(0,0,0)", "colorOptionClass": "blue"},
]

function Panel({messages}) {
    const [colorOption, setColorOption] = useState(colorOptions[0]); //the appearance colors of the panel that the user has selected
    const [showColorOptions, setShowColorOptions] = useState(false);

    const selectColorOption = (index) => {
        setColorOption(colorOptions[index]);
        setShowColorOptions(false);
    }

    const toggleTools = () => {
        setShowColorOptions(prev => !prev);
    }

    return (
        <div className={PanelCSS.container} style={{backgroundColor: colorOption["backgroundColor"], borderColor: colorOption["borderColor"]}}>
            <div className={PanelCSS.titleContainer} style={{borderBottomColor: colorOption["borderColor"]}}>
                <p className={PanelCSS.title} style={{color: colorOption["color"]}}>Panel</p>
            </div>
            <div className={PanelCSS.messageContainer}>
                {
                    messages.map((message, index) => {
                        return (
                            <p 
                                className={PanelCSS.message} 
                                style={{color: colorOption["color"]}}
                                key={index}
                            >
                                {message}
                            </p>
                        )
                    })
                }
            </div>
            <FaTools className={PanelCSS.icon} onClick={toggleTools}/>
            <div className={`${PanelCSS.colorOptions} ${showColorOptions ? null : PanelCSS.colorOptionsHidden}`}>
                {
                    colorOptions.map((option, index) => {
                        return (
                            <div 
                                className={`${PanelCSS.colorOption} ${PanelCSS[colorOption["colorOptionClass"]]}`} 
                                onClick={() => selectColorOption(index)}
                                key={index}
                            >
                                <p>{index + 1}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Panel;