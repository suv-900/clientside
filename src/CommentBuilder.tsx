import React from "react"
import { useState } from "react"
import { Comments } from "./Types"
import { ReportContent } from "./ReportContent"


export function CommentBuilder(props:{comment:Comments,token:string,renderReport:boolean}){
    const {userid,commentID,commentLikes,username,commentBody}=props.comment
    const {renderReport}=props
    const token=props.token
    const userlink=`http://localhost:3000/${userid}`
    const[likes,setLikes]=useState(commentLikes!)
    const[liked,setLiked]=useState(false) 
    const[disliked,setDisliked]=useState(false) 
    const[errorMessage,setErrorMessage]=useState("") 
   // const[renderReport,setRenderReport]=useState(false)
    
    async function likeComment(){
        if(liked) return

        setLiked(true)
        setDisliked(false)
        setErrorMessage("")
        const headers={
            "Authorization":`${token}`
        }
        const body=JSON.stringify(commentID)

        const res=await fetch("http://localhost:8000/likecomment",{
            method:"POST",
            headers:headers,
            body:body
        })
        if(res.status===200){
            setLikes(likes+1)
        }else{
            console.log(res)
        }
    
    }

    async function dislikeComment(){
        if(disliked) return
        return 
        setDisliked(true)
        setLiked(false)
        setErrorMessage("")
        const headers={
            "Authorization":`${token}`
        }
        const body=JSON.stringify(commentID)
        const res=await fetch("http://localhost:8000/dislikecomment",{
            method:"POST",
            headers:headers,
            body:body
        })
        if(res.status===200){
            setLikes(likes-1)
        }else{
            console.log(res)
        }
    }


    return(
            <div>
                <div className="comment-box">
                <a href={userlink} className="comment-username">{username}</a>
                <p className="comment-content">{commentBody}</p>
                                
                {likes} likes
                <button  
                className="upvote"
                onClick={()=>{likeComment()}}>▲</button>
                                
                <button
                className="downvote" 
                onClick={()=>{dislikeComment()}}>▲
                </button>

                {renderReport&&
                <button
                className="report-button" 
                onClick={()=>{window.location.replace(`http://localhost:3000/report-content/?elementID=${commentID}c`)}}>report</button>} 
                </div>
            </div>
        )
}