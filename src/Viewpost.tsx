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
    //TODO fetch postid from the url
    useEffect(()=>{
        const cookie=CheckCookie()
        if(cookie.length!=0){
            setCookieFound(true)
            setToken(cookie)
            //TODO user can comment
        }
        getPostContents()
    },[])

    const postid=useParams() 
    let post:PostObject

    async function getPostContents(){
        setLoading(true)
        await fetch("http://localhost:8000/viewpost",{
            method:"GET",
            body:JSON.stringify(postid)
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

        }        
        const res=await fetch("http://localhost:8000/comment",{
            method:"POST",
            headers:headers,
            body:JSON.stringify(post)
        })
        setLoading(false)
        if(res.status===200){
           //add the new comment on top of all comments 
        }else{
            setErrorMessage("Server Error")
        }
    }

    return(
        <div>   


            {cookieFound?<div>
                <input type='text' placeholder='comment...' onChange={(e)=>setCommentInput(e.target.value)} />
                <button onClick={()=>{submitComment()}} >comment</button>
            </div>:<div>login or regitser to comment</div>}
        </div>
    )
}



