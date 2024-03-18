import React from 'react';
import "../styles/components/button.css"

interface ButtonProps {
    type: 'primary' | 'secondary';
    disabled?: boolean;
    width?: number;
    children: React.ReactNode;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ type, width, disabled, children, onClick }) => {

    let disabledStyle = (disabled ? " button-disabled" : "");

    return (
        <button onClick={onClick} className={"button button-" + type + disabledStyle} style={{width: `${width ?? 100}%`}} >
            {children}
        </button>
    );
};

export default Button;
