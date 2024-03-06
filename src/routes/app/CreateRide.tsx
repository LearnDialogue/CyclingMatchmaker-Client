import { useState } from "react";
import Button from "../../components/Button";
import Navbar from "../../components/Navbar";
import "../../styles/create-ride.css";

const CreateRide = () => {

    const [difficulty, setDifficulty] = useState("");
    const [bicycleType, setBicycleType] = useState("");


    return (
        <>
            <Navbar />
            <div className="create-ride-main-container" >
                <div className="create-ride-form-container" >
                    
                    <h2>Create a ride</h2>
                    
                    <div className="create-ride-form-input" >
                        <label htmlFor="ride-name" >Ride name</label>
                        <input id="ride-name" onChange={() => null} type="text" />
                    </div>

                    <div className="create-ride-form-input" >
                        <label htmlFor="ride-name" >Date</label>
                        <input id="ride-name" onChange={() => null} type="date" min={new Date().toISOString().split('T')[0]} />
                    </div>

                    <div className="create-ride-form-input" >
                        <label htmlFor="ride-name" >Start time</label>
                        <input id="ride-name" onChange={() => null} type="time" />
                    </div>

                    <div className="create-ride-form-input" >
                        <label htmlFor="ride-name" >Distance <span>*in km</span></label>
                        <input id="ride-name" onChange={() => null} type="number" />
                    </div>

                    <div className="create-ride-form-input">
                        <label htmlFor="difficulty">Watts/kilo</label>
                        <select id="difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                            <option value="" disabled>-- Select difficulty --</option>
                            <option value="Very hard">A+ - 4.6+</option>
                            <option value="Hard">A - 4.0 to 4.6</option>
                            <option value="Medium">B - 3.2 to 4.0</option>
                            <option value="Easy">C - 2.5 to 3.2</option>
                        </select>
                    </div>

                    <div className="create-ride-form-input" >
                        <label htmlFor="bicycle-type" >Bicycle type</label>
                        <select id="bicycle-type" value={bicycleType} onChange={e => setBicycleType(e.target.value)} >
                            <option value="" disabled >-- Select bicycle type --</option>
                            <option value="Mountain bike" >Mountain bike</option>
                            <option value="Road bike" >Road bike</option>
                            <option value="Hybrid bike" >Hybrid bike</option>
                            <option value="Touring bike" >Touring bike</option>
                            <option value="Gravel bike" >Gravel bike</option>
                        </select>
                    </div>

                    <div className="create-ride-form-input" >
                        <label htmlFor="ride-name" >Description</label>
                        <textarea placeholder="Enter details such as number of stops, rules," id="ride-name" onChange={() => null} />
                    </div>

                    <Button disabled type="primary" >Create ride</ Button>
                </div>
            </div>
        </>
    )
};


export default CreateRide;