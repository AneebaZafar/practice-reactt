import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

const App = () => {
    const [telescopes, setTelescopes] = useState([]);
    const [eyepieces, setEyepieces] = useState([]);
    const [selectedTelescope, setSelectedTelescope] = useState(null);
    const [selectedEyepiece, setSelectedEyepiece] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activePanel, setActivePanel] = useState(""); // Tracks which panel to show
    const [location, setLocation] = useState({ name: "", latitude: "", longitude: "" });
    const [dateTime, setDateTime] = useState({ date: "", time: "" });
    const [isSliding, setIsSliding] = useState(true);

    // Fetch telescopes and eyepieces
    const fetchData = useCallback(async () => {
        if (telescopes.length && eyepieces.length) return;
        setLoading(true);
        setError("");

        try {
            const [telescopesRes, eyepiecesRes] = await Promise.all([
                axios.get("http://localhost:5000/telescopes"),
                axios.get("http://localhost:5000/eyepieces"),
            ]);

            setTelescopes(telescopesRes.data || []);
            setEyepieces(eyepiecesRes.data || []);
        } catch (err) {
            setError("Error fetching data. Check your API.");
        } finally {
            setLoading(false);
        }
    }, [telescopes, eyepieces]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    useEffect(() => {
        setTimeout(() => setIsSliding(false), 3000); // Stop animation after 3 seconds
    }, []); // Runs only once on mount


    // Submit Configuration and Hide Panel
    const handleConfigureSubmit = () => {
        if (!selectedTelescope || !selectedEyepiece) {
            setError("Please select both a telescope and an eyepiece.");
            return;}    
        console.log("Configuration Saved:", { selectedTelescope, selectedEyepiece });
        setActivePanel(""); // Hide config panel
    };

    // Submit Location
    const handleLocationSubmit = () => {
        if (!location.name || !location.latitude || !location.longitude) {
            setError("Please fill in all location fields.");
            return;
        }
        console.log("Location Saved:", location);
        setActivePanel(""); // Hide location panel
    };

    // Submit Date & Time
    const handleDateTimeSubmit = () => {
        if (!dateTime.date || !dateTime.time) {
            setError("Please select both date and time.");
            return;
        }
        console.log("Date & Time Saved:", dateTime);
        setActivePanel(""); // Hide date/time panel
    };

    return (
        <div className="app">
            {/* Navbar */}
            <nav className="navbar">
                <button onClick={() => setActivePanel("location")}>Graphical Location</button>
                <button onClick={() => setActivePanel("config")}>Configuration</button>
                <button onClick={() => setActivePanel("datetime")}>Date & Time</button>
                <button onClick={() => setActivePanel("learnmore")}>Learn More</button>
            </nav>
            <header className={`header ${isSliding ? "slide" : ""}`}>
                <h1>TELESCOPIC VIEWS LIVE!</h1>
            </header>

            {/* Configuration Panel */}
            {activePanel === "config" && (
                <div className="config-panel">
                    <h2>Configure Telescope & Eyepiece</h2>

                    <label>Select Telescope:</label>
                    <Select
                        options={telescopes.map(t => ({ value: t.tel_name, label: t.tel_name }))}
                        onChange={setSelectedTelescope}
                        isLoading={loading}
                        placeholder="Search telescope..."
                        className="search-bar"
                        styles={{
                            option: (provided, state) => ({
                                ...provided,
                                color: state.isFocused ? "white" : "rgba(0, 0, 0, 0.7)",
                                borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                            }),
                        }}
                    />

                    <label>Select Eyepiece:</label>
                    <Select
                        options={eyepieces.map(e => ({ value: e.focal_length, label: `${e.focal_length}mm` }))}
                        onChange={setSelectedEyepiece}
                        isLoading={loading}
                        placeholder="Search eyepiece..."
                        className="search-bar"
                        styles={{
                            option: (provided, state) => ({
                                ...provided,
                                color: state.isFocused ? "white" : "rgba(0, 0, 0, 0.7)",
                                borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
                            }),
                        }}
                    />

                    {error && <p className="error">{error}</p>}
                    <button className="enter-button" onClick={handleConfigureSubmit}>Enter</button>
                </div>
            )}

            {/* Location Panel */}
            {activePanel === "location" && (
                <div className="config-panel">
                    <h2>Set Graphical Location</h2>
                    <label>Location Name:</label>
                    <input type="text" value={location.name} onChange={(e) => setLocation({ ...location, name: e.target.value })} />
                    
                    <label>Latitude:</label>
                    <input type="text" value={location.latitude} onChange={(e) => setLocation({ ...location, latitude: e.target.value })} />

                    <label>Longitude:</label>
                    <input type="text" value={location.longitude} onChange={(e) => setLocation({ ...location, longitude: e.target.value })} />

                    <button  className="enter-button" onClick={handleLocationSubmit}>Enter</button>
                </div>
            )}

            {/* Date & Time Panel */}
            {activePanel === "datetime" && (
                <div className="config-panel">
                    <h2>Set Date & Time</h2>
                    <label>Date:</label>
                    <input type="date" value={dateTime.date} onChange={(e) => setDateTime({ ...dateTime, date: e.target.value })} />

                    <label>Time:</label>
                    <input type="time" value={dateTime.time} onChange={(e) => setDateTime({ ...dateTime, time: e.target.value })} />

                    <button  className="enter-button" onClick={handleDateTimeSubmit}>Enter</button>
                </div>
            )}

            {/* Learn More Panel (Empty for now) */}
            {activePanel === "learnmore" && (
                <div className="config-panel">
                    <h2>Learn More</h2>
                    <p>Coming soon...</p>
                </div>
            )}
        </div>
    );
};

export default App;
