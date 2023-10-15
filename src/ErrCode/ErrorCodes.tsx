import React from "react";
import { useNavigate } from "react-router-dom";


export function Unauthorised(){
    const navigate=useNavigate() 
    return (
        <div>
        <h1>
            401 Unauthorised
        </h1>
        <button onClick={()=>{navigate("/login")}} >login</button>
        <button onClick={()=>{navigate("/register")}}>register</button>
        </div>
    )
}
export function NotFound(){
    return (
        <h1>
            404
        </h1>
    )
}

