import React from 'react'

function Header(props) {
  return (
    <>
        <div className= {props.style}>
            <div className="row d-flex align-items-center justify-content-center">
                <div className="col-3">{props.title}</div>
                <div className="col-2">{props.type}</div>
                <div className="col-3">{props.count}</div>
                <div className="col-3"/>

            </div>
        </div>
    </>
  )
}

export default Header