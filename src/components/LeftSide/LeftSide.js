import React from 'react'
import "./LeftSide.css"
import earth from "../../assets/earth.png"

import { motion } from "framer-motion"
const LeftSide = () => {
  return (
    <motion.div 
    initial={{ opacity: 0, scaleX: 0, transformOrigin: "left" }}
    animate={{ opacity: 1, scaleX: 1, transformOrigin: "left" }}
    transition={{
      duration: 0.3,
      delay: 0.3
    }}
    className='auth-left-side' >
        <div className='content' >
            <motion.h3
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0}}
             transition={{
              delay: 0.5
            }}
            >SCHOOLEP</motion.h3>
            <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0}}
            transition={{
             delay: 0.7 
            }}
            >Place, where you can be in contact with your friends, anywhere and anytime</motion.p>
            <motion.img
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1.2 }}
            transition={{
             delay: 1
            }}
            src={earth} />       
        </div>
    </motion.div>
  )
}

export default LeftSide