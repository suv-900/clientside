import React from 'react'
import {useState,useEffect} from 'react'
import { CheckCookie } from './Utils'
import { Comments, PostObject } from './Types'
import { useSearchParams } from 'react-router-dom'
import './styles.css'
import { CommentBuilder } from './CommentBuilder'
    //TODO fetch postid from the url

let post=new PostObject()
let newUserComment=new Comments()
let postID:number
export function ViewPostByID(){
    const[loading,setLoading]=useState(false)
    const[errorMessage,setErrorMessage]=useState("")
    const[cookieFound,setCookieFound]=useState(false)
    const[token,setToken]=useState("")
    const[commentInput,setCommentInput]=useState("")
    const[renderUserPostedComment,setRenderUserPostedComment]=useState(false)
    const[goFetch,setGoFetch]=useState(false)    
    const[renderPost,setRenderPost]=useState(false)  
    const[commentLikeCount,setCommentLikeCount]=useState(0)
    const[postLiked,setPostLiked]=useState(false)
    const[postdisliked,setPostDisliked]=useState(false)
    const[postLikes,setPostLikes]=useState(0)
//    const[postObject,setPostObject]=useState(null) 
     /*
    let {id}=useParams()
        if(id!==undefined){
            postID=parseInt(id)
        }else{
            console.log("Postid undefined.")
            return
        }
        */ 
    
    useEffect(()=>{
        let queryParams=new URLSearchParams(window.location.search)
        const postid=queryParams.get("id")
        if(postid!==null){
            postID=parseInt(postid)
            const token=CheckCookie()
            if(token!==null){
                setToken(token)
                setCookieFound(true)
            }else{
                console.log("token not found")
            }
            setGoFetch(true)
        }else{
            console.log("postid is null")
        }
    },[])

   // useEffect(()=>{setPostLikes(post.post_likes)},[post.post_likes])

    useEffect(()=>{
        getPostContents()
    },[goFetch]) 
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
    let commentCount:number=0
    let userLink:string="" 
    async function getPostContents(){
        setLoading(true)
        if(postID===undefined) return
        const res=await fetch(`http://localhost:8000/viewpost/${postID}`,{
            method:"GET"
        })   
        const r=await res.json()
        post.title=r.Post.Post_title
        post.authorid=r.Post.Author_id
        post.body=r.Post.Post_content
        post.createdat=r.Post.CreatedAt
        post.post_likes=r.Post.Post_likes
        post.updatedat=r.Post.UpdatedAt
        post.comments=[] 
        commentCount=r.Comments.length
        userLink=`http://localhost:3000/user/${post.authorid}`
        for(let i=0;i<commentCount;i++){
            let comment=new Comments()
            comment.userid=r.Comments[i].User_id
            comment.username=r.Comments[i].Username
            comment.commentLikes=r.Comments[i].Comment_likes
            comment.commentBody=r.Comments[i].Comment_content
            comment.commentID=r.Comments[i].CommentID
            post.comments.push(comment)
        }
        setPostLikes(post.post_likes!)
        setLoading(false)
        setRenderPost(true)
    }

    async function likePostMain(){
        if(postLiked) return
        if(!cookieFound){
            window.location.replace("http://localhost:3000/login")
            return
        }

        setPostLiked(true)
        setPostDisliked(false)
        const headers={
            "Authorization":`${token}`
        }
        const res=await fetch(`http://localhost:8000/likepost/${postID}`,{
            method:"POST",
            headers:headers
        })
        if(res.status===200){
            setPostLikes(postLikes+1)
        }else{
            console.log("error while liking post")
        }
    }
    async function dislikePostMain(){
        if(postdisliked) return
        if(!cookieFound){
            window.location.replace("http://localhost:3000/login")
            return
        }
        setPostDisliked(true)
        setPostLiked(false)
        const headers={
            "Authorization":`${token}`
        }
        const res=await fetch(`http://localhost:8000/dislikepost/${postID}`,{
            method:"POST",
            headers:headers
        })
        if(res.status===200){
            setPostLikes(postLikes-1)
        }else{
            console.log("error while liking post")
        }
    }


    async function submitComment(){ 
        if(token.length===0){
            setErrorMessage("token is invalid")

            return
        }
        setLoading(true) 
        //userComment.commentBody=commentInput
        //userComment.commentLikes=0
        //userComment.username=
        const headers={
            "Authorization":`${token}`
            //add new headers
        }        
        const res=await fetch(`http://localhost:8000/addcomment/${postID}`,{
            method:"POST",
            headers:headers,
            body:JSON.stringify(commentInput)
        })
        setLoading(false)
        if(res.status===200){
            console.log("done")

            window.location.replace(`http://localhost:3000/post/?id=${postID}`)
            setRenderUserPostedComment(true)
           //add the new comment on top of all comments 
        }else{
            setRenderUserPostedComment(false)
            setErrorMessage("Server Error")
        }
    }


    return(
        <div>
            {!renderPost?<></>: 
                <div>
                    <div>
                        <h3>{post.title}</h3>
                        <a id="userLink" href={userLink} >{post.username}</a>
                        <p>{post.body}</p>
                        <p>{postLikes} likes</p>
                        <button onClick={()=>{likePostMain()} }>Like</button>
                        <button onClick={()=>{dislikePostMain()} }>Dislike</button>
                    </div> 
                    <div className="comments">
                        {post.comments!==undefined?post.comments.map(comment=><CommentBuilder renderReport={cookieFound} comment={comment} key={comment.commentID} token={token} />):<>{console.log("post comments undeinfed")}</>}

                    </div>
                    
                    {cookieFound?<div>
                        <input type='text' placeholder='comment...' onChange={(e)=>setCommentInput(e.target.value)} />
                        <button onClick={()=>{submitComment()}} >comment</button>
                    </div>:<div>login or regitser to comment
                        <button onClick={()=>{window.location.replace("http://localhost:3000/login")}} >Login</button>
                        <button onClick={()=>{window.location.replace("http://localhost:3000/register")}} >Register</button>
                        </div>}

                    {renderUserPostedComment?<div>
                        

                    </div>:
                    <>{console.log("error occured while posting comment")}</> }
                </div>
            }
        </div>
    )
}    



