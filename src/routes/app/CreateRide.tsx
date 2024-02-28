import Button from "../../components/Button";
import Navbar from "../../components/Navbar";
import "../../styles/create-ride.css";

const CreateRide = () => {
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
                        <label htmlFor="ride-name" >Ride duration</label>
                        <input id="ride-name" onChange={() => null} type="number" />
                    </div>

                    <div className="create-ride-form-input" >
                        <label htmlFor="ride-name" >Difficulty</label>
                        <select>
                            <option selected disabled >-- Select difficulty --</option>
                            <option>Very easy</option>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                            <option>Very hard</option>
                        </select>
                    </div>

                    <div className="create-ride-form-input" >
                        <label htmlFor="ride-name" >Equipment type</label>
                        <select>
                            <option selected disabled >-- Select equipment type --</option>
                            <option>Mountain bike</option>
                            <option>Road bike</option>
                            <option>Hybrid bike</option>
                            <option>Touring bike</option>
                            <option>Gravel bike</option>
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