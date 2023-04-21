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
        <div className="container">
          <div className="row text-start">
            <div className="col-3 px-0">
                <button className='btn btn-success btn-sm mx-1' onClick={homeRoute}>Home</button>
                <button className='btn btn-danger btn-sm mx-1' onClick={logoutRoute}>Logout</button>
            </div>

            <div className="col-3">
              <label htmlFor="gasType">Gas Type</label>
              <div class="input-group mb-3">
                <select class="form-select" id="inputGroupSelect01">
                  <option value="CO2">CO2</option>
                  <option value="Methane">Methane</option>
                  <option value="Nitrous Oxide">Nitrous Oxide</option>
                </select>
              </div>
            </div>

            <div className="col-3">
              <label htmlFor="gasType">Count</label>
              <div class="input-group mb-3">
                <select class="form-select" id="inputGroupSelect01">
                  <option value="PerCountry">Per Country</option>
                  <option value="PerCapita">Per Capita</option>
                  <option value="PerDolofGDP">Per $ of GDP</option>
                </select>
              </div>
            </div>
            <div className="col-3 px-0">
              <input class="form-check-input me-3" type="checkbox" value="" id="worldTotalCheckBox"/>
              <label class="form-check-label fs-6" htmlFor="worldTotal">Relative to world total</label>
            </div>
          </div>

          <div className="row">
            <div className="col-4 p-0">
              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text" id="searchCountry">&#128269;</span>
                <input type="text" className="form-control" placeholder="Search a Country" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" required onChange={(event) => handleInputChange('search', event.target.value)}/>
              </div>

              <ul class="list-group list-group-flush text-start navbar-nav-scroll">
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="Argentina" id="ARcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxOne">Argentina</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="Australia" id="AUcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxTwo">Australia</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="Brazil" id="BRcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxThree">Brazil</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="Canada" id="CAcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxFour">Canada</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="China" id="CHcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxFive">China</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="Canada" id="CAcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxSix">Canada</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="France" id="FRcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxSeven">France</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="Germany" id="GRcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxEight">Germany</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="India" id="IDcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxNine">India</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="Indonesia" id="INcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxTen">Indonesia</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="Italy" id="ITcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxEleven">Italy</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="Japan" id="JPcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxTwelve">Japan</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="Mexico" id="MXcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxThirteen">Mexico</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="Russia" id="RScheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxFourteen">Russia</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="Saudi Arabia" id="SARcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxFifteen">Saudi Arabia</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="South Africa" id="SAFcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxSixteen">South Africa</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="South Korea" id="SKcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxSeventeen">South Korea</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="Turkey" id="TKcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxEighteen">Turkey</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="United Kingdon" id="UNcheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxNineteen">United Kingdom</label>
                </li>
                <li class="list-group-item px-1">
                  <input class="form-check-input me-3" type="checkbox" value="United States" id="UScheckbox"/>
                  <label class="form-check-label" htmlFor="checkBoxSeven">United States</label>
                </li>
              </ul>
            </div>

            <div className="col-8">
              <img src="\src\assets\co2_sample.jpg" alt="CO2 Graph" style={{ width: '600px', }}/>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Graph