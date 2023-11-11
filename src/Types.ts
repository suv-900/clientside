export class Comments{
        commentID:number
        userid:number
        username:string
        userliked:boolean
        commentLikes:number
        commentBody:string
        createdAt:number

        constructor(){
                this.userliked=false
                this.commentID=0
                this.userid=0
                this.username=""
                this.commentLikes=0
                this.commentBody=""
                this.createdAt=0
        }

       
}

export class PostObject{
        title:string 
        body:string 
        post_likes: number 
        comments:Comments[]
        authorid:number
        username:string
        postLikedByUser:boolean
        postDislikedByUser:boolean
        createdat:number
        updatedat:number

        constructor(){
                this.title=""
                this.body=""
                this.post_likes=0
                this.comments=[]
                this.authorid=0
                this.username=""
                this.postLikedByUser=false
                this.postDislikedByUser=false
                this.createdat=0
                this.updatedat=0
        }
        
       
}

