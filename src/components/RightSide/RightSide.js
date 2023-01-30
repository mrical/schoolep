import React from 'react'
import "./RightSide.css"

import earth from "../../assets/earth.png"

const RIghtSide = () => {
  return (
    <div className='auth-right-side' >
        <div className='content' >
            <h3>SCHOOLEP</h3>
            <p>Miesto, kde môžeš byť v kontakte so svojimi priateľmi, kdekoľvek a kedykoľvek</p>
            <img src={earth} />       
        </div>
    </div>
  )
}

export default RIghtSide