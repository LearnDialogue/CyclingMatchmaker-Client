import React, { useEffect, useState } from 'react';
import Navbar from "../../components/Navbar";
import GpxMap from "../GpxMap"; // Replace with the correct path
import "../../styles/profile-page.css";
import mockUserData from "../../mockData/userMockUp.json";
import LoaderWheel from '../../components/LoaderWheel';

interface UserData {
  username: string;
  email: string;
  sex: string;
  weight: number;
}

const ProfilePage = () => {


  const [userData, setUserData] = useState<UserData>();

  useEffect(() => {
    console.log(mockUserData);

    const storedUser = JSON.parse(localStorage.getItem('userData') ?? "");
    console.log(storedUser);
    setUserData(storedUser);
    

  }, [])


  if(userData){
    return (
      <div className="profile-page-main-container">
        <Navbar />
        <div className="profile-page-grid">
          <h3 className="profile-page-welcome-message">Welcome back, <b>{userData.username}</b>!</h3>

          <div className="profile-page-user-stats">
            <h4>Your stats</h4>
            <div className="profile-page-user-stats-data">
              <div>
                <div>FTP</div>
                <div>-</div>
              </div>
              <div>
                <div>Last FTP</div>
                <div>-</div>
              </div>
              <div>
                <div>Weight</div>
                <div>{userData.weight} kg</div>
              </div>
              <div>
                <div>Age</div>
                <div>-</div>
              </div>
              <div>
                <div>Experience level</div>
                <div>-</div>
              </div>
            </div>
          </div>
          
          <div className="profile-page-user-upcoming-rides">
            <h4>Your upcoming rides</h4>

              <div className="profile-page-user-upcoming-rides-data" >

                <div className="profile-page-user-rides-hosted" >
                  <h5>Rides you are hosting</h5>
                  <div>
                    {mockUserData.eventsJoined.length > 0 ? mockUserData.eventsJoined.map((e) => <div key={e}>{e}</div>) : <div className="profile-page-user-event-no-rides-text">No rides to show</div>}
                  </div>
                </div>

                <div className="profile-page-user-rides-joined" >
                  <h5>Rides you are joining</h5>
                  <div>
                    {mockUserData.eventsJoined.length > 0 ? mockUserData.eventsJoined.map((e) => <div key={e}>{e}</div>) : <div className="profile-page-user-event-no-rides-text">No rides to show</div>}
                  </div>
                </div>

              </div>
          </div>

          
        </div>
      </div>
    );
  }

  return (
    <LoaderWheel />
  )

  
};

export default ProfilePage;
