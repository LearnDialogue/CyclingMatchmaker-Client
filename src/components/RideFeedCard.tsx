import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import Button from "./Button";
import "../styles/components/ride-feed-card.css";

export interface RideFeedCardProps {
    host: string;
    name: string;
    startTime: string;
    description: string;
    bikeType: string;
    difficulty: string;
    wattsPerKilo: number;
    intensity: string;
    route: string
    match: string;
}

const formatDistance = (meters: number): number => {
    const kilometers = meters / 1000;
    const roundedDis = Math.round(kilometers * 10) / 10;
    return roundedDis;
};

const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
    });
    return formatter.format(date);
}

function formatTime(isoString: string): string {
    const date: Date = new Date(isoString);
    const hours: number = date.getUTCHours();
    const minutes: number | string = date.getUTCMinutes();
    const ampm: string = hours >= 12 ? 'pm' : 'am';
    const formattedHours: number = hours % 12 || 12;
    const formattedMinutes: string = minutes < 10 ? '0' + minutes : minutes.toString();
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

const RideFeedCard = ({ host, name, startTime, description, bikeType, difficulty, wattsPerKilo, intensity, route, match }: RideFeedCardProps) => {

    const [modalWithDetails, showModalWithDetails] = useState<boolean>(false);

    const { data: routeData } = useQuery(FETCH_ROUTE, {
        variables: {
            routeID: route,
        },
    })

    const getMatchIcon = () => {
        if(match == "great"){
            return <i className="fa-solid fa-circle-check"></i>
        }

        if(match == "good"){
            return <i className="fa-solid fa-circle-minus"></i>
        }

        return <i className="fa-solid fa-circle-xmark"></i>
    }

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

    if(modalWithDetails){
        return (
            <div className="ride-card-modal-overlay" >
            
                <div className="ride-card-modal-container" >
                    <span className="rode-card-close-modal" onClick={() => showModalWithDetails(false)} >X</span>
                    <div style={{ textAlign: 'center' }}>{
                        routeData ? (
                                <div>{modalMap()}</div>
                            ) : (
                                <div style={{ width: '400px', height: '400px', backgroundColor: '#f2f2f2' }}></div>
                    )}</div>
                    <div className="ride-card-modal-values" >
                        <h2>{name}</h2>
                        <p>Created by <b>{host}</b></p>
                        <p>Starts at <b>{formatTime(startTime)}</b> on <b>{formatDate(startTime)}</b></p>
                        <p><b>{bikeType}</b> ride</p>
                        <p><b>{difficulty}</b> difficulty</p>
                        {routeData ? (
                            <p>{formatDistance(routeData.getRoute.distance)} km</p>
                        ) : (
                            <></>
                        )}
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
                <div style={{ textAlign: 'center' }}>{
                    routeData ? (
                            <div>{cardMap()}</div>
                        ) : (
                            <div style={{ width: '250px', height: '250px', backgroundColor: '#f2f2f2' }}></div>
                )}</div>
            </div>
            <div className="ride-feed-card-values" >
                <h2>{name}</h2>
                <p>Created by <b>{host}</b></p>
                <p>Starts at <b>{formatTime(startTime)}</b> on <b>{formatDate(startTime)}</b></p>
                <p><b>{bikeType}</b> ride</p>
                <p><b>{difficulty}</b> difficulty</p>
                {routeData ? (
                    <p>{formatDistance(routeData.getRoute.distance)} km</p>
                ) : (
                    <></>
                )}
                <div className="rsvp-button" >
                    <Button type="secondary" >RSVP</Button>
                    <span>Share <i className="fa-regular fa-paper-plane"></i></span>
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

const FETCH_ROUTE = gql`
  query getRoute($routeID: String!) {
    getRoute(routeID: $routeID) {
        points
        distance
        startCoordinates
    }
  }
`

export default RideFeedCard;