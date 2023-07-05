const express = require('express');
const mysql = require('mysql');
const app = express();
const bcrypt = require("bcryptjs");
var cookieParser = require('cookie-parser')
const session = require('express-session')
const { Server } = require("socket.io");
const server = require('http').createServer(app);
//onst io = require('socket.io')(server);
const cors = require("cors");
const { Socket } = require('dgram');
const { on } = require('events');
app.use(cookieParser());
app.use(express.json());

app.use(cors());
app.use(session({
    secret: '7861',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      maxAge: 3000000 *60
    }}));
// MySQL database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: "",
  database: 'finalchatapp'
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);



app.post("/create", async (req,res)=>
{
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password= req.body.password;
    const Role = "user";
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    pool.query("SELECT * FROM users WHERE email = ?", [email], (err, result, fields)=>
    {
       if(err)
       {
        console.log(err);
       } 
       if(result)
       {
        if(result.length === 0)
        {
             const sqlInsert = "INSERT INTO users (username, email , password) VALUES (?,?,?)";
             pool.query(sqlInsert, [fullName, email, hash,Role], (err, row, fields)=>
             {
              
               if(err)
               {
                res.send(err);
               } 
               if(row)
               {
                res.status(200).send(
                    {
                        message:"user registered",
                        data:row,
                        id:row.insertId,
                        email:email,
                        fullName:fullName,

                    }
                )
               }
             })
        }  
       }
    })
})


app.post("/api/get", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email);
    console.log(password);
  console.log("in log in");
  
  
    pool.query("SELECT * FROM users WHERE email = ? ", [email], (err, result, feilds) => {
      if (err) {
        console.log(err);
      }
      if (result) {
        if (result.length === 0) 
        {
          res.status(400).send({ message: "no account found"});
        } 
        else 
        {
          //console.log(result);
          const originalPassword = result[0].password;
  
          if (bcrypt.compareSync(password, originalPassword)) 
          {
            res.status(200).send({ data:result });
            console.log('correct')
          }
  
          if(!bcrypt.compareSync(password, originalPassword))
          {
           res.status(201).send({message:"password is incorrect"});
          }
        }
      }
    });
  });

app.get("/getdata", (req, res)=>
{
const sql = "SELECT * FROM users";
pool.query(sql , (err, result, fields)=>
{
  res.send(result);
  //console.log(result);
})
})

app.post("/get_message",(req, res)=>
{
  const recipentid = req.body.recipientId;
  const userid = req.body.userId;
 // console.log("userid"+userid);
  //console.log("in get messag")

  pool.query("SELECT * FROM messaging WHERE (sender = ? AND receiver = ? ) OR  (sender =   ? AND receiver = ?) ", [userid, recipentid, recipentid,userid], (err, result, feilds) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      if (result.length === 0) 
      {
        res.status(400).send({ message: "no chat found"});
          console.log("no chat found");
      } 
      else 
      {
       // console.log([result]);
        res.status(200).send(result);

      }
    }})
} )

app.post("/post/msg", (req, res)=>
{
console.log("in isention msgs");
  const recipentid = req.body.recipientId;
  const userid = req.body.userId;
  const message = req.body.message
  console.log(recipentid, userid, message);
  const sqlInsert = "INSERT INTO messaging (sender, receiver , message) VALUES (?,?,?)";



  pool.query(sqlInsert,     [userid, recipentid, message], (err, row, fields)=>
  {
   
    if(err)
    {
     res.send(err);
}
else
{
  console.log("inserted");
}
 } )})
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
     methods: ["GET", "POST"],
     credentials:true
    },
  });


  global.onlineUsers = new Map();
  
 
  io.on ("connection", (socket)=>
  {
    console.log("connected");

    global.chatsocket = socket;
    socket.on ("addUser", (id)=>
    {
      console.log("in add user")
      onlineUsers.set (id, socket.id);
    })
    socket.on("send-msg", (data)=>
    {
      console.log("in send msg socekt")
      const sendUserSocket = onlineUsers.get(data.to)
      if(sendUserSocket)
      {
        console.log(data.msg);
        socket.to(sendUserSocket).emit("msg-receive", data.message)
      }
      
    })
  })

  var users = [];
  //working socket start from here
 /*
io.on('connection', (socket) => {

   
  console.log(`User connected: ${socket.id}`);
  socket.on("connected", function(userId){
    // onlineUsers.set(userId, socket.id)
     users[userId] = socket.id
    // console.log("users"+users);
  })
 
socket.on("sendEvent" , async function (data)
{

  const sqlInsert = "INSERT INTO messaging (sender, receiver , message) VALUES (?,?,?)";



  pool.query(sqlInsert,     [data.userid, data.myId, data.message], (err, row, fields)=>
  {
   
    if(err)
    {
     res.send(err);
    } } )
  console.log(data.userid);
  pool.query("SELECT * FROM users WHERE id = ? ", [data.userid], (err, receiver, feilds) => {
    if (err) {
      console.log(err);
    }
    if (receiver != null) {
      if (receiver.length >= 0) 
      {
        
        pool.query ("SELECT * FROM USERS WHERE id = ?", [data.myId], function (error, sender)
        {

          const sendername = sender[0].username;
          const messageS = data.message;
          const dataa = [{senderName:sendername, MessageS:messageS}]
          
          var {message}= "NEW message recived from " +sender[0].username + "Message"+ data.message;
          io.to(users[receiver[0].id]).emit ("messageReceived", {dataa})
        })
      } 
      else 
      {
      }
  }  })
})
code till here
*/


  // Listen for incoming messages from the sender
  /*socket.on('message', (data) => {
    console.log('message received: ' + data.message + '  i wants to send it to recipient id  '+ data.recipientId);

    // Emit the message to the recipient
    io.to(data.recipientId).emit('message', data);
  });*/


  /*socket.on('join', (recipientId) => {
    console.log('recipient joined: ' + recipientId);
*/
    // Join the recipient to their own room
    //socket.join(recipientId);
