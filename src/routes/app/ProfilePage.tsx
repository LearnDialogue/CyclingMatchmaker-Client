import React, { useEffect, useContext } from 'react';
import Navbar from "../../components/Navbar";
import GpxMap from "../GpxMap"; // Replace with the correct path
import "../../styles/profile-page.css";
import mockUserData from "../../mockData/userMockUp.json";
import { AuthContext } from "../../context/auth";

const ProfilePage = () => {
  
  const { user } = useContext(AuthContext);

  let username: string | null = null;

  if (user) {
    username = user.username;
  }

  console.log(username);
  
  useEffect(() => {
    console.log(mockUserData);
  }, [])

  return (
    <div className="profile-page-main-container">
      <Navbar />
      <div className="profile-page-grid">
        <h3 className="profile-page-welcome-message">Welcome back, <b>{mockUserData.firstName}</b>!</h3>
        <div className="profile-page-user-events">
          <div className="profile-page-user-event">
            <h4>Your rides</h4>
            {/* Replace this div with the GpxMap component */}
            <GpxMap />
          </div>
          <div className="profile-page-user-event">
            <h4>Rides you joined</h4>
            <div>
              {mockUserData.eventsJoined.length > 0 ? mockUserData.eventsJoined.map((e) => <div key={e}>{e}</div>) : <div className="profile-page-user-event-no-rides-text">No rides to show</div>}
            </div>
          </div>
        </div>
        <div className="profile-page-user-stats">
          <h4>Your stats</h4>
          <div className="profile-page-user-stats-data">
            <div>
              <div>FTP</div>
              <div>{mockUserData.FTP}</div>
            </div>
            <div>
              <div>Last FTP</div>
              <div>{mockUserData.FTPdate}</div>
            </div>
            <div>
              <div>Weight</div>
              <div>{mockUserData.weight} kg</div>
            </div>
            <div>
              <div>Age</div>
              <div>{mockUserData.birthday}</div>
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

export default ProfilePage;
