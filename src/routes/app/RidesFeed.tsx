import Navbar from "../../components/Navbar";
import RideFeedCard from "../../components/RideFeedCard";
import "../../styles/rides-feed.css";
import dummyData from "../../mockData/ridesFeedMockUp.json";
import { useState } from "react";
import Button from "../../components/Button";

const RidesFeed = () => {

    const [radius, setRadius] = useState(50); // Default radius value


    const handleSliderChange = (event: any) => {
        const newRadius = event.target.value;
        setRadius(newRadius);
        
    };

    const handleClick = () => {
        console.log('Button clicked');
    };

    return (
        
        <>
            <Navbar />
            <div className="rides-feed-main-container" >
                <div className="rides-feed-grid" >
                    <div className="rides-feed-filters" >

                        <h4>Apply filters</h4>

                        <div className="rides-feed-filter-options" >
                            <h6>Match</h6>
                            <label htmlFor="great-match" >
                                <input id="great-match" type="checkbox" /> Great match
                            </label>
                            <label htmlFor="good-match" >
                                <input id="good-match" type="checkbox" /> Good match
                            </label>
                            <label htmlFor="poor-match" >
                                <input id="poor-match" type="checkbox" /> Poor match
                            </label>
                        </div>

                        <div className="rides-feed-filter-options" >
                            <h6>Bike type</h6>
                            <label htmlFor="great-match" >
                                <input type="checkbox" /> Mountain
                            </label>
                            <label htmlFor="good-match" >
                                <input type="checkbox" /> Cycling
                            </label>
                            <label htmlFor="poor-match" >
                                <input type="checkbox" /> Other
                            </label>
                        </div>

                        <div className="rides-feed-filter-options" >

                            <h6>Location radius</h6>                            

                            <div className="geolocation-radius-filter" >
                                <label>ZIP Code</label>
                                <input type="text" pattern="[0-9]{5}" title="Five digit zip code" />
                            </div>

                            <label htmlFor="">
                                Range: 
                                <input type="range" min="1" max="100" value={radius} onChange={handleSliderChange} /> {radius == 100 ? radius + "+" : radius} miles
                            </label>

                        </div>

                        <div className="rides-feed-filter-search" >
                            <Button onClick={handleClick} type="primary">Search</Button>
                        </div>

                    </div>

                    <div className="rides-feed-results" >
                        <div className="rides-feed-header" >
                            <h4>Showing {dummyData.length} rides:</h4>
                            <div>
                                <span>Sort by: </span>
                                <select>
                                    <option>-- Select option --</option>
                                    <option>Match: best to worst</option>
                                    <option>Match: worst to best</option>
                                    <option>Distance: Long to short</option>
                                    <option>Distance: Short to long</option>
                                    <option>Difficulty: Easy to hard</option>
                                    <option>Difficulty: Hard to easy</option>
                                </select>
                            </div>
                        </div>

                        <div className="rides-feed-rides" >
                            {dummyData.map((event, index) => {
                                return (
                                    <RideFeedCard key={index} {...event} ></RideFeedCard>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

export default RidesFeed;