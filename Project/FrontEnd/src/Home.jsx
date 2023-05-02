import React, { useEffect, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './App.css';
import Row from './components/Row.jsx';
import Header from './components/Header.jsx';

function Home() {
    const [email, setUsername] = useState(null);
    const [graphData, setGraphData] = useState([]);
    const navigate = useNavigate(); 

    
    // Verify access token, and set up page.
    useEffect( () => {
        // verify auth
        const token = localStorage.getItem('token');

        if(!token){
            navigate('/login');
            return
        }
        try{
            const decodedToken = jwt_decode(token);
            fetchPresets();
            setUsername(decodedToken.email)
        } catch(err){
            console.error(err);
            navigate('/login');
            return
        }

    },[]);

    // TODO: Localhost URL
    // Get user presets form the database
    const fetchPresets = async (e) => {
        const token = localStorage.getItem('token');
        const url = 'http://localhost:8080/user/graphs';
        const options = {
          method: 'GET',
          headers: {
            authorization: token,
          }
        }

        const response = await fetch(url, options)
        const jsonResponse = await response.json();
        setGraphData(jsonResponse.graphPresets)
    }

    // Remove localstorage token and return user to login screen.
    const logoutRoute = () =>{ 
        localStorage.removeItem("token");
        navigate("/login"); 
    }

    // Navigate to Graph page with default preset.
    const graphRoute = () =>{
        localStorage.setItem("presetID", "default");
        navigate("/Graph");
    }

    // TODO: Localhost url
    // Make a delete request.
    async function deletePreset(){
        const id = localStorage.getItem("presetID");
        const index = {index: id};

        const url = "http://localhost:8080/user/deletePreset"
        const options = {
            method: 'DELETE',
            headers: {
                'authorization': localStorage.getItem("token"),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(index)
        }

        const response = await fetch(url, options);
        if (response.ok){
            document.getElementById("modalClose").click();
            const newData = graphData.filter((data) => data.index != id)
            setGraphData(newData);
        }
    }

    // Load preset into localsotrage.
    async function loadPreset(i){
        localStorage.setItem("presetID", i);
        navigate("/Graph");
    }

    function deleteTracker(index){
        localStorage.setItem("presetID", index);
    }

    return (
        <div className="App">
            <h1>Welcome {email}</h1>
            <p>You are logged in!</p>

            <div>
                <button className='btn btn-primary btn-sm mx-1' onClick={graphRoute}>Explore</button>
                <button className='btn btn-danger btn-sm mx-1' onClick={logoutRoute}>Logout</button>
            </div>
            <h3 className="text-start mt-2">Your Saved Graphs</h3>

            <div className="container border p-0 bg-secondary">
                <Header title="Title" type="Type" count="Count" style="fw-bold bg-dark"/>
                {graphData.map((data, index) => { 
                    return <Row key={index} index={data.index} title={data.title} type={data.type} count={data.count} deleteTracker={deleteTracker} loadPreset={loadPreset}/>
                })}
            </div>

            <div className="modal fade text-black" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalLabel">Are you sure you want to delete this preset?</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        
                        <div className="modal-body mb-3">
                            <button type="button" className="btn btn-success btn-lg me-5" onClick={deletePreset}>Delete</button>
                            <button type="button" className="btn btn-danger btn-lg" id="modalClose" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
