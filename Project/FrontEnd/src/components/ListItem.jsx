import React from 'react'

function ListItem(props) {
  return (
    <>
        <li className="list-group-item px-1">
            <input className="form-check-input me-3" type="checkbox" defaultChecked={props.checked} id={props.id} onChange={(event) => props.handleCountryList(props.id, event.target.checked)}/>
            <label className="form-check-label" htmlFor="checkBoxOne">{props.country}</label>
        </li>
    </>
  )
}

export default ListItem


// <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="Argentina" id="ARGcheckbox" onChange={(event) => handleCountryList('ARGcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxOne">Argentina</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="Australia" id="AUScheckbox" onChange={(event) => handleCountryList('AUScheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxTwo">Australia</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="Brazil" id="BRAcheckbox" onChange={(event) => handleCountryList('BRAcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxThree">Brazil</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" defaultChecked={true} value="Canada" id="CANcheckbox" onChange={(event) => handleCountryList('CANcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxFour" >Canada</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" defaultChecked={true} value="China" id="CHNcheckbox" onChange={(event) => handleCountryList('CHNcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxFive">China</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="European Union" id="EUUcheckbox" onChange={(event) => handleCountryList('EUUcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxSix">European Union</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="France" id="FRAcheckbox" onChange={(event) => handleCountryList('FRAcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxSeven">France</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="Germany" id="DEUcheckbox" onChange={(event) => handleCountryList('DEUcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxEight">Germany</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="India" id="INDcheckbox" onChange={(event) => handleCountryList('INDcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxNine">India</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="Indonesia" id="IDNcheckbox" onChange={(event) => handleCountryList('IDNcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxTen">Indonesia</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="Italy" id="ITAcheckbox" onChange={(event) => handleCountryList('ITAcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxEleven">Italy</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" defaultChecked={true} value="Japan" id="JPNcheckbox" onChange={(event) => handleCountryList('JPNcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxTwelve" >Japan</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="Mexico" id="MEXcheckbox" onChange={(event) => handleCountryList('MEXcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxThirteen">Mexico</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="Russia" id="RUScheckbox" onChange={(event) => handleCountryList('RUScheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxFourteen">Russia</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="Saudi Arabia" id="SAUcheckbox" onChange={(event) => handleCountryList('SAUcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxFifteen">Saudi Arabia</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="South Africa" id="ZAFcheckbox" onChange={(event) => handleCountryList('ZAFcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxSixteen">South Africa</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="South Korea" id="KORcheckbox" onChange={(event) => handleCountryList('KORcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxSeventeen">South Korea</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" value="Turkey" id="TURcheckbox" onChange={(event) => handleCountryList('TURcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxEighteen">Turkey</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" defaultChecked={true} value="United Kingdom" id="GBRcheckbox" onChange={(event) => handleCountryList('GBRcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxNineteen">United Kingdom</label>
//                 </li>
//                 <li className="list-group-item px-1">
//                   <input className="form-check-input me-3" type="checkbox" defaultChecked={true} value="United States" id="USAcheckbox" onChange={(event) => handleCountryList('USAcheckBox', event.target.value, event.target.checked)}/>
//                   <label className="form-check-label" htmlFor="checkBoxSeven">United States</label>
//                 </li>