import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import jwt_decode from 'jwt-decode';
import './App.css'
import { nanoid } from 'nanoid';
import ListItem from './components/ListItem.jsx';


function Graph() {
  
  const [presetLoaded, setPresetLoaded] = useState(false);
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setform] = useState({});
  const [graph, setGraph] = useState({});
  const [graphPreset, setPreset] = useState({index: "default",
    title: "Graph",
    type: "CO2",
    count: "Per Country",
    world: false,
    countries: [
      {id: "ARG", checked: false, country: "Argentina"},
      {id: "AUS", checked: false, country: "Australia"},
      {id: "BRA", checked: false, country: "Brazil"},
      {id: "CAN", checked: true, country: "Canada"},
      {id: "CHN", checked: true, country: "China"},
      {id: "EUU", checked: false, country: "European Union"},
      {id: "FRA", checked: false, country: "France"},
      {id: "DEU", checked: false, country: "Germany"},
      {id: "IND", checked: false, country: "India"},
      {id: "IDN", checked: false, country: "Indonesia"},
      {id: "ITA", checked: false, country: "Italy"},
      {id: "JPN", checked: true, country: "Japan"},
      {id: "MEX", checked: false, country: "Mexico"},
      {id: "RUS", checked: false, country: "Russia"},
      {id: "SAU", checked: false, country: "Saudi Arabia"},
      {id: "ZAF", checked: false, country: "South Africa"},
      {id: "KOR", checked: false, country: "South Korea"},
      {id: "ARG", checked: false, country: "Turkey"},
      {id: "BRT", checked: true, country: "United Kingdom"},
      {id: "USA", checked: true, country: "United States"},
    ]})
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
      loadPreset();
      setUsername(decodedToken.username);
      setIsAdmin(decodedToken.isAdmin);
    } 
    catch(err){
      console.error(err);
      navigate('/login');
      return
    }
  },[])

  // Set preset values
  async function loadPreset(){
    const token = localStorage.getItem('token');
    const url = 'http://localhost:8080/user/graphs';
    const options = {
      method: 'GET',
      headers: {
        authorization: token,
      }
    }
    const response = await fetch(url, options)

    if(response.ok){
      const id = localStorage.getItem("presetID");
      const jsonResponse = await response.json();
      
      if(id !== "default"){
        const index = jsonResponse.graphPresets.findIndex(element => {
          if(element.index === id){
            return true
          }
        });
        const preset = jsonResponse.graphPresets.splice(index,1);
        
        setPreset(preset[0]);
        setPresetLoaded(true);
      }
    }
  }

  // Handels change of input for most components
  function handleInputChange(key, newValue){
    form[key] = newValue;

    // Filter Country List by Search bar value
    if (key === "search"){      
      let filter = form[key].toUpperCase();
      const ul = document.getElementById("CountryList");
      const li = ul.getElementsByTagName('li');

      for (let i = 0; i < li.length; i++){
        const label = li[i].getElementsByTagName("label")[0];
        const textValue = label.textContent || label.innerText;
        if (textValue.toUpperCase().indexOf(filter) > -1){
          li[i].style.display = "";
        }
        else {
          li[i].style.display = "none";
        }
      }
    }

    // Enable/Disable Relative to world checkbox
    if (key === "count"){
       const checkbox = document.getElementById("relativeCheckbox")
        graphPreset.count = newValue
        if(newValue === "Per Country"){
          checkbox.disabled = false;
        }
        else{
          checkbox.checked = false;
          graphPreset.world = false;
          checkbox.disabled = true;
        }
      }
      
      if (key === "gasType"){
        graphPreset.type = newValue;
      }
      
      if (key === "r2worldTotal"){
        graphPreset.world = newValue;
      }

      if (key == "graphName"){
        graphPreset.title = newValue
      }

      setPreset(graphPreset);
    }
  
  // Handle checked countries
  function handleCountryList(_id, _checked){
    const index = graphPreset.countries.findIndex(element => {
      if(element.id === _id){
        return true
      }
    });

    graphPreset.countries[index].checked = _checked;

    setPreset(graphPreset);
  }

  // Log out brings to home page and removes localStorage token
  const logoutRoute = () =>{ 
    localStorage.removeItem("token");
    navigate("../"); 
  }

  // Returns to the home page
  const homeRoute = () =>{
    navigate("../Home");
  }

  // TODO: Currently not working
  // Make a request to run a python script that will generate a graph as an image.
  const generateGraph = async (e) =>{
    e.preventDefault();

    // TODO: create dynamic url link
    const url = 'http://localhost:8080/graph/generate';
    const options = {
      method: 'GET',
      headers: {
        authorization: localStorage.getItem("token"),
      }
    }
    
    try{
      const response = await fetch(url, options);
      const jsonResponse = await response.json();

      setGraph(jsonResponse.image); 
      console.log('jsonResponse.image: ', jsonResponse.image);
      if (response.status === 200){
        console.log("Success");
      }
      else{
        console.log("Generate Graph request Failed")
        console.log('error: ', error);
      }
    }
    catch (error){
      console.log("Generate Graph request Failed")
      console.log('error: ', error);
    }
  }

  // Saves current graph settings to the database
  const saveGraph = async (e) => {
    const input = document.getElementById("modalInput");
    graphPreset.index = nanoid();
    const url = 'http://localhost:8080/graph/save';
    const options = {
      method: 'POST',
      headers: {
        'authorization': localStorage.getItem("token"),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphPreset)
    }
    
    try{   
      if(input.value != ""){
        const response = await fetch(url, options);

        if (response.status === 200){
          input.value = "";
          document.getElementById("modalClose").click();
          console.log("Success");
        }
        else{
          console.log("Save request Failed")
          console.log('error: ', error);
        }
      } 
      else{
        alert("Graph name required");
      }  
    }
    catch (error){
      console.log("Save request Failed")
      console.log('error: ', error);
    }
  }

  // TODO: Maybe working, graph doesnt work for testing.
  // Download the generated graph image.
  const downloadGraph = () => {
    // const url = graph;
    // filename = "graph"
    // fetch(url)
    // .then(response => response.blob())
    // .then(blob => { saveAs(blob, filename);
    // });
  }

  return (
    <>
      {presetLoaded? (
        <div className="App">
            <div className="container">
              <div className="row text-start">
                <div className="col-3 ps-4 pt-4">
                    <button className='btn btn-primary btn-sm mx-4' onClick={homeRoute}>Home</button>
                    <button className='btn btn-danger btn-sm' onClick={logoutRoute}>Logout</button>
                </div>

                <div className="col-3">
                  <label htmlFor="gasType">Gas Type</label>
                  <div className="input-group mb-3">
                    <select className="form-select" id="GasTypeSelect" defaultValue={graphPreset.type} onChange={(event) => handleInputChange('gasType', event.target.value)}>
                      <option value="CO2">CO&#178;</option>
                      <option value="Methane">Methane</option>
                      <option value="N2O">Nitrous Oxide</option>
                    </select>
                  </div>
                </div>
                
                <div className="col-3">
                  <label htmlFor="gasType">Count</label>
                  <div className="input-group mb-3">
                    <select className="form-select" id="inputGroupSelect01" defaultValue={graphPreset.count} onChange={(event) => handleInputChange('count', event.target.value)}>
                      <option value="Per Country">Per Country</option>
                      <option value="Per Capita">Per Capita</option>
                      <option value="Per Dollar">Per $ of GDP</option>
                    </select>
                  </div>
                </div>

                <div className="col-3 px-0 pt-4">
                  <input className="form-check-input me-3" disabled={graphPreset.count !== "Per Country"}type="checkbox" defaultChecked={graphPreset.world} id="relativeCheckbox" onChange={(event) => handleInputChange('r2worldTotal', event.target.checked)}/>
                  <label className="form-check-label fs-6" htmlFor="worldTotal">Relative to world total</label>
                </div>
              </div>

              <div className="row">
                <div className="col-4 p-0">
                  <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text" id="searchCountry">&#128269;</span>
                    <input type="text" className="form-control" placeholder="Search a Country" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" onChange={(event) => handleInputChange('search', event.target.value)}/>
                  </div>

                  <ul className="list-group list-group-flush text-start navbar-nav-scroll border" id="CountryList">
                  {graphPreset.countries.map((data, index) => { 
                        return <ListItem key={index} index={data.index} country={data.country} id={data.id} checked={data.checked} handleCountryList={handleCountryList}/>
                    })}
                  </ul>
                </div>

                <div className="col-8">
                  <div className="container">
                    <div className="row">
                      <button className="btn btn-success" onClick={generateGraph}>Generate Graph</button>
                    </div>
                    
                    <div className="row">
                      <img src={graph} alt="Graph" id="GraphImage" style={{ width: '600px', }}/>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#staticBackdrop">Save</button> 
                      </div>

                      <div className="col-6">
                        <button className='btn btn-primary' onClick={downloadGraph}>Download</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="modalLabel">Graph Preset Name</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body mb-3">
                        <input type="text" className="form-control" id="modalInput" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder='Enter name here' required onChange={(event) => handleInputChange('graphName', event.target.value)}/>
                    </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-success" onClick={saveGraph}>Save</button>
                  <button type="button" className="btn btn-danger" id="modalClose" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (<div>Loading...</div>)}
    </>
  )
}

export default Graph