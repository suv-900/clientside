import React from 'react'
import {useState,useEffect} from 'react'
import { CheckCookie } from './Utils'
import { Comments, PostObject } from './Types'
import { useSearchParams } from 'react-router-dom'
import './styles.css'
import { CommentBuilder } from './CommentBuilder'

let post=new PostObject()
//let newUserComment=new Comments()
let postID:number
let token:string
let tokenFound=false
export function ViewPostByID(){
    const[loading,setLoading]=useState(false)
    const[cookieFound,setCookieFound]=useState(false)
    const[commentInput,setCommentInput]=useState("")
    const[renderUserPostedComment,setRenderUserPostedComment]=useState(false)
    const[renderPost,setRenderPost]=useState(false)  
    const[postLiked,setPostLiked]=useState(false)
    const[postDisliked,setPostDisliked]=useState(false)
    const[postLikes,setPostLikes]=useState(post.post_likes)
    const[postLikedByUserRender,setPostLikedByUserRender]=useState(false)
    const[postDisLikedByUserRender,setPostDisLikedByUserRender]=useState(false)
    const[postLikeButtonContent,setPostLikeButtonContent]=useState("Like")
    const[pressedPostDownVoteButton,setPressedPostDownVoteButton]=useState(false)
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
            const t=CheckCookie()
            if(t!=null){
                tokenFound=true
                token=t 
            }else{
                tokenFound=false
            } 
            getPostContents()
        }else{
            console.log("postid is null")
        }
    },[])

   
    let commentCount:number=0
    let userLink:string=""
    

    async function getPostContents(){
        setLoading(true)
        if(postID===undefined) return
        
        let res
        if(tokenFound){
            const headers={
                "Authorization":`${token}`
            }
            res=await fetch(`http://localhost:8000/viewpostToken/${postID}`,{
            method:"GET",
            headers:headers
            })  
        }else{
            res=await fetch(`http://localhost:8000/viewpost/${postID}`,{
            method:"GET"
            })   
        }
        if(res.status===400||res.status===401){
            window.location.replace("http://localhost:3000/login")
            return
        } 

        const r=await res.json()
        let k=r.Post
        post.title=k.Post_title
        post.authorid=k.Author_id
        post.body=k.Post_content
        post.createdat=k.CreatedAt
        post.post_likes=k.Post_likes
        post.updatedat=k.UpdatedAt
        post.postLikedByUser=r.PostLikedByUser
        console.log(r.PostLikedByUser)
        console.log(r.PostDislikedByUser)
        post.postDislikedByUser=r.PostDislikedByUser
        post.username=r.Username
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

        setLoading(false)
        setPostLikes(post.post_likes)
        setPostLiked(post.postLikedByUser)
        setPostDisliked(post.postDislikedByUser)
        setRenderPost(true)
    }

    async function LikePost(){
        if(!tokenFound){
            window.location.replace("http://localhost:3000/login")
            return
        }
        
        setPostDisliked(false)
        const headers={
            "Authorization":`${token}`
        }
        if(post.postLikedByUser){
            setPostLiked(true)
            setPostDisliked(false)
            const res=await fetch(`http://localhost:8000/likepost/${postID}`,{
                method:"POST",
                headers:headers
            })
        if(res.status===201||res.status===200){
            setPostLikes(postLikes+1)
            setPostLiked(true)
        }
        if(res.status===208){
            setPostLikedByUserRender(true)
            setPostDisLikedByUserRender(false)
        }
        if(res.status===400||res.status===401){
                window.location.replace("http://localhost:3000/login")
        }
        else{
            console.log("error while liking post")
        }
        }else{
            const res=await fetch(`http://localhost:8000/removelikefrompost/${postID}`,
                {
                    method:"POST",
                    headers:headers
                }
            )
            if(res.status===201||res.status===200){
            setPostLikes(postLikes-1)
            setPostLiked(false)
            }
            if(res.status===208){
            setPostLikedByUserRender(true)
            setPostDisLikedByUserRender(false)
        }
         if(res.status===400||res.status===401){
                window.location.replace("http://localhost:3000/login")
        }
        else{
            console.log("error while liking post")
        }

        }
    }
    async function DislikePost(){
        if(!tokenFound){
            window.location.replace("http://localhost:3000/login")
            return
        }
       
        setPostLiked(false)

        if(post.postDislikedByUser){
            setPostLiked(false)
            const headers={
                 "Authorization":`${token}`
            }
            const res=await fetch(`http://localhost:8000/dislikepost/${postID}`,{
                method:"POST",
                headers:headers
            })
            if(res.status===201||res.status===200){
                setPostLikes(postLikes-1)
                setPostDisliked(true)
            }
            if(res.status===208){
                console.log("continue")
            }
            if(res.status===400||res.status===401){
                window.location.replace("http://localhost:3000/login")
            }else{
                console.log("error while liking post")
            }
        }else{
            const headers={
                "Authorization":`${token}`
            }
            const res=await fetch(`http://localhost:8000/removedislikefrompost/${postID}`,{
                method:"POST",
                headers:headers
            })
            if(res.status===200){
                setPostLikes(postLikes+1)
                setPostDisliked(false)
            }
            if(res.status===500){
                console.log("Error")
            }
            if(res.status===400||res.status===401){
                window.location.replace("http://localhost:3000/login")
                return
            }else{
                console.log("error while liking post")
            }
        }

        
    }
    /*
    useEffect(()=>{
        if(pressedPostDownVoteButton){
            dislikePostMain() 
        }
    },[pressedPostDownVoteButton])
    */
    async function submitComment(){
        console.log(token)
        if(token===undefined) return 
        if(token.length===0){
            console.log("token invalid")
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
           //add the new comment on top of all comments 
        }else{
            setRenderUserPostedComment(false)
        }
    }

    let upvoteStyles={
        color:postLiked?"red":"lightslategrey"
    } 
    let downvoteStyles={
        color:postDisliked?"blue":"lightslategrey"
    }
    return(
        <div>
            {!renderPost?<></>: 
                <div>
                    <div className="post-box">
                        <h3>{post.title}</h3>
                        <a  className="post-username" id="userLink" href={userLink} >{post.username}</a>
                        <p className="post-content">{post.body}</p>
                        <p>{postLikes} likes</p>
                        <button
                        className="upvote" 
                        onClick={()=>{
                            post.postLikedByUser=!post.postLikedByUser
                            LikePost()}}
                        style={upvoteStyles}>
                        ▲
                        </button>
                        <button
                        className="downvote"
                        style={downvoteStyles}
                        onClick={()=>{
                            post.postDislikedByUser=!post.postDislikedByUser
                            DislikePost()
                            }
                            }>
                        ▲
                        </button>
                    </div> 
                    <div className="comments">
                        {post.comments!==undefined?post.comments.map(comment=><CommentBuilder renderReport={cookieFound} comment={comment} key={comment.commentID} token={token} />):<>{console.log("post comments undeinfed")}</>}

                    </div>
                    
                    {tokenFound?
                    <div  className="comment-form">
                        <input className="comment-input" type='text' placeholder='comment...' onChange={(e)=>setCommentInput(e.target.value)} />
                        <button className="comment-button"onClick={()=>{submitComment()}} >comment</button>
                    </div>:<div>login or regitser to comment
                        <button onClick={()=>{window.location.replace("http://localhost:3000/login")}} >Login</button>
                        <button onClick={()=>{window.location.replace("http://localhost:3000/register")}} >Register</button>
                        </div>}

                    {renderUserPostedComment?<div>
                        

                    </div>:
                    <></> }
                </div>
            }
        </div>
    )
}    
