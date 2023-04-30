import React, { useEffect, useState } from 'react'
import { json, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './App.css';
import Row from './components/Row.jsx';
import Header from './components/Header.jsx';


function Home() {
// TODO: Refresh page when a preset is deleted
// TODO: Load preset into graph page

    const [email, setUsername] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [graphData, setGraphData] = useState([]);
    const navigate = useNavigate(); 
    
    // on component load -> check auth
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
            setIsAdmin(decodedToken.isAdmin)
        } catch(err){
            console.error(err);
            navigate('/login');
            return
        }

    },[]);

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

    // Remove localstorage token and return user to login screen
    const logoutRoute = () =>{ 
        localStorage.removeItem("token");
        navigate("/login"); 
    }

    const graphRoute = () =>{
        navigate("/Graph");
    }

    return (
        <div className="App">
            <h1>Welcome {email}</h1>
            <p>You are logged in!</p>
            <div>
                <button className='btn btn-success mx-1' onClick={graphRoute}>Graphs</button>
                <button className='btn btn-success mx-1' onClick={logoutRoute}>Logout</button>
            </div>

            <h3 className="text-start mt-5">Your Saved Graphs</h3>

            <div className="container border p-0 bg-light">
                <Header title="Title" type="Type" count="Count" style="fw-bold text-bg-secondary"/>
                {graphData.map((data, index) => { 
                    return <Row key={index} index={data.index} title={data.title} type={data.type} count={data.count}/>
                })}
            </div>
        </div>
    )
}

export default Home
