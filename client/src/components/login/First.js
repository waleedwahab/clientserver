import React, { Component, useState } from 'react';
import { useNavigate, useParams, route,  } from "react-router-dom";
import axios from "axios";
import { setUser } from  "../redux/User-slice";
import { useDispatch } from 'react-redux';

export const First = ()=>
{

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const naviagte = useNavigate();
    const dispatch=useDispatch();

    const google = ()=>
    {
      window.open("http://localhost:3003/auth/google","_self")  
    }
    const namedata = (e)=>
  {
    setEmail(e.target.value);
  }
  const passwordata = (e)=>
  {
    setPassword(e.target.value);
  }
  const secpage = ()=>
  {
     naviagte("/signup")
  }
  const updatepassword = ()=>
  {
       naviagte("/updatePass")
  }
  const check =(e) =>
  {
    console.log("in check");
    e.preventDefault();
      const values ={
      email:email,
      password:password,
    }
   
    axios.post("http://localhost:3003/api/get/", values)
     
    .then((res)=>
    {
      console.log(res.data);
     if(res.status === 200)
     {
   //  dispatch(userActions.userInfo(res.data.data[0]));
    dispatch(setUser(res.data));
    
      // dispatch(dataoflogin(res.data.data[0]));
     const role = "user"
    // const role= (res.data.data[0].roles);
     // console.log (res.data.data.roles[0]);
     if(role === "admin")
     {
      naviagte("/dashboard");
     }
      else
      {
        naviagte("/userDashboard");
        console.log("in user dashbor");
      }
     
    
      
     }
     // if(res.data.message === 'password is incorrect');
     // {alert('Password incorrects')}
    }).catch((err)=>
    {
     if(err.request.status === 400);
     {
     alert('Please create account')
     }
    })

   }
    
 return(
    <>
       <div className = "main-cont">

<div className = "cont">

<div className = "cont1">
<h1 className='size'>Login to Your Account</h1>
<p className='pp'>Login using social network</p>


<div className= "icons">


    
  
</div>
<div className = "bar">

    <div className = "line1">

    </div>
    <div className = "word">
    <p className = "w">OR</p>
    </div>
    <div className = "line2">
   
    </div>
</div>

<button    onClick = {google}> Log in with google</button>
<form onSubmit={check}>
<div className='inputs'>

 <input className=' inputsize' type = "email" placeholder="Email"  onChange= {(e) => namedata(e)}/>
 <input  className=' inputsize' type = "password"     onChange= {passwordata} placeholder="Password"/>
 <button  className = "signbtn" type = "submit"> Sign In</button>
<a  className='forget' onClick = {updatepassword}> Forget password </a>
</div>
</form>
</div>

<div className = "cont2">

<h1 className = "new">New Here </h1>
<p className = "Para">Sign up and discover a great amount of new opportunities</p>
<button className="upbtn" onClick = {secpage}>
    Sign Up
</button>


</div>



</div>
</div>
        
    </>
 )
}
export default First;