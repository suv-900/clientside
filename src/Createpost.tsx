import React, { useEffect, useState } from 'react'
import './styles.css'
import { useNavigate} from 'react-router-dom'
import {CheckCookie} from './Utils'
import { ViewPostAfterCreating } from './Viewpost'
//Cookies.set('name', 'value', { expires: 7, path: '' })

//checks token sends post 

export default function CreatePost(){
    const[cookie,setCookie]=useState("")
    const[title,setTitle]=useState("")
    const[postbody,setpostBody]=useState("")
    const[errorMessage,setErrorMessage]=useState("")
    const[error,setError]=useState(false)
    const[loading,setLoading]=useState(false)    
    const[render,setRender]=useState(false)
    const[enableButton,setenableButton]=useState(true)
    const[buttonRenderCount,setbuttonRenderCount]=useState(0)
    const[postCreated,setPostCreated]=useState(false)
    const navigate=useNavigate()
    
    useEffect(()=>{
        const cookieFound=CheckCookie()
        if(cookieFound.length===0){
            navigate("/401") 
            return
        }
        setRender(true)
        setCookie(cookieFound)
    },[])

    async function createPost(){
        if(title.length==0||postbody.length==0){
            setError(true)
            setErrorMessage("Invalid input")
            return
        } 
        setLoading(true)
        const headers ={
            'Authorization':`${cookie}`,

            'Content-Type':'application/json'
        }
        const post={"post_title":title,"post_content":postbody}
        const res=await fetch("http://localhost:8000/createpost",{
            method:'POST',
            headers:headers,
            body:JSON.stringify(post)
        })
        setLoading(false)
        if(res.status===200){
            //send to view post 
            setPostCreated(true)
            setError(false)
        }else{
            setError(true)
            setErrorMessage("error occured "+res)
        } 
    }

    if(title.length>5&&postbody.length>5&&buttonRenderCount===0){
        setenableButton(false)
        setbuttonRenderCount(1)
    }

    /*function getcategorydropdown(e: React.ChangeEvent<HTMLSelectElement>){
        setCategory(e.target.value)
    }*/

    return(
        <div>
        {render?
            <div className="form-group">
            <div className="form-group">
                <label className="label">Title:</label>
                <input type="text"  placeholder="Enter title" className="post-input" onChange={e=>setTitle(e.target.value)}/>
            </div>
            <div className="form-group">
                <label className="body">Body:</label>
                <input placeholder="Enter post content" className="post-input" onChange={e=>setpostBody(e.target.value)} />
            </div>
            <button disabled={enableButton}  type="submit" onClick={()=>createPost()}>Submit</button>
            </div>
        :<></>}
        {error?<div className="input-error-message">{errorMessage}</div>:<></>}
        {loading&&<div className="input-error-message">Loading</div>}

        {postCreated?<ViewPostAfterCreating title={title} body={postbody} />:<>Error</>}
        </div>
    )
}
