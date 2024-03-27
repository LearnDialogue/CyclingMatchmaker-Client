import React, { useEffect, useContext, useState } from 'react';
import Navbar from "../../components/Navbar";
import GpxMap from "../../util/GpxHandler";
import "../../styles/profile-page.css";
import mockUserData from "../../mockData/userMockUp.json";
import { AuthContext } from "../../context/auth";
import { useSearchParams } from "react-router-dom";
import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client';

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });
  return formatter.format(date);
}

const ProfilePage = () => {

  const { user } = useContext(AuthContext);

  let username: string | null = null;
  if (user) {
    username = user.username;
  }
  const token: string | null = localStorage.getItem("jwtToken");

  const {loading: hostedLoading, error: hostedErr, data: hostedEvents } = useQuery(GET_HOSTED_EVENTS, {
    context: {
      headers: {
          Authorization: `Bearer ${token}`,
      },
    },
  });

  const {loading: joinedLoading, error: joinedErr, data: joinedEvents } = useQuery(GET_JOINED_EVENTS, {
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

  return (
    <div className="profile-page-main-container">
      <Navbar />
      <div className="profile-page-grid">
        <h3 className="profile-page-welcome-message">Welcome back, <b>{userData?.getUser.firstName}</b>!</h3>
        
        <div className="profile-page-user-upcoming-rides">
            <h4>Your upcoming rides</h4>

              <div className="profile-page-user-upcoming-rides-data" >

                <div className="profile-page-user-rides-hosted" >
                  <h5>Rides you are hosting</h5>
                  <div>
                    {hostedEvents ? hostedEvents.getHostedEvents.map((event: any, index: number) => (
                      <div key={index}>
                        <p style={{fontSize: '20px', marginTop: '5px', marginBottom: '5px', fontWeight: 'bold'}}>{event.name}</p>
                        <p style={{fontSize: '15px', marginTop: '5px', marginBottom: '5px', fontWeight: 'lighter'}}>{formatDate(event.startTime)}</p>
                        <p style={{marginTop: '5px', marginBottom: '5px'}}>{event.locationName.slice(0,55)}...</p>
                        <hr></hr>
                      </div>
                    )) : <div className="profile-page-user-event-no-rides-text">No rides to show</div>}
                  </div>
                </div>

                <div className="profile-page-user-rides-joined" >
                  <h5>Rides you are joining</h5>
                  <div>
                    {joinedEvents ? joinedEvents.getJoinedEvents.map((event: any, index: number) => (
                      <div key={index}>
                        <p style={{fontSize: '20px', marginTop: '5px', marginBottom: '5px', fontWeight: 'bold'}}>{event.name}</p>
                        <p style={{fontSize: '15px', marginTop: '5px', marginBottom: '5px', fontWeight: 'lighter'}}>{formatDate(event.startTime)}</p>
                        <p style={{marginTop: '5px', marginBottom: '5px'}}>{event.locationName.slice(0,55)}...</p>
                        <hr></hr>
                      </div>
                    )) : <div className="profile-page-user-event-no-rides-text">No rides to show</div>}
                  </div>
                </div>

              </div>
          </div>




        <div className="profile-page-user-stats">
          <h4>Your stats</h4>
          <div className="profile-page-user-stats-data">
            <div>
              <div>FTP</div>
              <div>{userData?.getUser.FTP}</div>
            </div>
            <div>
              <div>Last FTP</div>
              <div>{userData?.getUser.FTPdate}</div>
            </div>
            <div>
              <div>Weight</div>
              <div>{userData?.getUser.weight} kg</div>
            </div>
            <div>
              <div>Birthday</div>
              <div>{userData?.getUser.birthday}</div>
            </div>
            <div>
              <div>Experience level</div>
              <div>Advanced</div>
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
    }
  }
`;

const GET_HOSTED_EVENTS = gql`
  query getHostedEvents {
    getHostedEvents {
        name
        locationName
        host
        startTime
    }
  }
`;

const GET_JOINED_EVENTS = gql`
  query getJoinedEvents {
    getJoinedEvents {
        name
        locationName
        host
        startTime
    }
  }
`;
export default ProfilePage;