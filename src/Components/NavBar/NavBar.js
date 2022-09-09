import React, { useState, useContext } from 'react';
import { IoMdMenu } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { IconContext } from 'react-icons';
import SiderbarData from '../../SiderbarData';
import { Link } from 'react-router-dom';
import { AppContext } from '../../App';
import NavBarCSS from './NavBar.module.css';


function NavBar({displayedScreen, setDisplayedScreen}) {
    const { setGrid } = useContext(AppContext);
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(prev => !prev);
    }

    const loadFunction = (title) => {
        //the function that will be called every time user goes to a different screen
        setGrid(null);
        setDisplayedScreen(title);
    }


    return (
        <IconContext.Provider value={{color: "white"}}>
            <div className={NavBarCSS.navBar}>
                <IoMdMenu className={NavBarCSS.menuButton} onClick={toggleMenu}/>
                <h1 className={NavBarCSS.screenTitle}>{displayedScreen}</h1>
            </div>
            <nav className={showMenu ? `${NavBarCSS.menu} ${NavBarCSS.active}` : NavBarCSS.menu}>
                <div className={NavBarCSS.closeButtonContainer}>
                    <AiOutlineClose className={NavBarCSS.closeButton} onClick={toggleMenu}/>
                </div>
                <ul className={NavBarCSS.navigationLinksContainer}>
                    {
                        SiderbarData.map((data, index) => {
                            return (
                                <li className={`${NavBarCSS.navigationLink} ${NavBarCSS[data.class]}`} key={index} onClick={toggleMenu}>
                                    <Link to={data.path} onClick={() => loadFunction(data.title)}>
                                        <p className={NavBarCSS.navigationTitle}>{data.title}</p>
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
        </IconContext.Provider>
    )
}

export default NavBar;