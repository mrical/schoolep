import React from 'react'

import { useParams } from 'react-router-dom'

import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { useAuth } from '../../context/AuthContext'

const Call = (props) => {

   const {id} = useParams()

    const path_room = id.substring(5, 33)
    const path_user = id.substring(39, 90)

   const { currentUser } = useAuth()

    const myMeeting = async(e) => {
        const appID = 1739260871;
        const serverSecret = "277a09498bd5c49cad336bddab36e4bb";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, "adadasd", props.activeFriend === id ? props.activeFriend : currentUser.uid, "fsd");
       const zc = ZegoUIKitPrebuilt.create(kitToken);
       zc.joinRoom({
         container: e,
         sharedLinks: [
            {
                name: "Copy Link",
                url: `http://localhost:3000/#/room/${id}`
            }
         ],
         scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall
         },
         showScreenSharingButton: false
       }) 
    }

  return (
    <div> 
        <div ref={myMeeting} ></div>
        {console.log(path_room)}
        {console.log(path_user)}
    </div>
  )
}

export default Call