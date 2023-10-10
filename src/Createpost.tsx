import {useJwt} from 'react-jwt'
import React, { useEffect, useState } from 'react'
import './styles.css'
import Cookie from 'js-cookie'
import { redirect} from 'react-router-dom'

//Cookies.set('name', 'value', { expires: 7, path: '' })

export default function CreatePost(){
    const[cookie,setCookie]=useState("")
    const[title,setTitle]=useState("")
    const[postbody,setpostBody]=useState("")
    const[category,setCategory]=useState("")
    const[errorMessage,setErrorMessage]=useState("")
    const[error,setError]=useState("")
    const[loading,setLoading]=useState(false)    
    
    let userid:number;
    function checkCookie(){
        const cookie:string|null=localStorage.getItem("token")
        if(cookie==null){
            return redirect("/401")
        }
        //const{decodedToken,isExpired}=useJWT(cookie)    
        /*if(isExpired){
            return redirect("/login")
        }
        const userid=decodedToken.value*/
        //localStorage.setItem("userToken",res.token)
        console.log("token found")
        setCookie(cookie)
    }

    useEffect(()=>{
        checkCookie()
    },[])

    async function createPost(){
        if(title===""){
            setErrorMessage("Invalid input")
            return
        }
        if(postbody===""){
            setErrorMessage("Invalid input")
            return
        }
        setLoading(true)
        const headers ={
            'Authorization':`Bearer${cookie}`,
            'Content-Type':'application/json'
        }
        const post={"post_title":title,"post_content":postbody,"post_category":category}
        const res=await fetch("http://localhost/createpost",{
            method:'POST',
            headers:headers,
            body:JSON.stringify(post)
        })
        if(res.status===200){
            setLoading(false)
            setError("")
        } 
    }

    function getcategorydropdown(e: React.ChangeEvent<HTMLSelectElement>){
        setCategory(e.target.value)
    }

    return(
        <div>
        <form>
            <div className="form-group">
                <label className="category">Category:</label>
                <select id="category" name="category" onChange={e=>{getcategorydropdown(e)}}>
                    <option value="programming">Programming</option>
                    <option value="technology">Technology</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="form-group">
                <label className="label">Title:</label>
                <input type="text"  placeholder="Enter title" className="post-input" onChange={e=>setTitle(e.target.value)}/>
            </div>
            <div className="form-group">
                <label className="body">Body:</label>
                <input placeholder="Enter post content" className="post-input" onChange={e=>setpostBody(e.target.value)} />
            </div>
            <button type="submit">Submit</button>
        </form>
        </div>
    )
}


