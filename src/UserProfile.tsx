import React, { useEffect, useState } from 'react'
import { CheckCookie } from './Utils'
import { useNavigate } from 'react-router-dom'

export function Profile(){
    const[renderDeleteOption,setRenderDeleteOption]=useState(false)
    const[token,setToken]=useState("") 
    const[loading,setLoading]=useState(false)    
    const[userDeleted,setUserDeleted]=useState(false)   
    const[clickedOnce,setClickedOnce]=useState(false) 
    const navigate=useNavigate()
    
    
    useEffect(()=>{
        const t=CheckCookie()
        if(t.length===0){
            navigate("/401")
            return
        }
        setToken(t)
    },[])

    async function deleteUser(){
        setClickedOnce(true)
        setRenderDeleteOption(false)
        setLoading(true)
        console.log("delete user")
        const headers={
            "Authorization":`${token}`
        }
        const res=await fetch("http://localhost:8000/deleteuser",{
            method:"DELETE",
            headers:headers
        })
        setLoading(false)
        if(res.status===200){
            setUserDeleted(true)
        }
        if(res.status===500){
            setUserDeleted(false)
        }
    }
    return(
        <div>
            
            
            
            <button  disabled={clickedOnce} onClick={()=>{setRenderDeleteOption(true)}}>Delete</button>
            {renderDeleteOption?<button onClick={()=>{
                deleteUser()}}>Confirm</button>:<></>}
            {loading?<div>Loading...</div>:<></>}
            {userDeleted?<div>user deleted.</div>:<></>}
        </div>
    )
}