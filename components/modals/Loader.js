'use client';
import React from 'react'

function Loader({loader}) {
  return (
    <>
      {
        loader &&
        <div className="loader-details">
          <div className="loader-div">
            <div className="loader-height"></div>

            <div className="loader">
              <div></div>
            </div>

            <div className="loader-height"></div>
          </div>
        </div>
      }
    </>
  )
}

export default Loader