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

// Start the server
server.listen(3003, () => {
  console.log('Server started on port 3003');
});
