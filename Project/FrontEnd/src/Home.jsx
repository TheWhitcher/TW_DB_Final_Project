import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './App.css'

function Home() {
  
    const [email, setUsername] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate(); 

    // on component load -> check auth
    useEffect(() => {
        // verify auth
        const token = localStorage.getItem('token');

        if(!token){
            navigate('/login');
            return
        }
        try{
            const decodedToken = jwt_decode(token);

            setUsername(decodedToken.email)
            setIsAdmin(decodedToken.isAdmin)
        } catch(err){
            console.error(err);
            navigate('/login');
            return
        }

    },[])
    const logoutRoute = () =>{ 
        localStorage.removeItem("token");
        navigate("../"); 
    }

    const graphRoute = () =>{
        navigate("../Graph");
      }

    return (
        <div className="App">
            <h1>Welcome {email}</h1>
            <p>You are logged in! {isAdmin? "You are an admin BTW.": ""}</p>
            <div>
                <button className='btn btn-success mx-1' onClick={graphRoute}>Graphs</button>
                <button className='btn btn-success mx-1' onClick={logoutRoute}>Logout</button>
            </div>

            <h3 className="text-start mt-5">Your Saved Graphs</h3>
        </div>
    )
}

export default Home
