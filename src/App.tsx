import {useState,useEffect} from 'react'
import LoginUser from './Loginuser'
import CreateUser from './CreateUser'
import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
function App() {
  const[serverOK,setserverOK]=useState(false)
  
  async function checkServer(){
    try{
      const res:Response=await fetch("http://localhost:8000/serverstatus",{
        method:"GET",
      })
      if (res.status===200){
        setserverOK(true)
      }
    }catch(err){
      console.log(err)
    }
   }

   useEffect(
    ()=>{
      checkServer()
    }
   ,[])
   
  
  return (
    <div>
      {serverOK?<h2>Welcome aboard!</h2>
               :<h2>Server offline</h2>}

     <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginUser/>} />
        <Route path="/register" element={<CreateUser/>} />
      </Routes>
     </BrowserRouter> 
    </div>
    );
}

export default App;
