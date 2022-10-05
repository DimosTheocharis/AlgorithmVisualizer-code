import React , { useContext } from 'react';
import { AppContext } from '../../App';
import SliderCSS from './Slider.module.css';

function Slider() {
    const { algorithmState, animationDuration, handleSlider} = useContext(AppContext);
    return (
        <div className='sliderContainer'>
            <input 
              type="range" 
              min={0} 
              max={5000} 
              value={animationDuration} 
              className={`${SliderCSS.slider} ${algorithmState.current !== "unbegun" && algorithmState.current !== "finished" ? `${SliderCSS.sliderDisabled}` : `${SliderCSS.sliderEnabled}`}`} 
              onChange={handleSlider} 
              disabled={algorithmState.current !== "unbegun" && algorithmState.current !== "finished"}
            />
            <p className={SliderCSS.sliderText}>Animation duration: {animationDuration} milliseconds</p>
          </div>
    )
};

export default Slider;