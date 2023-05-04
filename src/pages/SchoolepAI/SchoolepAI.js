import React, { useEffect, useState } from 'react'
import "./SchoolepAI.css"
import bot from "../../assets/bot.svg"
import { HourglassBottom, Replay, Save, Send } from '@mui/icons-material'

const SchoolepAI = () => {

  const [message, setMessage] = useState()
  const [response, setResponse] = useState()
  const [responseText, setResponseText] = useState()
  const [sendMessage, setSendMessage] = useState(false)

  //ziskanie odpovedi
  const handleSubmit = (e) => {

    document.getElementById("bot").classList.add("up_down")

    setSendMessage(true)

    //fetchuje (zsikava) data s nasho serveru ktory sme nahrali na online server Cyclic https://defiant-tuna-pinafore.cyclic.app
    //zdrojovi kod nasho node serveru je v src/server.js

    fetch("https://defiant-tuna-pinafore.cyclic.app/", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    })
      .then((res) => res.json())
      .then((data) => setResponse(data.message))

    }

    //odpoved pise postupne v takej mensej animacii 
    const  showTextLetterByLetter = (text, speed) => {
      let i = 0;
      let output = document.getElementById("response");
      let timer = setInterval(function() {
        if (i < text.length) {
          output.innerHTML += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
        }
      }, speed);
    }
 

    useEffect(() => {
      if(response) {
        showTextLetterByLetter(response, 50);
      }
    }, [response])




    
  
    
  
  
  useEffect(() => {
    document.getElementById("menu").classList.remove("left-menu")
    document.body.style.overflow="visible"
    }, [])

  return (
    <>

      <div id="schoolep-ai" >
        <div className='choose-section' >

          <div className='titles' >
            <h2>Schoolep AI</h2>
            <p id='des' ></p>
            <p>SchoolepAI vám pomože so všetkým. Spytajte sa na čokolvek, na fakty a definicie, na bežne otazky a na rôzne iné veci...</p>
          </div>
          <div className='response-content' >
           {response &&
           <div id='response' className='response' >
                {responseText}
            </div>
            }
           </div>
           <div className='input-content' >
            <div className='input-message' >
                <input value={message} disabled={sendMessage ? true : false} onChange={(e) => setMessage(e.target.value)} />
                <div className='icons' >
                {response && <Save className='icon' onClick={() => navigator.clipboard.writeText(response)} />}
                {response && <Replay className='icon' onClick={() => {
                  setResponse()
                  setResponseText()
                  setMessage("")
                  setSendMessage(false)
                }} />}
                {!sendMessage && <Send className='icon' onClick={handleSubmit} />}
                {sendMessage && !response && <HourglassBottom className='icon'  />}
                </div>
            </div>
           </div>
        </div>


       {!response && <img src={bot} alt="bot" id="bot" className='bot-ai' />}
      </div>
    
    </>
  )
}

export default SchoolepAI