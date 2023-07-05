import React, { Component, useEffect ,useRef,useState} from 'react';
import "./chatcontainer.css";
import profile from "../../images/profile.jpg"
import axios from 'axios';
import { MixedSchema } from 'yup';
import {io} from "socket.io-client"
import { useSelector } from 'react-redux';



const  ChatContainer = ({currentChatUser})=>
{
    const [message, setMessage] = useState([]);
    const [inputmessage, setinputmessage]= useState("")
    const [arrivalMessage,setarrivalMessage] = useState(null);
    const scrollRef  = useRef();
    const socket = useRef();
   const recipientId = currentChatUser.id;
   const resdata = "";
   //const userId = 1;
   
   //console.log(message);
   const user2 = useSelector((state) => state.user);
   const userId= (user2.data[0].id);
   const id = (user2.data[0].id);
  // console.log(message);
   const  clearMessage = ()=>
   {
       setMessage([]);
   }
   useEffect(()=> 
   {
    //if(currentChatUser !== ''){
        socket.current =io("http://localhost:3003");
        socket.current.emit("addUser", id )
    //}
   },[inputmessage])
  // console.log(socket);
 const inmsg = (e)=>
 {
setinputmessage(e.target.value);
 }

   
useEffect(()=>
{
    const getmessage = ()=>
    {
      clearMessage();

        axios.post("http://localhost:3003/get_message" , {userId, recipientId:currentChatUser.id}).then ((res)=>
        {
      //console.log(res);
     if(res.status === 200){
        console.log(res.data);
        const msgs = res.data.map((msg) => ({
            myself: msg.sender === userId,
            message: msg.message,
          }));
  
          setMessage(msgs);
    
     }
    

     else
     {
        setMessage([]);
          
        console.log("no chat found");
       
     }
        })

    }
    getmessage();
},[currentChatUser.id])
useEffect(()=>
{
scrollRef.current?.scrollIntoView({behavior:"smooth"})
},[message])
   const sendmsg = ()=>
   {
    const messages = 
    {
        myself:true,
        message:inputmessage
    }
const message = inputmessage;
 socket.current.emit("send-msg",{to:currentChatUser.id, from:id, message:inputmessage})
    axios.post ("http://localhost:3003/post/msg", {userId,recipientId,  message}).then((res)=>
    {
        if(res.status === 200)
        {
            console.log("message inserted successfully");
        }
    })
  //setMessage([...message, newMessage]);
  setMessage((prevMessages) => prevMessages.concat([messages]));

   }


useEffect(()=>
{
    if(socket.current)
    {
     socket.current.on("msg-receive", (msg)=>
     {
        console.log(msg);
        setarrivalMessage({myself:false, message:msg})
     })   
    }
},[arrivalMessage]);

useEffect(()=>
{
   arrivalMessage && setMessage((pre)=>[...pre,arrivalMessage ]) 
},[arrivalMessage])
return(
    <>
    


        <div className='MainChatContainer'>
   <div>

<div style = {{display:"flex", marginLeft:"30px",backgroundColor:"rgb(241 243 241)",borderRdius: "10px",padding:"5px", width:"70pc", marginTop:"10px"}}>
    <img src ={`${profile}`} className = "userProfile" alt = ""></img>
    <p  style = {{marginTop:"10px", marginLeft:"10px"}}>{currentChatUser.username}</p>
</div>

<div  className='msgcontainer'>
{Array.isArray(message) && message.map((msg)=>(
    <div ref = {scrollRef}>
    {msg.myself === false ?

    <div  className='msg' >
       <img src  ={`${profile}`} className = "chatuserProfile"></img>
   <p style = {{textAlign:"start"}}>{msg.message}</p>
    
   </div>:
   <div className='msg2'>
       
   <p style = {{textAlign:"start"}}>{msg.message} </p>
   
    </div>
   }
  

    </div>
))
}
    
    

</div>
<div  className='msgsendercontainer'>
    <input placeholder='write your message here' type = "text" name = "" id = "" className='msginput' onChange={inmsg} ></input>
  <button className='msgbutton' onClick={sendmsg}>Send</button>
</div>
   </div>
        </div>
    </>
)



}
export default ChatContainer;