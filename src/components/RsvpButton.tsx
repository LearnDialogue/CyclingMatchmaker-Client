import React, { useState } from 'react';
import "../styles/components/button.css"
import { gql, useMutation } from '@apollo/client';

interface RsvpButtonProps {
    isJoined: boolean | "" | undefined;
    eventID: string,
    type: 'primary' | 'secondary';
    disabled?: boolean;
    width?: number;
    setJoinedStatus: (status: boolean) => void;
}

const RsvpButton: React.FC<RsvpButtonProps> = ({ isJoined, eventID, type, width, disabled, setJoinedStatus }) => {
    let disabledStyle = (disabled ? " button-disabled" : "");

    const token: string | null = localStorage.getItem("jwtToken");
    const [handleRSVP] = useMutation(JOIN_RIDE, {
        context: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        variables: { eventID: eventID }
    });

    const [handleLeave] = useMutation(LEAVE_RIDE, {
        context: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        variables: { eventID: eventID }
    });

    const handleRSVPClick = () => {
        setJoinedStatus(true);
        handleRSVP({variables: { eventID: eventID }});
    };

    const handleLeaveClick = () => {
        setJoinedStatus(false);
        handleLeave({variables: { eventID: eventID }});
    };

    return (
        <div style={{ width: '100%' }} >
            {isJoined ? (
                <button onClick={handleLeaveClick} className={"button button-" + type + disabledStyle} style={{width: `${width ?? 100}%`}} >
                Leave Ride
                </button>
            ) : (
                <button onClick={handleRSVPClick} className={"button button-" + type + disabledStyle} style={{width: `${width ?? 100}%`}} >
                RSVP
                </button>
            )}
        </div>
    );
};

const JOIN_RIDE = gql`
    mutation joinEvent($eventID: String!) {
        joinEvent(eventID: $eventID) {
            _id
        }
    }
`

const LEAVE_RIDE = gql`
    mutation leaveEvent($eventID: String!) {
        leaveEvent(eventID: $eventID) {
            _id
        }
    }
`

export default RsvpButton;
