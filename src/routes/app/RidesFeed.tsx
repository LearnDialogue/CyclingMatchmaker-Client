import Navbar from "../../components/Navbar";
import RideFeedCard from "../../components/RideFeedCard";
import "../../styles/rides-feed.css";
import dummyData from "../../mockData/ridesFeedMockUp.json";
import { useState } from "react";
import Button from "../../components/Button";

const RidesFeed = () => {

    const [radius, setRadius] = useState(50); // Default radius value

    const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked, value } = event.target;

        console.log("name " + name);
        console.log("checked " + checked);
        console.log("value " + value);
    
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
                                <input name="mountain bike" onChange={handleCheckboxChange} id="mountain-bike" type="checkbox" /> Mountain
                            </label>
                            <label htmlFor="cycling-bike" >
                                <input name="cycling bike" onChange={handleCheckboxChange} id="cycling-bike" type="checkbox" /> Cycling
                            </label>
                            <label htmlFor="other-bike" >
                                <input name="other bike" onChange={handleCheckboxChange} id="other-bike" type="checkbox" /> Other
                            </label>
                        </div>

                        <div className="rides-feed-filter-options" >
                            <h5>Watts/kilo range</h5>
                            <label htmlFor="wkg-range-a+" >
                                <input name="4.6+" onChange={handleCheckboxChange} id="wkg-range-a+" type="checkbox" />4.6+
                            </label>
                            <label htmlFor="wkg-range-a" >
                                <input name="4.0 to 4.6" onChange={handleCheckboxChange} id="wkg-range-a" type="checkbox" /> 4.0 to 4.6
                            </label>
                            <label htmlFor="wkg-range-b" >
                                <input name="3.2 to 4.0" onChange={handleCheckboxChange} id="wkg-range-b" type="checkbox" />3.2 to 4.0
                            </label>
                            <label htmlFor="wkg-range-c" >
                                <input name="2.5 to 3.2" onChange={handleCheckboxChange} id="wkg-range-c" type="checkbox" />2.5 to 3.2
                            </label>
                        </div>

                        <div className="rides-feed-filter-options" >

                            <h5>Location radius</h5>                            

                            <div className="geolocation-radius-filter" >
                                <label>ZIP Code</label>
                                <input onChange={handleCheckboxChange} type="text" pattern="[0-9]{5}" title="Five digit zip code" />
                            </div>

                            <label htmlFor="">
                                Range: 
                                <input type="range" min="1" max="100" value={radius} onChange={handleSliderChange} /> {radius == 100 ? radius + "+" : radius} miles
                            </label>

                        </div>

                        <div className="rides-feed-filter-search" >
                            <Button onClick={handleClick} type="primary">Search</Button>
                        </div>

                        <div className="rides-feed-filters-applied">
                            {appliedFilters.map((filter, index) => (
                                <div key={index}>{filter}</div> // Using index as key because filter values might not be unique
                            ))}
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