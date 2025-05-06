import React, {useState} from 'react';
import {RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './Header.module.scss'

//BEM -> Block __Element --Modifier

const Header: React.FC = () => {
        const [toggleMenu, setToggleMenu] = useState(false);
    return (
        <div className="navbar">
            <div className="navbar-links">
                <div className="navbar-links__container">
                    <p><a href="#home">HOME</a></p>
                    <p><a href="#about">ABOUT</a></p>
                    <p><a href="#contact">CONTACT</a></p>
                </div>
                <div className="navbar-links__sign">
                    <button type="button">Login</button>
                </div>
            </div>
            <div className="navbar-menu">
                {toggleMenu
                ? <RiCloseLine color="#2B7A78" size={27} onClick={() => setToggleMenu(false)} />
                : <RiMenu3Line color="#2B7A78" size={27} onClick={() => setToggleMenu(true)} />}
                {toggleMenu && (
                    <div className="navbar-menu__container scale-up-center">
                    <div className="navbar-menu__container-links">
                        <p><a href="#home">Home</a></p>
                        <p><a href="#about">About</a></p>
                        <p><a href="#contact">Contact</a></p>
                    </div>
                    
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header;