import axios from 'axios';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3003');
const Realtimechat = ()=>
{
const [message, setMessage] = useState("");
const [messages, setMessages] = useState([]);

const [userId, setuserid] = useState ("");
const [recipientId ,  setrecpientd] = useState ("");
const [Allmessages, setAllMessages] = useState([]);
const [data, setdata] = useState([]);
//console.log(messages); 
const sendMessage = ()=>
{        console.log("in send message");
    socket.emit('message', { recipientId :recipientId, message:message})

}

socket.emit('join', recipientId);
socket.emit("connected", userId);

// Listen for incoming messages from the server
useEffect(() => {


    socket.emit('join', recipientId);
//socket.on('message', (data) => {
    //console.log('message received: ' + data.message);

    // Add the message to the messages state
   // setMessages((messages) => [...messages, data]);
   // console.log(data);

  }); //});
  //console.log(messages);

  useEffect(() => {
axios.get ("http://localhost:3003/getdata").then((res)=>
{
//console.log(res);

setdata(res.data);
})


    
  }); 
 const sendEvent  = ()=>
 {
    socket.emit ("sendEvent" , {
         myId:userId,
         userid:recipientId,
         message:message

    })
 }
socket.on("messageReceived", function (data)
{
    // console.log(data.dataa);
    // const [dataa] = data
     setMessages(data.dataa);
})

const allmessages = ()=>
{

  axios.post("http://localhost:3003/get_message" , {userId,recipientId}).then ((res)=>
  {
console.log(res);
setAllMessages(res.data);

  }) 
}

return(
    <>



<div class = "users">
     <ul>
     {data.map((data, index)=>(
        <div key = {data.id}>
        <li>name :{data.username}</li>
        <li>id :{data.id}</li>
     </div>
    ))}
     </ul>
</div>
           
        <h1>Real-time chatting</h1>
        <div id = "sender">
            <input type = "text"  placeholder='enter message' value = {message} onChange={(e)=>setMessage(e.target.value)}></input> 
            <input type = "text" placeholder='enter recipientId ' value = {recipientId} onChange={(e)=>setrecpientd(e.target.value)}></input> 
            <input type = "text" placeholder='enter your id ' value = {userId} onChange={(e)=>setuserid(e.target.value)}></input> 
       <button onClick={sendEvent}> send</button>
        </div>
        <div id = "recipent">
            <h2>Recipient</h2>
            <ul>
     {messages.map((data, index)=>(
        <div key = {data.id}>
        <li>name :{data.senderName}</li>
        <li>message :{data.MessageS}</li>
     </div>
    ))}
     </ul>
        </div>
    <div class ="msgdb">
        <button onClick={allmessages}> getAllMessages</button>

<ul>
        {Allmessages.map((data, index)=>(
        <div key = {data.id}>
        
        <li>message :{data.message}</li>
     </div>
    ))}
     </ul>
    </div>
    </>
)
}
export default Realtimechat;