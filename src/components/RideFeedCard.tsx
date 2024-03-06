import { useState } from "react";
import "../styles/components/ride-feed-card.css";
import Button from "./Button";

interface RideFeedCardProps {
    host: string;
    name: string;
    startTime: string;
    date: string;
    description: string;
    bikeType: string;
    difficulty: string;
    distance: number;
    wattsPerKilo: number;
    intensity: string;
    route: null;
    match: string;
}


const RideFeedCard = ({ host, name, startTime, date, bikeType, difficulty, distance, description, match }: RideFeedCardProps) => {

    const [modalWithDetails, showModalWithDetails] = useState<boolean>(false);


    const getMatchIcon = () => {
        if(match == "great"){
            return <i className="fa-solid fa-circle-check"></i>
        }

        if(match == "good"){
            return <i className="fa-solid fa-circle-minus"></i>
        }

        return <i className="fa-solid fa-circle-xmark"></i>
    }

    const formatDate = (dateStr: string): string => {
        // Create a Date object directly from the date string
        const date = new Date(dateStr);
      
        // Use Intl.DateTimeFormat to format the date
        const formatter = new Intl.DateTimeFormat('en-US', {
          weekday: 'short', // "short" for abbreviated, "long" for the full name
          day: 'numeric',
          month: 'long',  // "short" for abbreviated month, "long" for the full month name
        });
      
        return formatter.format(date);
    }



    if(modalWithDetails){
        return (
            <div className="ride-card-modal-overlay" >
            
                <div className="ride-card-modal-container" >
                    <span className="rode-card-close-modal" onClick={() => showModalWithDetails(false)} >X</span>
                    <img src="https://media.bikemap.net/routes/13446259/staticmaps/in_3527ab18-901d-49ae-84ce-b85bf6b58132_400x400_bikemap-2021-3D-static.png" />
                    <div className="ride-card-modal-values" >
                        <h2>{name}</h2>
                        <p>Created by <b>{host}</b></p>
                        <p>Starts at <b>{startTime}</b> on <b>{formatDate(date)}</b></p>
                        <p><b>{bikeType}</b> ride</p>
                        <p><b>{difficulty}</b> difficulty</p>
                        <p>{distance} km</p>
                        <p>{description}</p>
                        <div className="rsvp-button" >
                            <Button type="secondary" >RSVP</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }




    return (
        <div className="ride-feed-card-main-container" >
            <div onClick={() => showModalWithDetails(true)} className="ride-feed-card-route-map" >
                <span>View details <i className="fa-solid fa-eye"></i></span>
                <img src="https://media.bikemap.net/routes/13446259/staticmaps/in_3527ab18-901d-49ae-84ce-b85bf6b58132_400x400_bikemap-2021-3D-static.png" />
            </div>
            <div className="ride-feed-card-values" >
                <h2>{name}</h2>
                <p>Created by <b>{host}</b></p>
                <p>Starts at <b>{startTime}</b> on <b>{formatDate(date)}</b></p>
                <p><b>{bikeType}</b> ride</p>
                <p><b>{difficulty}</b> difficulty</p>
                <p>{distance} km</p>
                <div className="rsvp-button" >
                    <Button type="secondary" >RSVP</Button>
                </div>
            </div>
            <div className="ride-feed-card-matching-score" >
                <div className={match} >
                    <span>{match} match</span>
                    <span>{getMatchIcon()}</span>
                </div>
            </div>
        </div>
    )
};

export default RideFeedCard;