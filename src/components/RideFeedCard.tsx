import { useContext, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import Button from "./Button";
import "../styles/components/ride-feed-card.css";
import RsvpButton from "./RsvpButton";
import { AuthContext } from "../context/auth";
import { formatDate, formatDistance, formatTime } from "../util/Formatters";

export interface RideFeedCardProps {
    event: any | null;
    setEvent: (nullEvent: string | null) => void;
}

const RideFeedCard: React.FC<RideFeedCardProps> = ({ event, setEvent }) => {

    const { user } = useContext(AuthContext);
    const [isJoined, setIsJoined] = useState(user?.username && event.participants.includes(user?.username));

    const { data: routeData } = useQuery(FETCH_ROUTE, {
        variables: {
            routeID: event.route,
        },
    })

    const getMatchIcon = () => {
        if(event.match == "great"){
            return <i className="fa-solid fa-circle-check"></i>
        }

        if(event.match == "good"){
            return <i className="fa-solid fa-circle-minus"></i>
        }

        return <i className="fa-solid fa-circle-xmark"></i>
    }
    
    const cardMap = () => {
        return(
            <MapContainer
                key={`cardMap`}
                style={{ height: '250px', width: '250px', zIndex: -1}}
                center={routeData.getRoute.startCoordinates}
                zoom={9}
                dragging={false}
                zoomControl={false}
                doubleClickZoom={false}
                scrollWheelZoom={false}
                touchZoom={false}
                boxZoom={false}
                tap={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline
                pathOptions={{ fillColor: 'red', color: 'blue' }}
                positions={routeData.getRoute.points}
                />
            </MapContainer>
        );
    };

    return (
        <div className="ride-feed-card-main-container" >
            <div onClick={() => setEvent(event)} className="ride-feed-card-route-map" >
                <span>View details <i className="fa-solid fa-eye"></i></span>
                <div style={{ textAlign: 'center' }}>{
                    routeData ? (
                            <div>{cardMap()}</div>
                        ) : (
                            <div style={{ width: '250px', height: '250px', backgroundColor: '#f2f2f2' }}></div>
                )}</div>
            </div>
            {routeData ? (
                <div className="ride-feed-card-values" >
                    <h2>{event.name}</h2>
                    <p>Created by <b>{event.host}</b></p>
                    <p>Starts at <b>{formatTime(event.startTime)}</b> on <b>{formatDate(event.startTime)}</b></p>
                    <p>Bike Type: <b>{event.bikeType.join(', ')}</b></p>
                    <p><b>{event.difficulty}</b> difficulty</p>
                    <p>{formatDistance(routeData.getRoute.distance)} km</p>
                    <div className="rsvp-button" >
                        <RsvpButton 
                            eventID={event._id}
                            isJoined={isJoined}
                            setJoinedStatus={setIsJoined}
                            type="secondary"/>
                        <span>Share <i className="fa-regular fa-paper-plane"></i></span>
                    </div>
                </div>
            ) : (
                <></>
            )}
            <div className="ride-feed-card-matching-score" >
                <div className={event.match} >
                    <span>{event.match} match</span>
                    <span>{getMatchIcon()}</span>
                </div>
            </div>
        </div>
    )
};

const FETCH_ROUTE = gql`
  query getRoute($routeID: String!) {
    getRoute(routeID: $routeID) {
        points
        distance
        elevation
        startCoordinates
    }
  }
`

export default RideFeedCard;