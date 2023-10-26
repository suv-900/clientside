import {useState,useEffect} from 'react'
import LoginUser from './Loginuser'
import CreateUser from './CreateUser'
import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import CreatePost from './Createpost'
import {NotFound,Unauthorised} from './ErrCode/ErrorCodes'
import { Home } from './Home'
import { ViewPostByID } from './Viewpost'
import { Profile } from './UserProfile'
import { ReportContent } from './ReportContent'
//TODO server polling

function App() {
  const[serverOK,setserverOK]=useState(false)
//  const[pollCount,setPollCount]=useState(0)  
  
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
        <Route path="/createpost" element={<CreatePost/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/401" element={<Unauthorised/>} />
        <Route path="/report-content" element={<ReportContent/>} />
        <Route path="/404" element={<NotFound/>} />
        <Route path="/post" element={<ViewPostByID/>} />
      </Routes>
     </BrowserRouter> 
    </div>
    );
}

export default App;
