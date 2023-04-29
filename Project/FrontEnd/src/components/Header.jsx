import React from 'react'

function Header(props) {
  return (
    <>
        <div className= {props.style}>
            <div className="row m-0" style={{height: "30px"}}>
                <div className="col-3">{props.title}</div>
                <div className="col-2">{props.type}</div>
                <div className="col-3">{props.count}</div>
                <div className="col-4"></div>

            </div>
        </div>
    </>
  )
}

export default Header