import React, { Component } from "react";
import Axios from "axios";
import { formik, useFormik, validateYupSchema } from "formik";
import { useNavigate, useParams, route,  } from "react-router-dom";
import emailjs from '@emailjs/browser';
import SignUpSchema from "../Scehmas/SignUpSchema";


const initialValues = {
  fullName: "",
  email: "",
  password: "",
  confirm_password: "",
};

const SignUp = () => {

     const navigate = useNavigate();
     const secpage = ()=>
     {
        navigate("/");
     }
    const MailService = async (data) => {
        console.log("IN MAILSERVICE FUNCTION");
    
        data.link = 'http://localhost:3002/emailVerification/' + data.id;
        data.from_name = 'my project'
        console.log(data)

        emailjs
            .send('service_70x21vz', 'template_92nc1d7', data, 'nNr37bL9Sm0VWohYy')
            .then(
                (result) => {
                  //  console.log(result.text);
                    alert("sucess");
                },
                (error) => {
                    console.log(error.text);
                    console.log(data)
                }
            );
    };
  
   
    const { values, touched, errors, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: initialValues,
      validationSchema: SignUpSchema,
      onSubmit: (values) => {
        const data = {
          records: [
            {
              feilds:{
                fullName: values.fullName,
                email: values.email,
                password: values.password,
              },
            },
          ],
        };
        Axios.post("http://localhost:3003/create", values)
        .then((res) => {
         console.log("in res pone");
         console.log(res)
         console.log("in res pone");

         MailService(res.data);


        })
        .catch((err) => {
          console.log(err);
          alert('email already  present')
          
        });
        console.log(
          "~ file:Registration.jsx ~line11 ~Registration ~values",
          values
        );
      },
    });

    
  return (
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
<form onSubmit="">
<div className='inputs'>

  <button className = "signbtn" onClick = {secpage}>Login</button>
</div>
</form>
</div>

<div className = "cont2">

           
            <form  onSubmit={handleSubmit}>

            <div className="signupin">
            <h1 className=''>Login to Your Account</h1>
<p className='pp'>sign up using social network</p>

<div className= "icons">



  
</div>

              <input
                type="text"
                placeholder="FullName"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
              ></input>

{errors.fullName && touched.fullName ? (
          <p className="form-error">{errors.fullName}</p>
        ) : null}
              
        <input
          type="email"
          name="email"
          placeholder=" enter email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        ></input>
        {errors.email && touched.email ? (
          <p className="form-error">{errors.email}</p>
        ) : null}
        
        <input
          type="password"
          name="password"
          placeholder="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
        ></input>
        {errors.password && touched.password ? (
          <p className="form-error">{errors.password}</p>
        ) : null}
        <input
          type="password"
          name="confirm_password"
          placeholder="confirm_password"
          value={values.confirm_password}
          onChange={handleChange}
          onBlur={handleBlur}
        ></input>
        {errors.confirm_password && touched.confirm_password ? (
          <p className="form-error">{errors.confirm_password}</p>
        ) : null}
              <button className= "signupbtn"  type= "submit">
                Sign Up
              </button>
              </div>

            </form>
          
</div>



</div>
</div>



  
    </>
  );
};

export default SignUp;