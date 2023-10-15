
export function CheckCookie():string{
    const cookie:string|null=localStorage.getItem("token")
        if(cookie!=null){
            return cookie
        }else{
            return ""
        } 
    }
