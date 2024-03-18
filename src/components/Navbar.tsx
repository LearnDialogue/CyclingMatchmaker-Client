import React, { useEffect, useState } from "react";
import "../styles/components/navbar.css";
import SideMenu from "./SideMenu";
import { Link } from "react-router-dom";

interface UserData {
    username: string;
    email: string;
    sex: string;
    weight: number;
}

const Navbar: React.FC = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const [userData, setUserData] = useState<UserData>();

    useEffect(() => {

        const storedUser = JSON.parse(localStorage.getItem('userData') ?? "");
        console.log(storedUser);
        setUserData(storedUser);
        
    }, [])

    return (
        <div className="navbar-main-container">
            <div className="navbar-brand">
                <Link to="/app/rides" >
                    <div>Cycling Matchmaker</div>
                </Link>
            </div>

            <div className="navbar-main-menu-container" >
                <Link to="/app/create" >
                    <div className="navbar-main-menu-option" >Create <i className="fas fa-plus"></i></div>
                </Link>
                <Link to="/app/rides" >
                    <div className="navbar-main-menu-option" >Explore <i className="fa-solid fa-magnifying-glass"></i></div>
                </Link>
                <div onMouseLeave={() => setProfileMenu(false)} onMouseEnter={() => setProfileMenu(true)} className="navbar-main-menu-username" >
                    {userData ? userData.username.slice(0, 1).toLocaleUpperCase() : "-"}
                </div>

                {profileMenu ? (
                    <div onMouseLeave={() => setProfileMenu(false)} onMouseEnter={() => setProfileMenu(true)}  className="navbar-main-menu-profile-dropdown" >
                        <Link to="/app/profile" >
                            <ul>Profile</ul>
                        </Link>
                        <Link to="/login" >
                            <ul className="log-out-btn" >Log out</ul>
                        </Link>
                    </div>
                ) : null}

            </div>
            

            {/* mobile menu */}
            <div onClick={toggleMenu} className="hamburger-navbar-menu-container">
                <div className="hamburger-navbar-menu"></div>
            </div>
            <SideMenu isOpen={menuOpen} onClose={toggleMenu} />
        </div>
    );
};

export default Navbar;
