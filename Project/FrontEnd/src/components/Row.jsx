import React from 'react'

function Row(props) {

    function loadPreset(){

    }

    function deletePreset(){

    }
  return (
    <>
        <div className= {props.style}>
            <div className="row my-1 d-flex align-items-center justify-content-center" style={{height: "30px"}}>
              <div className="col-3">{props.title}</div>
              <div className="col-2">{props.type}</div>
              <div className="col-3">{props.count}</div>
              <div className="col-3 btn-group btn-group-sm" role="group" aria-label="Basic example">
                <button className='btn btn-primary' onClick={loadPreset}>Load</button>
                  
                <button className='btn btn-danger' onClick={deletePreset}>Delete</button>
              </div>
            </div>
        </div>
    </>
  )
}

export default Row