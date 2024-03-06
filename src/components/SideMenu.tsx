import React, { useContext } from "react";
import "../styles/components/side-menu.css";
import { AuthContext } from "../context/auth";

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
    const { logout } = useContext(AuthContext);
    if (!isOpen) return null;

    return (
        <>
            <div onClick={onClose} className="side-menu-overlay-container">
            </div>
            <div className="side-menu-container">
                <span onClick={onClose} className="side-menu-close-btn"></span>
                <div className="side-menu-option">Profile</div>
                <div className="side-menu-option">Rides</div>
                <div className="side-menu-option">Create Ride</div>
                <div className="side-menu-option" onClick={logout}>Log out</div>
            </div>
        </>
    );
};

export default SideMenu;
