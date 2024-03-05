import { useState } from "react";
import Button from "../../components/Button";
import Navbar from "../../components/Navbar";
import "../../styles/create-ride.css";

const CreateRide = () => {

    const [difficulty, setDifficulty] = useState("");
    const [equipmentType, setEquipmentType] = useState("");


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
                        <label htmlFor="difficulty">Watts/kilo range</label>
                        <select id="difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                            <option value="" disabled>-- Select difficulty --</option>
                            <option value="Very easy">1 - 2.4</option>
                            <option value="Easy">2.5 - 3.1</option>
                            <option value="Medium">3.2 - 4</option>
                            <option value="Hard">4 - 5</option>
                            <option value="Very hard">5+</option>
                        </select>
                    </div>

                    <div className="create-ride-form-input" >
                        <label htmlFor="equipment-type" >Equipment type</label>
                        <select id="equipment-type" value={equipmentType} onChange={e => setEquipmentType(e.target.value)} >
                            <option value="" disabled >-- Select equipment type --</option>
                            <option value="Mountain bike" >Mountain bike</option>
                            <option value="Road bike" >Road bike</option>
                            <option value="Hybrid bike" >Hybrid bike</option>
                            <option value="Touring bike" >Touring bike</option>
                            <option value="Gravel bike" >Gravel bike</option>
                        </select>
                    </div>

                    <div className="create-ride-form-input" >
                        <label htmlFor="ride-name" >Notes</label>
                        <textarea id="ride-name" onChange={() => null} />
                    </div>

                    <Button disabled type="primary" >Create ride</ Button>
                </div>
            </div>
        </>
    )
};


export default CreateRide;