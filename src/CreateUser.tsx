import React from 'react'
import {useState} from 'react'
import './styles.css'
//TODO check all functions again
//TODO add new features test your functions
export default function CreateUser(){
    const[username,setUsername]=useState("")
    const[password,setPassword]=useState("")
    const[email,setEmail]=useState("")    
    const[userexists,setUserexists]=useState(false)
    const[passOK,setPassOK]=useState(true)
    const[validEmail,setValidEmail]=useState(true)
    const[disableSubmit,setdisableSubmit]=useState(true)
    const[isValidEmail,setisValidEmail]=useState(false)
    const[isValidUsername,setisValidUsername]=useState(false)
    const[isValidPassword,setisValidPassword]=useState(false)
    const[invalidUsername,setinvalidUsername]=useState(false) 
    const[loading,setLoading]=useState(false)
    const[usernameLoading,setUsernameLoading]=useState(false) 
    

    async function checkUsername(e: React.ChangeEvent<HTMLInputElement>){
        console.log("checkUsername called")
        const username=e.target.value
        console.log("len "+username.length)
        if(username.length===0){
            setUsername("")
            setUserexists(false)
            setinvalidUsername(true)
            setisValidUsername(false)
        }else{
        setinvalidUsername(false)
        setUsernameLoading(true)
        await fetch("http://localhost:8000/checkusername",{
            method:"POST",
            body:JSON.stringify(username)
            
        }).then(res=>{
            if (res.status===409){
                setUserexists(true)
                setUsernameLoading(false)
                setisValidUsername(false)
            }else{
             setUsernameLoading(false)
             setUserexists(false)
             setUsername(e.target.value!)
             setisValidUsername(true)
            }
        }).catch(err=>{console.log(err)})
        }
        
    }
    
    function checkPass(e: React.ChangeEvent<HTMLInputElement>){
        const len=e.target.value.length
        if(len===0){
            setPassOK(true)
            setisValidPassword(false)
            return
        }
        const checkLen=(len>=5&&len<=10)?true:false
        const checkDigits=/\d/.test(e.target.value)
        const checkSpecialChar=/[@#$&]/.test(e.target.value)

        if (checkDigits&&checkSpecialChar&&checkLen){
            setPassOK(true)
            setPassword(e.target.value)
            setisValidPassword(true)
        }else{
            setPassOK(false)
            setisValidPassword(false)
        }
        enableButton()
    }
    
    function checkEmail(e: React.ChangeEvent<HTMLInputElement>){
        const target=e.target.value;
        if(target.length===0){
            setValidEmail(true)
            setisValidEmail(false)
            return
        }
        
        const res:boolean=/@gmail.com/.test(e.target.value)
        if (res){
            setValidEmail(true);
            setEmail(e.target.value)
            setisValidEmail(true)
        }else{
            setValidEmail(false)
            setisValidEmail(true)
        }
        setTimeout(()=>{enableButton()},1000)
        
    }
    
    
    //React.ButtonHTMLAttributes<HTMLButtonElement>
    async function createUser(){
        console.log("create user")
        setLoading(true)
        if(username===""){
            console.log(username)
            setinvalidUsername(true)
            setisValidUsername(false)
        }
        if(email===""){
            console.log(email)
            setisValidEmail(false)
            setValidEmail(false)
        }
        if(password===""){
            console.log("password "+password)
            setisValidPassword(false)
            setPassOK(false)
        }
        console.log(username+" "+email+" "+password)
        return
        const user=JSON.stringify({username,email,password})
        console.log(user)
        await fetch("http://localhost:8000/register",{
            method:"POST",
            body:user
        }).then(res=>{
            if (res.status!==200){
                console.log("res "+res)
            }
            res.json().then(res=>{
                console.log("token res"+res)
                //localStorage.setItem("userToken",res.token)
            }) 
        })
    }

    function enableButton(){
        console.log("enable button callled.")
        console.log(isValidUsername+" "+isValidEmail+" "+isValidPassword)
        
        if(isValidEmail&&isValidUsername&&isValidPassword){
            setdisableSubmit(false)
        }else{
            setdisableSubmit(true)
        }
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
                {usernameLoading&&<h3>Loading...</h3>}
                {invalidUsername&&<div>Invalid Username</div>}

                <label>Email</label>
                <input type="text" onChange={e=>checkEmail(e)} className="input-field" />
                {validEmail?<></>:<div className="input-error-message">Invalid Email</div>}
                
                <label>Password</label>
                <input type="text" onChange={e=>checkPass(e)} className="input-field" />
                {passOK?<></>:<div className="input-error-message">Invalid Password (pasword should be less than 10 char and should contain atleast a digit or a special char "0-9 @#$&").</div>}
            </form>
            <button disabled={disableSubmit}  onClick={()=>{
                createUser() 
                }} >create</button>
            {loading&&<h3>Loading...</h3>}
        </div>
    )
}