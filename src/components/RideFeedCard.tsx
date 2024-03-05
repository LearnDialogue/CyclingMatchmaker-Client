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


    const getMatchIcon = () => {
        if(match == "great"){
            return <i className="fa-solid fa-circle-check"></i>
        }

        if(match == "good"){
            return <i className="fa-solid fa-circle-minus"></i>
        }

        return <i className="fa-solid fa-circle-xmark"></i>
    }

    return (
        <div className="ride-feed-card-main-container" >
            <div className="ride-feed-card-route-map" >
                <img src="https://media.bikemap.net/routes/13446259/staticmaps/in_3527ab18-901d-49ae-84ce-b85bf6b58132_400x400_bikemap-2021-3D-static.png" />
            </div>
            <div className="ride-feed-card-values" >
                <h2>{name}</h2>
                <p>Created by <b>{host}</b></p>
                <p>Starts at <b>{startTime}</b> on <b>{date}</b></p>
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