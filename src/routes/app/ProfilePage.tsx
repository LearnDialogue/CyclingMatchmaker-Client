import React, { useEffect, useContext, useState, ChangeEvent } from 'react';
import Navbar from '../../components/Navbar';
import GpxMap from '../../util/GpxHandler';
import '../../styles/profile-page.css';
import mockUserData from '../../mockData/userMockUp.json';
import { AuthContext } from '../../context/auth';
import { useSearchParams, Link } from 'react-router-dom';
import { gql, useMutation, useLazyQuery, useQuery } from '@apollo/client';
import Button from '../../components/Button';
import EventModal from '../../components/EventModal';
import Footer from '../../components/Footer';
import AWS from 'aws-sdk';

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });
  return formatter.format(date);
};

const getUserAge = (dateStr: string): string => {
  const date = new Date(dateStr);

  return (new Date().getUTCFullYear() - date.getUTCFullYear()).toString();
};

AWS.config.update({
  region: import.meta.env.VITE_AWS_REGION,
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET,
})

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: import.meta.env.VITE_AWS_BUCKET_NAME },
})

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState<any | null>(null);
  const [currDate, setCurrDate] = useState<Date>(new Date());
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleModalClose = (nullEvent: any | null) => {
    setEvent(nullEvent);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => { 
    console.log("hit change func");
    if (event.target.files) {
      //console.log("hit branch");
      console.log("event.target.files[0]: ", event.target.files[0]);
      setFile(event.target.files[0]);
    }
  }

  const generatePresignedUrl = async (key: string) => {
    const params = {
      Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
      Key: key,
      Expires: 60 * 60, // URL expires in 1 hour
    };
    return s3.getSignedUrlPromise('getObject', params);
  };

  useEffect(() => {
    const handleUpload = async() => {
      console.log("file", file);  
      if (!file) {
        console.log("Please select a file to upload.");
        setMessage('Please select a file to upload.');
        return;
      }
  
      setUploading(true);
      setMessage('');
      
      console.log("bucket name: ", import.meta.env.VITE_AWS_BUCKET_NAME);
      const params = {
        Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
        //TODO: this should probably be a unique key! consider username or userid
        Key: `profile-pictures/${file.name}`,
        Body: file
      };
  
      try {
        const data = await s3.upload(params).promise();
        console.log("File uploaded successfully: ", data.Location);
        setMessage(`File uploaded successfully: ${data.Location}`);
        const presignedUrl = await generatePresignedUrl(params.Key);
        setImageUrl(presignedUrl); // Set the image URL in the state
      } catch (error) {
        console.log("Error uploading file: ", error);
        setMessage("Error uploading file");
        //setMessage(`Error uploading file: ${error.message}`);
      } finally {
        console.log("finally");
        setUploading(false);
      }
    }

    if (file) {
      handleUpload();
    }
  
  }, [file]);

  let username: string | null = null;
  if (user) {
    username = user.username;
  }
  const token: string | null = localStorage.getItem('jwtToken');

  const {
    loading: hostedLoading,
    data: hostedEvents,
    refetch: hostRefetch,
  } = useQuery(GET_HOSTED_EVENTS, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const {
    loading: joinedLoading,
    data: joinedEvents,
    refetch: joinRefetch,
  } = useQuery(GET_JOINED_EVENTS, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const {
    loading: userLoading,
    error,
    data: userData,
  } = useQuery(FETCH_USER_QUERY, {
    variables: {
      username: user?.username,
    },
  });

  useEffect(() => {
    hostRefetch();
    joinRefetch();
  }, []);

  return (
    <div className='profile-page-main-container'>
      <Navbar />

      {event ? <EventModal event={event} setEvent={handleModalClose} /> : <></>}

      <div className='profile-page-grid'>
        <div className='profile-page-user-info'>
          <div className='user-name-and-image-container'>
            <div className='user-image'>
              { 
                imageUrl
                ? <img src={imageUrl} /> 
                : user?.username.slice(0, 1).toLocaleUpperCase()
              }
            {/* Snapchat-120955009.jpg */}
              {/* <img src="http://192.168.40.132:8080/104338756_10222096191409938_5462095096492147096_o%20(2).jpg"></img> */}
              {/* <img src="http://192.168.40.132:8080/236118870_10225395339486578_5612198330392755872_n.jpg"></img> */}
              {/* <img src="http://192.168.40.132:8080/Snapchat-120955009.jpg"></img> */}
              {/* {user?.username.slice(0, 1).toLocaleUpperCase()} */}
              <input
                type='file'
                id='file-upload'
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept='image/*'
              />
              <label htmlFor='file-upload' className='upload-label'>
                <i className='fa-solid fa-image-portrait'></i>
                <span>Upload a picture</span>
              </label>
            </div>

            <div className='user-name'>
              <b>
                {userData
                  ? userData?.getUser.firstName +
                    ', ' +
                    getUserAge(userData.getUser.birthday)
                  : null}
              </b>
            </div>

            <div className='profile-page-edit-profile-btn'>
              <Link to='/app/profile/edit'>
                <Button type='secondary'>
                  <i className='fa-solid fa-pen'></i> &nbsp; &nbsp; Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          <div className='profile-page-user-stats-data'>
            <div>
              <div>FTP</div>
              <div>{userData?.getUser.FTP ?? '-'}</div>
            </div>
            <div>
              <div>Last FTP</div>
              <div>{userData?.getUser.FTPdate.slice(0, 10) ?? '-'}</div>
            </div>
            <div>
              <div>Weight</div>
              <div>{userData?.getUser.weight ?? '-'} kg</div>
            </div>
            <div>
              <div>Experience level</div>
              <div>{userData?.getUser.experience ?? '-'}</div>
            </div>
            <div>
              <div>Rides hosted</div>
              <div>
                {hostedEvents ? hostedEvents.getHostedEvents.length : 0}
              </div>
            </div>
            <div>
              <div>Rides joined</div>
              <div>
                {joinedEvents ? joinedEvents.getJoinedEvents.length : 0}
              </div>
            </div>
          </div>
        </div>
        

        <h3>Your upcoming rides</h3>
        <div className='profile-page-user-upcoming-rides'>
          <div className='profile-page-user-upcoming-rides-data'>
            <div className='profile-page-user-rides-hosted'>
              <h5>
                Rides you are hosting &nbsp; (
                {hostedEvents?.getHostedEvents.length ?? 0})
              </h5>
              <div>
                {hostedEvents && hostedEvents.getHostedEvents ? (
                  hostedEvents.getHostedEvents
                    .filter(
                      (event: any) => new Date(event.startTime) > currDate
                    )
                    .map((event: any, index: number) => (
                      <div
                        onClick={() => setEvent(event)}
                        className='profile-page-user-rides-list-item'
                        key={index}
                      >
                        <div className='ride-title'>
                          <span>
                            <b>{event.name}</b>
                          </span>
                          <span className='ride-date'>
                            {formatDate(event.startTime)}
                          </span>
                        </div>
                        <p className='ride-location'>
                          <i className='fa-solid fa-location-dot'></i>
                          {event.locationName}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className='profile-page-user-event-no-rides-text'>
                    No rides to show
                  </div>
                )}
              </div>
            </div>

            <div className='profile-page-user-rides-joined'>
              <h5>
                Rides you are joining &nbsp; (
                {joinedEvents?.getJoinedEvents.length ?? 0})
              </h5>
              <div>
                {joinedEvents && joinedEvents.getJoinedEvents ? (
                  joinedEvents.getJoinedEvents
                    .filter(
                      (event: any) => new Date(event.startTime) > currDate
                    )
                    .map((event: any, index: number) => (
                      <div
                        onClick={() => setEvent(event)}
                        className='profile-page-user-rides-list-item'
                        key={index}
                      >
                        <div className='ride-title'>
                          <span>
                            <b>{event.name}</b>
                          </span>
                          <span className='ride-date'>
                            {formatDate(event.startTime)}
                          </span>
                        </div>
                        <p className='ride-location'>
                          <i className='fa-solid fa-location-dot'></i>
                          {event.locationName}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className='profile-page-user-event-no-rides-text'>
                    No rides to show
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <h3>Your past rides</h3>
        <div className='profile-page-user-past-rides'>
          <div className='profile-page-user-past-rides-data'>
            <div className='profile-page-user-rides-hosted'>
              <h5>Rides you hosted &nbsp; (0)</h5>
              <div>
                {hostedEvents && hostedEvents.getHostedEvents ? (
                  hostedEvents.getHostedEvents
                    .filter(
                      (event: any) => new Date(event.startTime) < currDate
                    )
                    .map((event: any, index: number) => (
                      <div
                        onClick={() => setEvent(event)}
                        className='profile-page-user-rides-list-item'
                        key={index}
                      >
                        <div className='ride-title'>
                          <span>
                            <b>{event.name}</b>
                          </span>
                          <span className='ride-date'>
                            {formatDate(event.startTime)}
                          </span>
                        </div>
                        <p className='ride-location'>
                          <i className='fa-solid fa-location-dot'></i>
                          {event.locationName}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className='profile-page-user-event-no-rides-text'>
                    No rides to show
                  </div>
                )}
              </div>
            </div>

            <div className='profile-page-user-rides-joined'>
              <h5>Rides you joined &nbsp; (0)</h5>
              <div>
                {joinedEvents && joinedEvents.getJoinedEvents ? (
                  joinedEvents.getJoinedEvents
                    .filter(
                      (event: any) => new Date(event.startTime) < currDate
                    )
                    .map((event: any, index: number) => (
                      <div
                        onClick={() => setEvent(event)}
                        className='profile-page-user-rides-list-item'
                        key={index}
                      >
                        <div className='ride-title'>
                          <span>
                            <b>{event.name}</b>
                          </span>
                          <span className='ride-date'>
                            {formatDate(event.startTime)}
                          </span>
                        </div>
                        <p className='ride-location'>
                          <i className='fa-solid fa-location-dot'></i>
                          {event.locationName}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className='profile-page-user-event-no-rides-text'>
                    No rides to show
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
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
