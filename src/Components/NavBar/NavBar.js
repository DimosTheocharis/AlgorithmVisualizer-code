import React, { useState } from 'react';
import { IoMdMenu } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { IconContext } from 'react-icons';
import NavBarCSS from './NavBar.module.css';


function NavBar() {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(prev => !prev);
        console.log("hi")
    }

    return (
        <IconContext.Provider value={{color: "white"}}>
            <div className={NavBarCSS.navBar}>
                <IoMdMenu className={NavBarCSS.menuButton} onClick={toggleMenu}/>
            </div>
            <nav className={showMenu ? `${NavBarCSS.menu} ${NavBarCSS.active}` : NavBarCSS.menu}>
                <div className={NavBarCSS.closeButtonContainer}>
                    <AiOutlineClose className={NavBarCSS.closeButton} onClick={toggleMenu}/>
                </div>
            </nav>
        </IconContext.Provider>
    )
}

export default NavBar;