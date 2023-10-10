import {useState} from 'react'
import React from 'react'
import './styles.css'
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
            fetch("http://localhost:8000/login",{
                method:"POST",
                body:JSON.stringify(user)
            }).then(res=>{
                    if (res.status===404){
                        setLoading(false)
                        setErrorMessage("Invalid Username.")  
                        return  
                    }
                    if (res.status===401){
                        setLoading(false)
                        setErrorMessage("Invalid Password")
                        return
                    }
                    if (res.status===200){
                        setLoading(false)
                        res.json().then(res=>{
                            localStorage.setItem("token",res)
                            return
                        })
                        
                        //console.log(document.cookie.split(";").find(cookie=>cookie.trim().startsWith("userToken")))
                        //console.log(document.cookie)
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
                {errorMessage===""?<></>:<div>{errorMessage}</div>}
                {loading?<div>Loading</div>:<></>}
            </form>
            <button onClick={()=>{userLogin()}} className="button">Login</button>
        </div>

    )
}