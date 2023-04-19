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
      navigate("../"); 
  }

  return (
      <div className="App">
          <h1>Welcome {username}</h1>
          <p>Here are graphs! {isAdmin? "You are an admin BTW.": ""}</p>
          <button className='btn btn-success' onClick={logoutRoute}>Logout</button>
      </div>
  )
}

export default Graph