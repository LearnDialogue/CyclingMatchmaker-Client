import { useState } from "react";
import Button from "../../components/Button";
import Navbar from "../../components/Navbar";
import "../../styles/create-ride.css";

const CreateRide = () => {

    const [rideName, setRideName] = useState<string>("");
    const [rideDate, setRideDate] = useState<string>("");
    const [rideStart, setRideStart] = useState<string>("");
    const [bicycleType, setBicycleType] = useState<string>("");
    const [difficulty, setDifficulty] = useState<string>("");
    const [rideAverageSpeed, setRideAverageSpeed] = useState<string>("");

    const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDifficulty(e.target.value);
    };

    const enableButton = () => {
        return rideName != "" && rideDate != "" && rideStart != "" && bicycleType != "" && difficulty != "" && rideAverageSpeed != "";
    }


    return (
        <>
            <Navbar />
            <div className="create-ride-main-container" >
                <div className="create-ride-form-container" >
                    
                    <h2>Create a ride</h2>
                    
                    <div className="create-ride-form-input" >
                        <label htmlFor="ride-name" >Ride name</label>
                        <input id="ride-name" onChange={e => setRideName(e.target.value)} type="text" value={rideName} />
                    </div>

                    <div className="create-ride-form-input" >
                        <label htmlFor="ride-date" >Date</label>
                        <input id="ride-date" onChange={e => setRideDate(e.target.value)} type="date" value={rideDate} min={new Date().toISOString().split('T')[0]} />
                    </div>

                    <div className="create-ride-form-input" >
                        <label htmlFor="ride-start-time" >Start time</label>
                        <input id="ride-start-time" onChange={e => setRideStart(e.target.value)} type="time" value={rideStart} />
                    </div>

                    <div className="create-ride-form-input">
                        <label htmlFor="ride-difficulty">Watts/kilo</label>
                        <select id="ride-difficulty" value={difficulty} onChange={handleDifficultyChange} >
                            <option value="" disabled>-- Select difficulty --</option>
                            <option value="Above 4.5">Above 4.5</option>
                            <option value="4.1 to 4.5">4.1 to 4.5</option>
                            <option value="3.8 to 4.1">3.8 to 4.1</option>
                            <option value="3.5 to 3.8">3.5 to 3.8</option>
                            <option value="3.2 to 3.5">3.2 to 3.5</option>
                            <option value="2.9 to 3.2">2.9 to 3.2</option>
                            <option value="2.6 to 2.9">2.6 to 2.9</option>
                            <option value="2.3 to 2.6">2.3 to 2.6</option>
                            <option value="2.0 to 2.3">2.0 to 2.3</option>
                            <option value="Below 2.0">Below 2.0</option>
                        </select>
                    </div>

                    <div className="create-ride-form-input" >
                        <label htmlFor="ride-average-speed" >Average speed (mph)</label>
                        <input id="ride-average-speed" onChange={e => setRideAverageSpeed(e.target.value)} type="number" />
                    </div>

                    <div className="create-ride-form-input" >
                        <label htmlFor="ride-bicycle-type" >Bicycle type</label>
                        <select id="ride-bicycle-type" value={bicycleType} onChange={e => setBicycleType(e.target.value)} >
                            <option value="" disabled >-- Select bicycle type --</option>
                            <option value="Mountain bike" >Mountain bike</option>
                            <option value="Road bike" >Road bike</option>
                            <option value="Hybrid bike" >Hybrid bike</option>
                            <option value="Touring bike" >Touring bike</option>
                            <option value="Gravel bike" >Gravel bike</option>
                        </select>
                    </div>

                    <div className="create-ride-form-input" >
                        <label htmlFor="ride-description" >Description</label>
                        <textarea placeholder="Enter details such as number of stops, rules," id="ride-name" onChange={() => null} />
                    </div>

                    <Button disabled={!enableButton()} type="primary" >Create ride</ Button>
                </div>
            </div>
        </>
    )
};


export default CreateRide;