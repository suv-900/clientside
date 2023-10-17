
export function CheckCookie():string|null{
    const cookie:string|null=localStorage.getItem("token")
    return cookie 
    }
