import React, { useEffect, useState } from "react";

let token: string|null
let elementID: string | null 
export function ReportContent(){
    const[input,setInput]=useState("")
    const[loading,setLoading]=useState(false)
    const[reportSubmitted,setReportSubmitted]=useState(false)
    const[errorMessage,setErrorMessage]=useState("")
    
    useEffect(()=>{
        const queryParams=new URLSearchParams(window.location.search)
        elementID=queryParams.get("elementID")
        token=localStorage.getItem("token")
        if(elementID===null||token===null){
            window.location.replace("http://localhost:3000/404")
            return
        }
    },[])

    async function sendReport(){
        if(input.length===0||elementID===null||token===null){
            setErrorMessage("Invalid Input")
            return
        }

        let elementType 
        if(elementID[elementID.length-1]==='c'){
            console.log("comment")
            elementType="comment"
        }
        if(elementID[elementID.length-1]==='p'){
            console.log("post")
            elementType="post"
        }

        setLoading(true)
        const headers={
            "Authorization":`${token}`
        }
        const rbody={
            elementID:elementID,
            elementType:elementType,
            reportMessage:input
        }
        const res=await fetch(`http://localhost:8000/report`,{
            method:"POST",
            headers:headers,
            body:JSON.stringify(rbody)
        })
        setLoading(false)
        if(res.status===200){
            setReportSubmitted(true)
        }if(res.status===500){
            setErrorMessage("Server Error")
        }
    }
    return(
        <div>
            <h1>Report Content</h1>
            <input type="text" placeholder="..." onChange={e=>{setInput(e.target.value)}}  />
            <button onClick={()=>{sendReport()}}>Report</button>
            {loading&&<div>Loading...</div>}
            {errorMessage}
        </div>
    )
}