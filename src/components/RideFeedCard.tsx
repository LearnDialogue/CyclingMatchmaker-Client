import { useContext, useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
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
    var [FTP, setFTP] = useState<number | null>(null);

    const { data: userData } = useQuery(FETCH_USER_QUERY, {
        variables: {
            username: user?.username,
        },
    });

    useEffect(() => {
        if (userData && userData.getUser) {
            setFTP(userData.getUser.FTP);
        }
    }, [userData]);

    const getMatchIcon = () => {
        if (!FTP){
            FTP = 0;
        }

        var ftpDifference = 0;

        if (difficulty === "Above 4.5" || difficulty === "Below 2.0"){
            const rideFTP = parseFloat(difficulty.slice(-3))
            ftpDifference = Math.abs(rideFTP - FTP);
        } else {
            const [minFTPStr, maxFTPStr] = difficulty.split(' to ');
            const minFTP = parseFloat(minFTPStr);
            const maxFTP = parseFloat(maxFTPStr);

            const diffFromMinFTP = Math.abs(FTP - minFTP);
            const diffFromMaxFTP = Math.abs(FTP - maxFTP);

            ftpDifference = Math.min(diffFromMinFTP, diffFromMaxFTP);
        }

        if (ftpDifference <= 0.3) {
            return <i className="fa-solid fa-circle-check"></i>;
        } else if (ftpDifference <= 0.6) {
            return <i className="fa-solid fa-circle-minus"></i>;
        } else {
            return <i className="fa-solid fa-circle-xmark"></i>;
        }
    }

    const { data: routeData } = useQuery(FETCH_ROUTE, {
        variables: {
            routeID: event.route,
        },
    });

    const modalMap = () => {
        return(
            <MapContainer
                key={`modalMap`}
                style={{ height: '400px', width: '400px', zIndex: 1}}
                center={routeData.getRoute.startCoordinates}
                zoom={9}
                dragging={true}
                zoomControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                touchZoom={true}
                boxZoom={true}
                tap={true}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline
                pathOptions={{ fillColor: 'red', color: 'blue' }}
                positions={routeData.getRoute.points}
                />
            </MapContainer>
        );
    };
    
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

const FETCH_USER_QUERY = gql`
  query getUser($username: String!) {
    getUser(username: $username) {
        FTP
    }
  }
`;


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