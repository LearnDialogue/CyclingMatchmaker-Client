import React, { useEffect, useContext, useState } from 'react';
import Navbar from "../../components/Navbar";
import GpxMap from "../../util/GpxHandler";
import "../../styles/profile-page.css";
import mockUserData from "../../mockData/userMockUp.json";
import { AuthContext } from "../../context/auth";
import { useSearchParams, Link } from "react-router-dom";
import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client';
import Button from '../../components/Button';
import EventModal from '../../components/EventModal';

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });
  return formatter.format(date);
}

const getUserAge = (dateStr: string): string => {
  const date = new Date(dateStr);

  return (new Date().getUTCFullYear() - date.getUTCFullYear()).toString();
}

const ProfilePage = () => {

  const [showPopOver, setShowPopOver] = useState(null);
  // const [refetchRides, setRefetchRides] = useState(false);
  const [event, setEvent] = useState<any | null>(null);

  const handleModalClose = (nullEvent: any | null) => {
    setEvent(nullEvent);
  }

  const handleRSVPEvent = async (rsvpEvent: any | null) => {
    return;
  }

  const { user } = useContext(AuthContext);

  let username: string | null = null;
  if (user) {
    username = user.username;
  }
  const token: string | null = localStorage.getItem("jwtToken");

  const {loading: hostedLoading, data: hostedEvents, refetch: hostRefetch } = useQuery(GET_HOSTED_EVENTS, {
    context: {
      headers: {
          Authorization: `Bearer ${token}`,
      },
    },
  });

  const {loading: joinedLoading, data: joinedEvents, refetch: joinRefetch } = useQuery(GET_JOINED_EVENTS, {
    context: {
      headers: {
          Authorization: `Bearer ${token}`,
      },
    },
  });


  const { loading: userLoading, error, data: userData} = useQuery(FETCH_USER_QUERY, {
    variables: {
        username: user?.username,
    },
  });

  useEffect(() => {
    hostRefetch();
    joinRefetch();
  }, []);

  console.log(userData)
  return (
    <div className="profile-page-main-container">
      <Navbar />

      {event ? (
        <EventModal
          event={event}
          setEvent={handleModalClose}
        />
      ) : (
        <></>
      )}

      <div className="profile-page-grid">

        <div className="profile-page-user-info" >
          
          <div className="user-name-and-image-container" >
            
            <div className="user-image" >
              {user?.username.slice(0, 1).toLocaleUpperCase()}
            </div>
            
            <div className="user-name"><b>{userData ? userData?.getUser.firstName + ", " + getUserAge(userData.getUser.birthday) : null}</b></div>
            
            <div className="profile-page-edit-profile-btn">
              <Button type="secondary" >
                <Link to="/app/profile/edit" >
                  <i className="fa-solid fa-pen"></i> &nbsp; &nbsp; Edit Profile
                </Link>
              </Button>
            </div>

          </div>

          
          <div className="profile-page-user-stats-data">
            <div>
              <div>FTP</div>
              <div>{userData?.getUser.FTP ?? "-"}</div>
            </div>
            <div>
              <div>Last FTP</div>
              <div>{userData?.getUser.FTPdate.slice(0, 10) ?? "-"}</div>
            </div>
            <div>
              <div>Weight</div>
              <div>{userData?.getUser.weight ?? "-"} kg</div>
            </div>
            <div>
              <div>Experience level</div>
              <div>{userData?.getUser.experience ?? "-"}</div>
            </div>
            <div>
              <div>Rides hosted</div>
              <div>{hostedEvents ? hostedEvents.getHostedEvents.length : 0}</div>
            </div>
            <div>
              <div>Rides joined</div>
              <div>{joinedEvents ? joinedEvents.getJoinedEvents.length : 0}</div>
            </div>
          </div>

        </div>
        
        
        <h3>Your upcoming rides</h3>
        <div className="profile-page-user-upcoming-rides">
            

              <div className="profile-page-user-upcoming-rides-data" >

                <div className="profile-page-user-rides-hosted" >
                  <h5>Rides you are hosting &nbsp; ({hostedEvents?.getHostedEvents.length ?? 0})</h5>
                  <div>
                    {console.log(hostedEvents)}
                    {hostedEvents ? hostedEvents.getHostedEvents.map((event: any, index: number) => (
                      // <div onClick={() => setShowPopOver(event)} className="profile-page-user-rides-list-item" key={index} >
                      <div onClick={() => setEvent(event)} className="profile-page-user-rides-list-item" key={index} >
                        <div className="ride-title" >
                          <span><b>{event.name}</b></span>
                          <span className="ride-date" >{formatDate(event.startTime)}</span>
                        </div>
                        <p className="ride-location" ><i className="fa-solid fa-location-dot"></i>{event.locationName}</p>
                      </div>
                    )) : <div className="profile-page-user-event-no-rides-text">No rides to show</div>}
                  </div>
                </div>

                <div className="profile-page-user-rides-joined" >
                  <h5>Rides you are joining &nbsp; ({joinedEvents?.getJoinedEvents.length ?? 0})</h5>
                  <div>
                    {joinedEvents ? joinedEvents.getJoinedEvents.map((event: any, index: number) => (
                        <div onClick={() => setEvent(event)} className="profile-page-user-rides-list-item" key={index} >
                          <div className="ride-title" >
                            <span><b>{event.name}</b></span>
                            <span className="ride-date" >{formatDate(event.startTime)}</span>
                          </div>
                          <p className="ride-location" ><i className="fa-solid fa-location-dot"></i>{event.locationName}</p>
                        </div>
                      )) : <div className="profile-page-user-event-no-rides-text">No rides to show</div>}
                  </div>
                </div>

              </div>
          </div>


          <h3>Your past rides</h3>
          <div className="profile-page-user-past-rides">
            

              <div className="profile-page-user-past-rides-data" >

                <div className="profile-page-user-rides-hosted" >
                  <h5>Rides you hosted &nbsp; (0)</h5>
                  <div>
                    {hostedEvents == 1 ? hostedEvents.getHostedEvents.map((event: any, index: number) => (
                      <div onClick={() => setShowPopOver(event)} className="profile-page-user-rides-list-item" key={index} >
                        <div className="ride-title" >
                          <span><b>{event.name}</b></span>
                          <span className="ride-date" >{formatDate(event.startTime)}</span>
                        </div>
                        <p className="ride-location" ><i className="fa-solid fa-location-dot"></i>{event.locationName}</p>
                      </div>
                    )) : <div className="profile-page-user-event-no-rides-text">No past rides hosted by you</div>}
                  </div>
                </div>

                <div className="profile-page-user-rides-joined" >
                  <h5>Rides you joined &nbsp; (0)</h5>
                  <div>
                    {joinedEvents == 1 ? joinedEvents.getJoinedEvents.map((event: any, index: number) => (
                        <div onClick={() => setShowPopOver(event)} className="profile-page-user-rides-list-item" key={index} >
                          <div className="ride-title" >
                            <span><b>{event.name}</b></span>
                            <span className="ride-date" >{formatDate(event.startTime)}</span>
                          </div>
                          <p className="ride-location" ><i className="fa-solid fa-location-dot"></i>{event.locationName}</p>
                        </div>
                      )) : <div className="profile-page-user-event-no-rides-text">No past rides you joined</div>}
                  </div>
                </div>

              </div>
          </div>

      </div>
    </div>
  );
};


const FETCH_USER_QUERY = gql`
  query getUser($username: String!) {
    getUser(username: $username) {
        FTP
        weight
        FTPdate
        birthday
        firstName
        experience
    }
  }
`;

const GET_HOSTED_EVENTS = gql`
  query getHostedEvents {
    getHostedEvents {
        _id
        host
        name
        locationName
        locationCoords
        startTime
        description
        bikeType
        difficulty
        wattsPerKilo
        intensity
        route
        participants
    }
  }
`;

export const GET_JOINED_EVENTS = gql`
  query getJoinedEvents {
    getJoinedEvents {
        _id
        host
        name
        locationName
        locationCoords
        startTime
        description
        bikeType
        difficulty
        wattsPerKilo
        intensity
        route
        participants
    }
  }
`;
export default ProfilePage;