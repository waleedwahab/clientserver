import React, { Component } from 'react';
import "./chat.css";
import { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css"/>
const Chat = ()=>
{

    const [conversation, setConversations] = useState([]);
    const user = useSelector((state) => state.user);
    console.log(user.data[0].id);
    const id = user.data[0].id;
    const username = user.data[0].username;
 // const user = {id:1, username:"waleed"};
  
   useEffect(() => {
      // fetch conversations from the server
      axios.post('http://localhost:3003/conversations', { user_id:id , Name:username})
        .then(response => {
            if(response.status === 200)

          setConversations(response.data);
         // console.log(response.data);
        })
        .catch(error => {
          console.error(error);
    })});

   // const user = useSelector((state) => state.user);
    //console.log(user);

    return(
        <>



{/* Main container*/ }
    <div class="container">
{/*Message header section starts    */}
        <div class="msg-header">
        
        <div class="container1">

<img src="user1.png" class="msgimg" />
<div class="active ">
    <p>User name</p>
</div>
</div>
        
         </div> 
{/* Message header section ends */ }

{/*Chat inbox section starts */ }
         
    <div class="chat-page">

            <div class="msg-inbox">
                <div class="chats">
                     <div class="msg-page">
{/* Contains the incoming and outgoing messages */ }

<div class="received-chats">
                            <div class="received-chats-img">
                                <img src="user2.png" />

                            </div>
                            <div class="received-msg">
                                <div class="received-msg-inbox">
                                    <p>Hi !! This is message from Riya . Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non quas nemo eum, earum sunt, nobis similique quisquam eveniet pariatur commodi modi voluptatibus iusto omnis harum illum
                                        iste distinctio expedita illo!</p>
                                    <span class="time">18:06 PM | July 24 </span>
                                </div>
                            </div>
                        </div>



                      </div> 
                </div>
                
                <div class="outgoing-chats">
                            <div class="outgoing-chats-img">
                                <img src="user1.png"/>

                            </div>
                            <div class="outgoing-msg">
                                <div class="outgoing-chats-msg">
                                    <p class="multi-msg">Hi riya , Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo nobis deleniti earum magni recusandae assumenda.
                                    </p>
                                    <p class="multi-msg">Lorem ipsum dolor sit amet consectetur.</p>


                                    <span class="time">18:30 PM | July 24 </span>
                                </div>
                            </div>
                        </div>


{/*  Message bottom section starts */}
               <div class="msg-bottom">
               <div class="input-group">
                        <input type="text" class="form-control" placeholder="Write message..." />
                        <div class="input-group-append ">
                            <span class="input-group-text send-icon "><i class="bi bi-send " o> send</i>
                            </span>
                        </div>
                    </div>
              
                </div> 
                
{/* Message bottom section ends */}
            </div>
        </div>
    </div>



        </>
    )
    
}
export default Chat;