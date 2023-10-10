import React from 'react'
import {useState,useEffect} from 'react'
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
    const[usernameavailable,setUsernameavailable]=useState(false) 
    const[userCreated,setUserCreated]=useState(false)
    //done :)
    async function checkUsername(e: React.ChangeEvent<HTMLInputElement>){
        const username=e.target.value
        if(username.length===0){
            setUserexists(false)
            setUsernameavailable(false)
            setinvalidUsername(true)
            setisValidUsername(false)
            setUsername("")
        }else{
        setinvalidUsername(false)
        setUsernameavailable(false)
        setUsernameLoading(true)
        
        setTimeout(()=>{
            fetch("http://localhost:8000/checkusername",{
            method:"POST",
            body:JSON.stringify(username)
            
            }).then(res=>{
            if (res.status===409){
                setUsernameLoading(false)
                setUserexists(true)
                setUsernameavailable(false)
                setisValidUsername(false)
            }else{
             setUsernameLoading(false)
             setUserexists(false)
             setisValidUsername(true)
             setUsernameavailable(true)
             setUsername(e.target.value!)
            }
        }).catch(err=>{console.log(err)})
        },500)
        }
        
    }
   
    useEffect(()=>{
            enableButton()
    },[isValidUsername,isValidEmail,isValidPassword])
    

    function putUsername(e:React.ChangeEvent<HTMLInputElement>){
        setUsername(e.target.value!)
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
            setisValidEmail(false)
        }
        
    }
    
    
    //React.ButtonHTMLAttributes<HTMLButtonElement>
    async function createUser(){
        setLoading(true)
        if(username===""){
            setinvalidUsername(true)
            setisValidUsername(false)
            return
        }
        if(email===""){
            setisValidEmail(false)
            setValidEmail(false)
            return
        }
        if(password===""){
            setisValidPassword(false)
            setPassOK(false)
            return
        }
        const user=JSON.stringify({username,email,password})
        await fetch("http://localhost:8000/register",{
            method:"POST",
            body:user
        }).then(res=>{
            setLoading(false)
            if (res.status===200){
                setUserCreated(true)
                console.log("res "+res)
            }else{

            res.json().then(res=>{
                console.log(res)
                //localStorage.setItem("userToken",res.token)
            }) 
            }
        })
    }
    useEffect(()=>{
        sendToHomePage()
    },[userCreated])
    
    function sendToHomePage(){
        console.log("User created.")
    }
    
    function enableButton(){
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
                <label className="label">Username</label>
                <input type="text" onChange={e=>checkUsername(e)} className="input-field"/>
                {userexists?<div className="input-error-message">username exists! try another username</div>:<></>} 
                {usernameLoading&&<h3 className="input-error-message" >Loading...</h3>}
                {invalidUsername&&<div className="input-error-message" >Invalid Username</div>}
                {usernameavailable?<div className="input-error-message" >username available</div>:<></>}

                <label className="label">Email</label>
                <input type="text" onChange={e=>checkEmail(e)} className="input-field" />
                {validEmail?<></>:<div className="input-error-message">Invalid Email</div>}
                
                <label className="label">Password</label>
                <input type="text" onChange={e=>checkPass(e)} className="input-field" />
                {passOK?<></>:<div className="input-error-message">Invalid Password (pasword should be less than 10 char and should contain atleast a digit or a special char "0-9 @#$&").</div>}
            </form>
            <button disabled={disableSubmit}  onClick={()=>{
                createUser() 
                }} >create</button>
            {loading&&<h3 className="input-error-message"  >Loading...</h3>}
        </div>
    )
}