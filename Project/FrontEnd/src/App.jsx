import React from 'react'
import { useNavigate } from 'react-router-dom';
import './App.css'

function App() {
  
  const navigate = useNavigate(); 

  const loginRoute = () =>{ 
    navigate("./login"); 
  }

  return (
    <div className="App">
      <h1>Welcome</h1>
      <div>
        <button className='btn btn-success' onClick={loginRoute}>Login</button>
      </div>
    </div>
  )
}

export default App
