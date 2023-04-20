import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import axios from 'axios';
const socket = io('http://localhost:3003');

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [Conversation, setConversations] = useState([]);
  const [conversatioid ,setconvid] = useState([]);



  const user2 = useSelector((state) => state.user);
  //console.log(user2.data[0].id);
  const id = user2.data[0].id;

  const username = user2.data[0].username;
  const conv = "";
 const conversationid = 1;
//console.log(conv[0].id);
  //console.log(Conversation.data.data[0].id);
  //const  conversationid = (Conversation.data[0].id);
 
  //console.log(conversation[0].id);
// const user = {id:1, username:"waleed"};
const recipent = 2;
 useEffect(() => {
    // fetch conversations from the server
    axios.post('http://localhost:3003/conversations', { user_id:id , Name:username})
      .then(response => {
          if(response.status === 200)

        setConversations(response.data);
        console.log(response.data);
         setconvid(response.data.data[0].id);
      })
      .catch(error => {
        console.error(error);
  })});
  

  useEffect(() => {
    // Join the conversation room on connect
    socket.on('connect', () => {
      socket.emit('join_conversation', { user_id:id, conversation_id: conversationid});
    });

    // Listen for new chat messages
    socket.on('chat_message', (data) => {
      if (data.conversation_id === conversationid) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    // Listen for typing status updates
    socket.on('typing_status', (data) => {
      if (data.conversation_id === conversationid) {
        setIsTyping(data.is_typing);
      }
    });

    // Leave the conversation room on unmount
    return () => {
      socket.emit('leave_conversation', { user_id:id, conversation_id: conversationid });
    };
  }, []);

  const handleSendMessage = (event) => {
    event.preventDefault();
    const message = { sender_id:id, receiver_id:recipent , conversation_id:conversationid, message: messageText, type: 'text' };
    socket.emit('chat_message', message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setMessageText('');
  };

  const handleTyping = () => {
    socket.emit('set_typing_status', { user_id:id, conversation_id: conversationid, is_typing: true });
    setTimeout(() => {
      socket.emit('set_typing_status', { user_id:id, conversation_id: conversationid, is_typing: false });
    }, 1000);
  };

  return (
    <div>
      <h2>Conversation with {Conversation.name}</h2>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            {message.sender_id === id ? 'You' : Conversation.recipient.name}: {message.message}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <input type="text" value={messageText} onChange={(event) => setMessageText(event.target.value)} onKeyPress={handleTyping} />
        <button type="submit">Send</button>
      </form>
      {isTyping && <p>{Conversation.recipient.name} is typing...</p>}
    </div>
  );
};

export default ChatRoom;
