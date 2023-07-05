import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./components/redux/store";
import SignUp from "./components/signup/SignUp";
import { useSelector } from 'react-redux';
import First from "./components/login/First";
import Chat from "./components/chat/Chat"
import Chat2 from "./components/chat/Chat2";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Chats from './components/chatting/Chats';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Realtimechat from './components/chat/Realtimechat';
function App() {

const [conversation, setConversations] = useState([]);
  //const user = useSelector((state) => state.user);
  //console.log(user);
const user = {id:1, username:"waleed"};
/*
  useEffect(() => {
    // fetch conversations from the server
    axios.post('http://localhost:3003/conversations', { user_id: user.id , Name:user.username})
      .then(response => {
        setConversations(response.data.conversations);
      })
      .catch(error => {
        console.error(error);
  })});
  */
  return (
    
    <>
     <Provider store={store}>
     <PersistGate loading={null} persistor={persistor}>
<BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<First />} />
          <Route path = "/userDashboard" element ={ < Chats/>}></Route>
            
          <Route path = "/chatp" element ={ < Chat/>}></Route>
          <Route path = "/chatpp" element ={ < Chat/>}></Route>
          <Route path = "/chatting" element ={ < Chats/>}></Route>
          </Routes>
    </BrowserRouter>
    </PersistGate>
    </Provider>
</>
  );
}

export default App;
