import {useState} from 'react'
import React from 'react'
//TODO catch no entry empty values
export default function LoginUser(){
    const[username,setUsername]=useState("")
    const[password,setPassword]=useState("")
    const[errorMessage,setErrorMessage]=useState("")
    const[loading,setLoading]=useState(false)
   
    async function  userLogin(){
            if(username===""){
                setErrorMessage("Invalid input")
                return
            }
            if(password===""){
                setErrorMessage("Invalid input")
                return
            }
            setErrorMessage("")
            setLoading(true)
            const user={username,password}
            const res=await fetch("http://localhost:8000/login",{
                method:"POST",
                body:JSON.stringify(user)
            }) 
            setLoading(false) 
            if(res.status===404){
                setErrorMessage("Invalid Username.")  
            }
            if(res.status===401){
                setErrorMessage("Invalid Password")
            }
            if (res.status===200){
                const r=await res.json()
                localStorage.setItem("token",r)      
                //console.log(document.cookie.split(";").find(cookie=>cookie.trim().startsWith("userToken")))
                //console.log(document.cookie)
            }
            if(res.status===500){
                return
                window.location.replace("http://localhost:3000/serverError")
            }
                
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
                {errorMessage===""?<></>:<div>{errorMessage}</div>}
                {loading?<div>Loading</div>:<></>}
            </form>
            <button onClick={()=>{userLogin()}} className="button">Login</button>
        </div>

    )
}