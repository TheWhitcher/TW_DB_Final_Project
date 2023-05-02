import React from 'react'

function ListItem(props) {
  return (
    <>
        <li className="list-group-item px-1 text-bg-secondary">
            <input className="form-check-input me-3" type="checkbox" defaultChecked={props.checked} id={props.id} onChange={(event) => props.handleCountryList(props.id, event.target.checked)}/>
            <label className="form-check-label" htmlFor="checkBoxOne">{props.country}</label>
        </li>
    </>
  )
}

export default ListItem