import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import jwt_decode from 'jwt-decode';
import './App.css'


function Graph() {
  
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setform] = useState({});
  const [graph, setGraph] = useState({});
  const navigate = useNavigate(); 

  // Default Parameters
  let graphOptions = {
    type: "CO2",
    count: "PerCountry",
    world: false,
    countries: ["Canada", "China", "Japan", "UnitedKingdom", "UnitedStates"]
  }

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
    } 
    catch(err){
      console.error(err);
      navigate('/login');
      return
    }
  },[])

  // Handels change of input for all components
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
        graphOptions.count = newValue
        if(newValue === "PerCountry"){
          checkbox.disabled = false;
        }
        else{
          checkbox.checked = false;
          graphOptions.world = false;
          checkbox.disabled = true;
        }
      }
      
      if (key === "gasType"){
        graphOptions.type = newValue;
      }
      
      if (key === "r2worldTotal"){
        graphOptions.world = newValue;
      }

    setform(form);
    }
  
  // Overided handleInputChange
  function handleCountryList(key, newValue, inputType){
    form[key] = newValue;

    if (inputType){
      graphOptions.countries.push(newValue);
    }
    else{
      const index = graphOptions.countries.indexOf(newValue)
      graphOptions.countries.splice(index, 1);
    }
    
    console.log('graphOptions: ', graphOptions);
    setform(form);
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

  // TODO: IMPROVE 
  // Make a request to generate a python script that will provide a graph as an image.
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
      
      console.log("Success");
    }
    catch (error){
      console.log("Generate Graph request Failed")
      console.log('error: ', error);
    }
  }

  // Saves current graph settings to the database
  const saveGraph = async (e) => {
    const url = 'http://localhost:8080/graph/save';
    const options = {
      method: 'POST',
      headers: {
        'authorization': localStorage.getItem("token"),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphOptions)
    }
        
    try{
      const response = await fetch(url, options);
      console.log("Success");
    }
    catch (error){
      console.log("Save request Failed")
      console.log('error: ', error);
    }
  }

  // TODO: Create logic to download the generated image.
  const downloadGraph = () => {
    // const url = graph;
    // filename = "graph"
    // fetch(url)
    // .then(response => response.blob())
    // .then(blob => { saveAs(blob, filename);
    // });
  }

  return (
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
                <select className="form-select" id="GasTypeSelect" onChange={(event) => handleInputChange('gasType', event.target.value)}>
                  <option value="CO2">CO&#178;</option>
                  <option value="Methane">Methane</option>
                  <option value="Nitrous Oxide">Nitrous Oxide</option>
                </select>
              </div>
            </div>
            
            <div className="col-3">
              <label htmlFor="gasType">Count</label>
              <div className="input-group mb-3">
                <select className="form-select" id="inputGroupSelect01" onChange={(event) => handleInputChange('count', event.target.value)}>
                  <option value="Per Country">Per Country</option>
                  <option value="Per Capita">Per Capita</option>
                  <option value="Emission Per Dollar">Per $ of GDP</option>
                </select>
              </div>
            </div>

            <div className="col-3 px-0 pt-4">
              <input className="form-check-input me-3" type="checkbox" value="" id="relativeCheckbox" onChange={(event) => handleInputChange('r2worldTotal', event.target.checked)}/>
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
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="Argentina" id="ARGcheckbox" onChange={(event) => handleCountryList('ARGcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxOne">Argentina</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="Australia" id="AUScheckbox" onChange={(event) => handleCountryList('AUScheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxTwo">Australia</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="Brazil" id="BRAcheckbox" onChange={(event) => handleCountryList('BRAcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxThree">Brazil</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" defaultChecked={true} value="Canada" id="CANcheckbox" onChange={(event) => handleCountryList('CANcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxFour" >Canada</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" defaultChecked={true} value="China" id="CHNcheckbox" onChange={(event) => handleCountryList('CHNcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxFive">China</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="European Union" id="EUUcheckbox" onChange={(event) => handleCountryList('EUUcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxSix">European Union</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="France" id="FRAcheckbox" onChange={(event) => handleCountryList('FRAcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxSeven">France</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="Germany" id="DEUcheckbox" onChange={(event) => handleCountryList('DEUcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxEight">Germany</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="India" id="INDcheckbox" onChange={(event) => handleCountryList('INDcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxNine">India</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="Indonesia" id="IDNcheckbox" onChange={(event) => handleCountryList('IDNcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxTen">Indonesia</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="Italy" id="ITAcheckbox" onChange={(event) => handleCountryList('ITAcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxEleven">Italy</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" defaultChecked={true} value="Japan" id="JPNcheckbox" onChange={(event) => handleCountryList('JPNcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxTwelve" >Japan</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="Mexico" id="MEXcheckbox" onChange={(event) => handleCountryList('MEXcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxThirteen">Mexico</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="Russia" id="RUScheckbox" onChange={(event) => handleCountryList('RUScheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxFourteen">Russia</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="Saudi Arabia" id="SAUcheckbox" onChange={(event) => handleCountryList('SAUcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxFifteen">Saudi Arabia</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="South Africa" id="ZAFcheckbox" onChange={(event) => handleCountryList('ZAFcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxSixteen">South Africa</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="South Korea" id="KORcheckbox" onChange={(event) => handleCountryList('KORcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxSeventeen">South Korea</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" value="Turkey" id="TURcheckbox" onChange={(event) => handleCountryList('TURcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxEighteen">Turkey</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" defaultChecked={true} value="United Kingdom" id="GBRcheckbox" onChange={(event) => handleCountryList('GBRcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxNineteen">United Kingdom</label>
                </li>
                <li className="list-group-item px-1">
                  <input className="form-check-input me-3" type="checkbox" defaultChecked={true} value="United States" id="USAcheckbox" onChange={(event) => handleCountryList('USAcheckBox', event.target.value, event.target.checked)}/>
                  <label className="form-check-label" htmlFor="checkBoxSeven">United States</label>
                </li>
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
                    <button className='btn btn-success' onClick={saveGraph}>Save</button>
                  </div>
                  <div className="col-6">
                    <button className='btn btn-success' onClick={downloadGraph}>Download</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Graph