import React from 'react'
import {useState,useEffect} from 'react'
import { CheckCookie } from './Utils'
import { useParams } from 'react-router-dom'
import { PostObject } from './Types'


export function ViewPostByID(){
    const[loading,setLoading]=useState(false)
    const[errorMessage,setErrorMessage]=useState("")
    const[cookieFound,setCookieFound]=useState(false)
    const[token,setToken]=useState("")
    const[commentInput,setCommentInput]=useState("")
    const[renderUserPostedComment,setRenderUserPostedComment]=useState(false)
    
    let postID:number|undefined
    //TODO fetch postid from the url
    let {id}=useParams()
        if(id!==undefined){
            postID=parseInt(id)
        }else{
            console.log("Postid undefined.")
            return
        }
    
        /*
    useEffect(()=>{
       const cookie=CheckCookie()
        if(cookie.length!=0){
            setCookieFound(true)
            setToken(cookie)
            //TODO user can comment
        }
        getPostContents()
    },[])
    */
    let post:PostObject
    
    async function getPostContents(){
        setLoading(true)
        await fetch(`http://localhost:8000/viewpost/${postID}`,{
            method:"GET",
        }).then(res=>{
            if (res.status===200){
                return res.json()
            }
            if(res.status===500){
                setErrorMessage("Server Error")
            }
        }).then(data=>{
        post.title=data.title
            post.body=data.body
            post.userid=data.userid
            post.username=data.username
            post.createdAt=data.createdAt
            post.comments.push(data.comments)
        })
        setLoading(false)
    }

    async function submitComment(){
        if(token.length===0){
            setErrorMessage("token is invalid")
            return
        } 
        console.log(token) 
        setLoading(true) 
        const headers={
            "Authorization":`${token}`
            //add new headers
        }        
        const res=await fetch("http://localhost:8000/commentOnPost",{
            method:"POST",
            headers:headers,
            body:JSON.stringify(token)
        })
        setLoading(false)
        if(res.status===200){
            setRenderUserPostedComment(true)
           //add the new comment on top of all comments 
        }else{
            setRenderUserPostedComment(false)
            setErrorMessage("Server Error")
        }
    }
    const userLink:string=`http://localhost:3000/user/${post.userid}`
    return(
        <div>   
            <div className="post">
                <h3>{post.title}</h3>
                <a id="userLink" href={userLink} >{post.username}</a>
                <p>{post.body}</p>
            </div> 
            <div className="comments">

            </div>
            
            {cookieFound?<div>
                <input type='text' placeholder='comment...' onChange={(e)=>setCommentInput(e.target.value)} />
                <button onClick={()=>{submitComment()}} >comment</button>
            </div>:<div>login or regitser to comment</div>}

            {renderUserPostedComment?<div>

            </div>:
            <div>Error occured while posting Comment</div> }
        </div>
    )
}



