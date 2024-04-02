import { useContext, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import Button from "./Button";
import "../styles/components/ride-feed-card.css";
import RsvpButton from "./RsvpButton";
import { AuthContext } from "../context/auth";

export interface RideFeedCardProps {
    _id: string;
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
    participants: string[];
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

const RideFeedCard = ({ 
        _id, host, name, startTime, 
        description, bikeType, difficulty, 
        wattsPerKilo, intensity, route, 
        match, participants 
    }: RideFeedCardProps) => {

    const { user } = useContext(AuthContext);
    const [modalWithDetails, showModalWithDetails] = useState<boolean>(false);
    const [isJoined, setIsJoined] = useState(user?.username && participants.includes(user?.username));

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
    const generateGPXFile = () => {
        if (!routeData || !routeData.getRoute) return;
    
        const now = new Date().toISOString();
    
        let gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
    <gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxdata="http://www.cluetrust.com/XML/GPXDATA/1/0" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.cluetrust.com/XML/GPXDATA/1/0 http://www.cluetrust.com/Schemas/gpxdata10.xsd" version="1.1" creator="http://ridewithgps.com/">
      <metadata>
        <name>${name}</name>
        <link href="https://ridewithgps.com/routes/${route}">
          <text>${name}</text>
        </link>
        <time>${now}</time>
      </metadata>
      <trk>
        <name>${name}</name>
        <trkseg>`;
    
        for (let i = 0; i < routeData.getRoute.points.length; i++) {
            const [lat, lon] = routeData.getRoute.points[i];
            const ele = routeData.getRoute.elevation[i];
            gpxContent += `
          <trkpt lat="${lat}" lon="${lon}">
            <ele>${ele}</ele>
          </trkpt>`;
        }
    
        gpxContent += `
        </trkseg>
      </trk>
    </gpx>`;
    
        const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${name}.gpx`;
        link.click();
    };

    const toggleJoinedStatus = (status: boolean) => {
        setIsJoined(status);
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
                    {routeData ? (
                        <div className="ride-card-modal-values" >
                            <h2>{name}</h2>
                            <p>Created by <b>{host}</b></p>
                            <p>Starts at <b>{formatTime(startTime)}</b> on <b>{formatDate(startTime)}</b></p>
                            <p><b>{bikeType}</b> ride</p>
                            <p><b>{difficulty}</b> difficulty</p>
                            <p>{formatDistance(routeData.getRoute.distance)} km</p>
                            <p>{description}</p>
                            <div className="rsvp-button" >
                                <RsvpButton 
                                    eventID={_id}
                                    isJoined={isJoined}
                                    setJoinedStatus={toggleJoinedStatus}
                                    type="secondary"/>
                                    <Button type="secondary" onClick={generateGPXFile}>Download</Button>

                            </div>
                        </div>  
                    ) : (
                        <></>
                    )}
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
            {routeData ? (
                <div className="ride-feed-card-values" >
                    <h2>{name}</h2>
                    <p>Created by <b>{host}</b></p>
                    <p>Starts at <b>{formatTime(startTime)}</b> on <b>{formatDate(startTime)}</b></p>
                    <p><b>{bikeType}</b> ride</p>
                    <p><b>{difficulty}</b> difficulty</p>
                    <p>{formatDistance(routeData.getRoute.distance)} km</p>
                    <div className="rsvp-button" >
                        <RsvpButton 
                            eventID={_id}
                            isJoined={isJoined}
                            setJoinedStatus={toggleJoinedStatus}
                            type="secondary"/>
                        <span>Share <i className="fa-regular fa-paper-plane"></i></span>
                    </div>
                </div>
            ) : (
                <></>
            )}
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
        elevation
        startCoordinates
    }
  }
`

export default RideFeedCard;