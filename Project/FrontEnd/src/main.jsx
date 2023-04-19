import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import Graph from './Graph'
// Import bootstrap
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'


ReactDOM.createRoot(document.getElementById('root')).render(
<BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}/>
      <Route path="/Login" element={<Login/>}/>
      <Route path="/Register" element={<Register/>}/>
      <Route path='/Home' element={<Home/>}/>
      <Route path='/Graph' element={<Graph/>}/>
    </Routes>
  </BrowserRouter>
)