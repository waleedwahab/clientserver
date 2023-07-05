import React, { Component } from 'react';
import axios from 'axios';
import  { useState, useEffect } from 'react';
import io from 'socket.io-client';

import "./contact.css";
import profile from "../../images/profile.jpg"
import ChatContainer from '../chatcontainer/ChatContainer';


const  Contact = ()=>
{
    const [data, setdata] = useState([]);
    const [currentChatUser, setcurrentChatUser] = useState([]);
    useEffect(() => {
        axios.get ("http://localhost:3003/getdata").then((res)=>
        {
       // console.log(res);
        
        setdata(res.data);

        })},[currentChatUser])
        
        const handleUser = (e)=>
        {
//console.log(e);
setcurrentChatUser(e)

        }

return(
    <>
        <div className=' mainContactContainer'>
<div>
    <div style = {{width:"20pc"}}>
        <input  className='searchforcontact' type = "search" placeholder='Search your friends'></input>
    </div>
    <div className='usersDetailContainer'>
  
    {data.map ((user, index) =>(
   <div  className= "userContainer" key= {index} onClick = {(e)=>handleUser(user)}>
 


          <img src = {`${profile}`}  className = "Chatuserimage" alt = ""></img>  
          <div  style={{marginLeft:"10px"}}><p style = {{color:"black", textAlign:"start", marginTop:"0px", fontSize:"15px"}}>{user.username}</p>
          <p   style = {{color:"black", textAlign:"start", marginTop:"-10px", fontSize:"14px"}}> open your mesage</p>
          </div>
</div>
  
        
        )) }

    </div>
</div>
{currentChatUser !== "" ?
<ChatContainer   currentChatUser ={currentChatUser}/>:
<dv> <p style = {{fontSize:"30px", marginLeft:"20px"}}>open Your chat with friends</p></dv>
}
        </div>
    </>
)



}
export default Contact;