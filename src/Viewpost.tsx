import React from 'react'
import {useState,useEffect} from 'react'

export function ViewPostByID(){
    const[loading,setLoading]=useState(false)
    const[error,setError]=useState("")

    let username
    let post 
    async function getPostContents(){
        setLoading(true)
        const token=localStorage.getItem("postToken")
        await fetch("http://localhost:8000/viewpost",{
            method:"GET",
            body:JSON.stringify(token)
        }).then(res=>{
            if (res.status===200){
                return res.json()
            }
            if(res.status===500){
                setError("Server Error")
            }
        }).then(data=>{
            username=data.Username
            post=data.Post
        })


        setLoading(false)
    }

    

    useEffect(()=>{
        getPostContents()
    },[])

    return(
        <div>   

        </div>
    )
}

export function ViewPostAfterCreating(props: { title: string; body: string}){


    const title=props.title
    const postbody=props.body


    return(
        <div>
            
        </div>
    )
    
}