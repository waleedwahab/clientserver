import React, { Component } from 'react';
import * as Yup from "yup";
export const  SignUpSchema = Yup.object(
    {
        fullName:Yup.string().min(2).max(25).required("please enter FullName"),
      email:Yup.string().min(2).max(25).required("please enter your email"),
    
      password:Yup.string().min(6).required("please enter your  password"),   
      confirm_password:Yup.string().required().oneOf([Yup.ref('password'), null], "password must match"),

    }

)
export default SignUpSchema;