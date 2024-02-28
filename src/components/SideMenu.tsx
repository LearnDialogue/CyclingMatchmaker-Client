import React from "react";
import "../styles/components/side-menu.css";
import { Link } from "react-router-dom";

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <>
            <div onClick={onClose} className="side-menu-overlay-container">
            </div>
            <div className="side-menu-container">
                <span onClick={onClose} className="side-menu-close-btn"></span>
                <Link to="/app/profile" ><div className="side-menu-option">Profile</div></Link>
                <Link to="/app/rides" ><div className="side-menu-option">Rides</div></Link>
                <div className="side-menu-option">Create Ride</div>
                <Link to="/login" ><div className="side-menu-option">Log out</div></Link>
            </div>
        </>
    );
};

export default SideMenu;
