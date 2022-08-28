import React, { useState, useContext } from 'react';
import { IoMdMenu } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { IconContext } from 'react-icons';
import SiderbarData from '../../SiderbarData';
import { Link } from 'react-router-dom';
import { AppContext } from '../../App';
import NavBarCSS from './NavBar.module.css';


function NavBar() {
    const { setGrid } = useContext(AppContext);
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(prev => !prev);
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
                <ul className={NavBarCSS.navigationLinksContainer}>
                    {
                        SiderbarData.map((data, index) => {
                            return (
                                <li className={NavBarCSS.navigationLink} key={index} onClick={toggleMenu}>
                                    <Link to={data.path} onClick={() => setGrid(null)}>
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