import React from 'react'
import {useState} from 'react'
import './styles.css'
//TODO check all functions again
export default function CreateUser(){
    const[username,setUsername]=useState("")
    const[password,setPassword]=useState("")
    const[email,setEmail]=useState("")    
    const[userexists,setUserexists]=useState(false)
    const[passOK,setPassOK]=useState(true)
    const[validEmail,setValidEmail]=useState(true)
    const[loading,setLoading]=useState(false)
    const[errorCode,seterrorCode]=useState(Number)
    const[disableSubmit,setdisableSubmit]=useState(true)
    async function checkUsername(e: React.ChangeEvent<HTMLInputElement>){
        const username=e.target.value
        await fetch("http://localhost:8000/checkusername",{
            method:"POST",
            body:JSON.stringify(username)
            
        }).then(res=>{
            if (res.status===409){
                setUserexists(true)
            }

        setUsername(e.target.value!)
        })
    }
    
    function checkPass(e: React.ChangeEvent<HTMLInputElement>){
        const checkLen=e.target.value.length<=10?true:false
        const checkDigits=/\d/.test(e.target.value)
        const checkSpecialChar=/[@#$&]/.test(e.target.value)

        if (checkDigits&&checkSpecialChar&&checkLen){
            setPassOK(true)
            setPassword(e.target.value)
        }else{
            setPassOK(false)
            setdisableSubmit(true)
        }
    }
    
    function checkEmail(e: React.ChangeEvent<HTMLInputElement>){
        const res:boolean=/@gmail.com/.test(e.target.value)
        if (res){
            setValidEmail(true);
            setEmail(e.target.value)
        }else{
            setValidEmail(false)
        }
        
    }
    
    async function createUser(){
        setLoading(true)
        const user=JSON.stringify({username,email,password})
        console.log(user)
        await fetch("http://localhost:8000/register",{
            method:"POST",
            body:user
        }).then(res=>{
            if (res.status!==200){
                console.log("res "+res)
                seterrorCode(res.status)
            }
            res.json().then(res=>{
                console.log("token res"+res)
                //localStorage.setItem("userToken",res.token)
            }) 
        })
    }

    function handleError(res:Response){
        if(res.status===500){
            console.log("Server Error| unable to create user")
        }
        if(res.status===409){
            setUserexists(true)
        }
    }
    return(
        <div>
            <form className="form-container">
                <label>Username</label>
                <input type="text" onChange={e=>checkUsername(e)} className="input-field"/>
                {userexists?<div>username exists! try another username</div>:<></>}                
                
                <label>Email</label>
                <input type="text" onChange={e=>checkEmail(e)} className="input-field" />
                {validEmail?<></>:<div className="input-error-message">Invalid Email</div>}
                
                <label>Password</label>
                <input type="text" onChange={e=>checkPass(e)} className="input-field" />
                {passOK?<></>:<div className="input-error-message">Invalid Password (pasword should be less than 10 char and should contain atleast a digit or a special char "0-9 @#$&").</div>}
            </form>
            <button onClick={()=>{
                    if(!disableSubmit){
                        createUser()
                    }else{
                        return
                    }
            }} className="button" >create</button>
            {loading&&<h3>Loading...</h3>}
            <h4>{errorCode}</h4>
        </div>
    )
}