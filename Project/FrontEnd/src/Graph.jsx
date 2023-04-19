import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './App.css'

function Graph() {
  
  const [username, setUsername] = useState(null);
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

          setUsername(decodedToken.username)
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

  const homeRoute = () =>{
    navigate("../Home");
  }

  return (
      <div className="App">
        <h1>Here are the "VERY" important graphs</h1>
        <div>
            <button className='btn btn-success mx-1' onClick={homeRoute}>Home</button>
            <button className='btn btn-success mx-1' onClick={logoutRoute}>Logout</button>
        </div>
      </div>
  )
}

export default Graph