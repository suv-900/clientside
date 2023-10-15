import React, { useState } from "react";

export function Home(){
    const[change,setChange]=useState(false)
    if(change){
        console.log("yes")
        setChange(false)
    }
    
    return (
       <div>
        <h1>Homepage</h1>
        <button onClick={()=>setChange(true)}>click bro</button>
       </div> 
    )
}