import { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { RideFeedCardProps } from "../../components/RideFeedCard";
import { AuthContext } from "../../context/auth";

import RideFeedCard from "../../components/RideFeedCard";
import Navbar from "../../components/Navbar";
import Button from "../../components/Button";

import "../../styles/rides-feed.css";

const RidesFeed = () => {
    const { user } = useContext(AuthContext);
    const [reload, setReload] = useState<boolean | null>(null);
    const [searchName, setSearchName] = useState("");
    const [radius, setRadius] = useState(0);
    const [bikeType, setBikeType] = useState<string[] | never[]>([]);
    const [wkg, setWkg] = useState<string[] | never[]>([]);
    const [match, setMatch] = useState([""]);

    const [sortingOrder, setSortingOrder] = useState<string>("date_asc");
    const [sortedRideData, setSortedRideData] = useState<any>([]);

    const [eventParams, setEventParams] = useState({
        startDate: new Date().toISOString(),
    });

    const { data: userData } = useQuery(FETCH_USER_QUERY, {
        onCompleted() {
            setSearchName(userData.getUser.locationName);
            setRadius(userData.getUser.radius);
        },
        variables: {
            username: user?.username,
        },
    });

    const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked, id } = event.target;

        if (id == "bike") {
            if (checked) {
                setBikeType(prevArray => [...prevArray, name]);
            } else {
                setBikeType(prevArray => prevArray.filter(item => item !== name));
            }
        } else if (id == "wkg") {
            if (checked) {
                setWkg(prevArray => [...prevArray, name]);
            } else {
                setWkg(prevArray => prevArray.filter(item => item !== name));
            }
        }

        setAppliedFilters(prev => {
            if (checked) {
                return [...prev, name];
            } else {
                return prev.filter(filter => filter !== name);
            }
        });
    };

    const handleSliderChange = (event: any) => {
        const newRadius = event.target.value;
        setRadius(parseInt(newRadius));
    };  

    const [setRegionUser, { loading: regionLoading, error, data }] = useMutation(SET_REGION_MUTATION);

    const setRegion = async () => {
        const searchStr = searchName.trim().toLowerCase();
        const cachedQuery = await sessionStorage.getItem(searchStr);
        var locName: string | null = null;
        var locCoords: number[] | null = null;

        if(cachedQuery) {
            const cachedObj = JSON.parse(cachedQuery);
            locName = cachedObj.locName;
            locCoords = cachedObj.locCoords;
        } else {
            locName = searchStr;
        }

        const regionUser = await setRegionUser({
            variables: {
                username: user?.username,
                locationName: locName,
                locationCoords: locCoords,
                radius: radius,
            },
        });

        if (!cachedQuery) {
            const storedObj = {
                locName: regionUser.data.setRegion.locationName,
                locCoords: regionUser.data.setRegion.locationCoords,
            }
            sessionStorage.setItem(searchStr, JSON.stringify(storedObj));
        }
    } 

    const token: string | null = localStorage.getItem("jwtToken");

    const { data: rideData, loading: rideLoading, refetch: ridesRefetch } = useQuery(FETCH_RIDES, {
        context: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
        variables: eventParams,
    });

    const handleSubmit = async () => {
        // await setRegion();
        setEventParams((prevVals) => ({
            ...prevVals,
            location: searchName.trim().toLowerCase(),
            radius: radius,
            bikeType: bikeType,
            wkg: wkg,
        }));

        await setReload(prevReload => !prevReload);
    };

    useEffect(() => {
        if (reload !== null){ridesRefetch()}
    }, [reload]);


    useEffect(() => {
        // Logic to sort rides based on sortingOrder
        let sortedRides = [];
    
        if (rideData && rideData.getEvents) {
            sortedRides = [...rideData.getEvents]; // Create a copy to avoid mutating the original state
            console.log("SORTING!")
            if (sortingOrder === "date_asc") {
                sortedRides.sort((a, b) => Number(new Date(a.startTime)) - Number(new Date(b.startTime)));
            } else if (sortingOrder === "date_desc") {
                sortedRides.sort((a, b) => Number(new Date(b.startTime)) - Number(new Date(a.startTime)));
            } else if(sortingOrder == "wpkg_asc"){
                sortedRides.sort((a, b) => Number(b.difficulty.slice(0, 3)) - Number(a.difficulty.slice(0, 3)));
            } else if(sortingOrder == "wpkg_desc"){
                sortedRides.sort((a, b) => Number(a.difficulty.slice(0, 3)) - Number(b.difficulty.slice(0, 3)));
            }
    
            setSortedRideData(sortedRides);
        }
    
    }, [rideData, sortingOrder]); // Re-run this effect when either rideData or sortingOrder changes

    return (
        
        <>
            <Navbar />
            <div className="rides-feed-main-container" >
                <div className="rides-feed-grid" >
                    <div className="rides-feed-filters" >

                        <h4>Apply filters</h4>

                        <div className="rides-feed-filter-options" >
                            <h5>Match</h5>
                            <label htmlFor="great-match" >
                                <input name="great match" onChange={handleCheckboxChange} id="great-match" type="checkbox" />
                                <div>
                                    <span>Great match</span>
                                    <i className="fa-solid fa-circle-check"></i>
                                </div>
                            </label>
                            <label htmlFor="good-match" >
                                <input name="good match" onChange={handleCheckboxChange} id="good-match" type="checkbox" /> 
                                <div>
                                    <span>Good match</span>
                                    <i className="fa-solid fa-circle-minus"></i>
                                </div>
                            </label>
                            <label htmlFor="poor-match" >
                                <input name="poor match" onChange={handleCheckboxChange} id="poor-match" type="checkbox" />
                                <div>
                                    <span>Poor match</span>
                                    <i className="fa-solid fa-circle-xmark"></i>
                                </div>
                            </label>
                        </div>

                        <div className="rides-feed-filter-options" >
                            <h5>Bike type</h5>
                            <label htmlFor="mountain-bike" >
                                <input name="Mountain bike" onChange={handleCheckboxChange} id="bike" type="checkbox" /> Mountain
                            </label>
                            <label htmlFor="road-bike" >
                                <input name="Road bike" onChange={handleCheckboxChange} id="bike" type="checkbox" /> Road
                            </label>
                            <label htmlFor="hybrid-bike" >
                                <input name="Hybrid bike" onChange={handleCheckboxChange} id="bike" type="checkbox" /> Hybrid
                            </label>
                            <label htmlFor="touring-bike" >
                                <input name="Touring bike" onChange={handleCheckboxChange} id="bike" type="checkbox" /> Touring
                            </label>
                            <label htmlFor="gravel-bike" >
                                <input name="Gravel bike" onChange={handleCheckboxChange} id="bike" type="checkbox" /> Gravel
                            </label>
                        </div>

                        <div className="rides-feed-filter-options" >
                            <h5>Watts/kilo range</h5>
                            <label htmlFor="wkg-range-1" >
                                <input name="Above 4.5" onChange={handleCheckboxChange} id="wkg" type="checkbox" />Above 4.5
                            </label>
                            <label htmlFor="wkg-range-2" >
                                <input name="4.1 to 4.5" onChange={handleCheckboxChange} id="wkg" type="checkbox" />4.1 to 4.5
                            </label>
                            <label htmlFor="wkg-range-3" >
                                <input name="3.8 to 4.1" onChange={handleCheckboxChange} id="wkg" type="checkbox" />3.8 to 4.1
                            </label>
                            <label htmlFor="wkg-range-4" >
                                <input name="3.5 to 3.8" onChange={handleCheckboxChange} id="wkg" type="checkbox" />3.5 to 3.8
                            </label>
                            <label htmlFor="wkg-range-5" >
                                <input name="3.2 to 3.5" onChange={handleCheckboxChange} id="wkg" type="checkbox" />3.2 to 3.5
                            </label>
                            <label htmlFor="wkg-range-6" >
                                <input name="2.9 to 3.2" onChange={handleCheckboxChange} id="wkg" type="checkbox" />2.9 to 3.2
                            </label>
                            <label htmlFor="wkg-range-7" >
                                <input name="2.6 to 2.9" onChange={handleCheckboxChange} id="wkg" type="checkbox" />2.6 to 2.9
                            </label>
                            <label htmlFor="wkg-range-8" >
                                <input name="2.3 to 2.6" onChange={handleCheckboxChange} id="wkg" type="checkbox" />2.3 to 2.6
                            </label>
                            <label htmlFor="wkg-range-9" >
                                <input name="2.0 to 2.3" onChange={handleCheckboxChange} id="wkg" type="checkbox" />2.0 to 2.3
                            </label>
                            <label htmlFor="wkg-range-10" >
                                <input name="Below 2.0" onChange={handleCheckboxChange} id="wkg" type="checkbox" />Below 2.0
                            </label>
                        </div>

                        <div className="rides-feed-filter-options" >

                            <h5>Search Region</h5>                            

                            <div className="geolocation-radius-filter" >
                                <label>Location:</label>
                                <input onChange={e => {setSearchName(e.target.value)}} type="text" pattern="[0-9]{5}" title="Five digit zip code" value={searchName}/>
                            </div>

                            <label htmlFor="">
                                Range: 
                                <input type="range" min="1" max="100" value={radius} onChange={handleSliderChange} /> {radius == 100 ? radius + "+" : radius} km
                            </label>

                        </div>

                        <div className="rides-feed-filter-search" >
                            <Button onClick={handleSubmit} type="primary">Search</Button>
                        </div>

                        <div className="rides-feed-filters-applied">
                            {appliedFilters.map((filter, index) => (
                                <div key={index}>{filter}</div> // Using index as key because filter values might not be unique
                            ))}
                        </div>

                    </div>

                    <div className="rides-feed-results" >
                        <div className="rides-feed-header" >
                            {rideData ? (
                                    <h4>Showing {rideData.getEvents.length} rides:</h4>
                                ) : (
                                    <></>
                        )}<div>
                                <span>Sort by: </span>
                                <select value={sortingOrder} onChange={e => setSortingOrder(e.target.value)} >
                                    <option value="" >-- Select option --</option>
                                    <option value="date_asc">Date: Newest to Oldest</option>
                                    <option value="date_desc">Date: Oldest to Newest</option>
                                    <option value="wpkg_asc">Watts per kilo: High to Low</option>
                                    <option value="wpkg_desc">Watts per kilo: Low to High</option>
                                    <option disabled value="distance-asc" >Distance: Long to short</option>
                                    <option disabled value="distance-desc" >Distance: Short to long</option>
                                    <option disabled value="match-asc" >Match: best to worst</option>
                                    <option disabled value="match-desc" >Match: worst to best</option>
                                </select>
                            </div>
                        </div>

                        <div className="rides-feed-rides" >
                            {regionLoading || rideLoading ? (
                                <p>Loading...</p>
                            ) : (
                                rideData && sortedRideData ? (
                                    sortedRideData.map((event: RideFeedCardProps, index: number) => {
                                        return (
                                            <RideFeedCard key={index} {...event} ></RideFeedCard>
                                        );
                                    })
                                ) : (
                                    <></>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

const FETCH_USER_QUERY = gql`
  query getUser($username: String!) {
    getUser(username: $username) {
        locationName
        locationCoords
        radius
    }
  }
`;

const SET_REGION_MUTATION = gql`
    mutation Mutation(
        $username: String!
        $locationName: String
        $locationCoords: [Float]
        $radius: Float
    ) {
        setRegion(
            setRegionInput: {
                username: $username
                locationName: $locationName
                locationCoords: $locationCoords
                radius: $radius
            }
        ) {
            locationName
            locationCoords
            radius
        }
    }
`
const FETCH_RIDES = gql`
    query getEvents(
        $page: Int
        $pageSize: Int
        $startDate: Date!
        $endDate: Date
        $bikeType: [String!]
        $wkg: [String!]
        $location: String
        $radius: Int
        $match: [String]
    ) {
        getEvents(
            getEventsInput: {
                page: $page
                pageSize: $pageSize
                startDate: $startDate
                endDate: $endDate
                bikeType: $bikeType
                wkg: $wkg
                location: $location
                radius: $radius
                match: $match
            }
        ) {
            _id
            host
            name
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
`

export default RidesFeed;