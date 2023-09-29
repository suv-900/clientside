import {useState} from 'react'
import React from 'react'
import './styles.css'
export default function LoginUser(){
    const[username,setUsername]=useState("")
    const[password,setPassword]=useState("")
    const[errorMessage,setErrorMessage]=useState("")
   
    async function  userLogin(){
            const user={username,password}
            await fetch("http://localhost:8000/login",{
                method:"POST",
                body:JSON.stringify(user)
            })
            .then(res=>{
                try{        
                    if (res.status===404){
                        setErrorMessage("Invalid Username.")       
                    }
                    if (res.status===401){
                        setErrorMessage("Invalid Password")
                    }
                    if (res.status===200){
                        res.json().then(res=>{
                            console.log(res.token)
                            localStorage.setItem("userToken",res.token)
                        })
                    }
                }
                catch(err){
                    console.log(err)
                }
            })
                
    }

    /*    
    async function sendToEcho(){
        let headerObj={}
        try{
        if(localStorage.token){
            headerObj={"Authorization":localStorage.token}
            fetch("http://localhost:8000/echo",{
                headers:headerObj
            }).then(res=>{
                console.log(res.json())
            })
        }
         }catch(err){
            console.log(err)
         }
    }
    */
   
    return(
        <div>
            <form className="form-container">
                <label>Username</label>
                <input type="text" onChange={e=>setUsername(e.target.value)} className="input-field"/>

                <label>Password</label>
                <input type="text" onChange={e=>setPassword(e.target.value)} className="input-field"/>
                {errorMessage===""?<></>
                                  :<>{errorMessage}</>}
            </form>
            <button onSubmit={userLogin} className="button">Login</button>
        </div>

    )
}