//  });
//wokring socket})


/*
  // backend code to create or retrieve a conversation
app.post('/conversations',(req, res) => {
    const { user_id, Name } = req.body;
    console.log(req.body);
console.log("in conversations")



    pool.query("SELECT * FROM conversations WHERE created_by = ?  ", [user_id], (err, result, feilds) => {
        if (err) {
          console.log(err);
          res.send(err);
        }
        if (result) {
          if (result.length === 0) 
          {
            const sqlInsert =  "INSERT INTO conversations (created_by, name) VALUES (?, ?)"
            pool.query(sqlInsert, [user_id,Name], (err, row, fields)=>
            {
             
              if(err)
              {
               res.send(err);
              } 
              if(row)
              {
               res.status(200).send(
                   {
                       data:result

                   }
               )
              }
            })
           
      
          }
          else 
          {
            //console.log(result);

             res.status(200).send({data:result});
             console.log("user alredy present");
             console.log( "the data is"+result[0].created_by);

            
          }
        }
      });
    });
  






  
    // check if conversation already exists
   

// Listen for new connections from clients


const io = new Server(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
    },
  });
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for new chat messages
  socket.on('chat_message', (data) => {
    console.log(`Received message from ${data.sender_id} to ${data.receiver_id}: ${data.message}`);
    // Store the message in the database
    pool.query(`INSERT INTO messages (conversation_id, sender_id, receiver_id, body, type) VALUES (${data.conversation_id}, ${data.sender_id}, ${data.receiver_id}, '${data.message}', '${data.type}')`, (error, results) => {
      if (error) throw error;
      console.log(`Message stored in database with ID ${results.insertId}`);
      // Send the message to the recipient
      socket.to(`user:${data.receiver_id}`).emit('chat_message', data);
    });
  });

  // Join a conversation room
  socket.on('join_conversation', (data) => {
    console.log(`User ${data.user_id} joined conversation ${data.conversation_id}`);
    socket.join(`conversation:${data.conversation_id}`);
    // Mark the user as "online" in the conversation
    pool.query(`UPDATE participants SET status = 'online' WHERE user_id = ${data.user_id} AND conversation_id = 1`, (error, results) => {
      if (error) throw error;
    });
  });

  // Leave a conversation room
  socket.on('leave_conversation', (data) => {
    console.log(`User ${data.user_id} left conversation ${data.conversation_id}`);
    socket.leave(`conversation:${data.conversation_id}`);
    // Mark the user as "offline" in the conversation
   
    pool.query(`UPDATE participants SET status = 'offline' WHERE user_id = ${data.user_id} AND conversation_id = 1`, (error, results) => {
      if (error) throw error;
    });
  });

  // Set the "is_typing" status of a user in a conversation
  socket.on('set_typing_status', (data) => {
    console.log(`User ${data.user_id} is typing in conversation ${data.conversation_id}`);
    // Update the "is_typing" status in the database
    pool.query(`UPDATE participants SET is_typing = ${data.is_typing} WHERE user_id = ${data.user_id} AND conversation_id = ${data.conversation_id}`, (error, results) => {
      if (error) throw error;
      // Broadcast the updated status to all other users in the conversation
      socket.to(`conversation:${data.conversation_id}`).emit('typing_status', data);
    });
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
*/
// Start the server
server.listen(3003, () => {
  console.log('Server started on port 3003');
});
