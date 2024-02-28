import Navbar from "../../components/Navbar";
import RideFeedCard from "../../components/RideFeedCard";
import "../../styles/rides-feed.css";


const dummyData = [
    {
        host: "username123",
        name: "Cool race",
        startTime: "11:00 am",
        date: "03/10/2024",
        description: "This is such a cool and fun ride! Beware, it is challlenging.",
        bikeType: "Mountain bike",
        difficulty: "Advanced",
        wattsPerKilo: 4,
        intensity: "Medium",
        route: null,
        match: "great",
    },
    {
        host: "lance.armstrong",
        name: "Cooler race",
        startTime: "05:00 am",
        date: "03/10/2024",
        description: "Get ready",
        bikeType: "Cycling bike",
        difficulty: "Expert",
        wattsPerKilo: 7,
        intensity: "Very High",
        route: null,
        match: "great",
    },
    {
        host: "john.doe",
        name: "John's race",
        startTime: "11:00 pm",
        date: "03/10/2024",
        description: "This is such a cool and fun ride! Beware, it is challlenging.",
        bikeType: "Mountain bike",
        difficulty: "Advanced",
        wattsPerKilo: 4,
        intensity: "Medium",
        route: null,
        match: "good",
    },
    {
        host: "username11231323",
        name: "First race",
        startTime: "11:00 am",
        date: "04/12/2024",
        description: "This is such a cool and fun ride! Beware, it is challlenging.",
        bikeType: "Mountain bike",
        difficulty: "Advanced",
        wattsPerKilo: 4,
        intensity: "Medium",
        route: null,
        match: "poor",
    },
    {
        host: "username1222333",
        name: "Another race",
        startTime: "06:00 am",
        date: "03/17/2024",
        description: "This is such a cool and fun ride! Beware, it is challlenging.",
        bikeType: "Mountain bike",
        difficulty: "Advanced",
        wattsPerKilo: 4,
        intensity: "Medium",
        route: null,
        match: "poor",
    }
]

const RidesFeed = () => {

    return (
        
        <>
            <Navbar />
            <div className="rides-feed-main-container" >
                <div className="rides-feed-grid" >
                    <div className="rides-feed-header" >
                        <h3>Showing {dummyData.length} rides:</h3>
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
                    {dummyData.map((event) => {
                        return (
                            <RideFeedCard {...event} ></RideFeedCard>
                        );
                    })}
                </div>
            </div>
        </>
    )
};

export default RidesFeed;