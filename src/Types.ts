export class Comments{
        userid:number|undefined
        username:string|undefined
        commentLikes:number|undefined
        commentBody:string|undefined
        createdAt:number|undefined
        
        Comments(){
                this.userid=0
                this.username=""
                this.commentLikes=0
                this.commentBody=""
                this.createdAt=0
        }
        
}

export class PostObject{
        title:string=""
        body:string | undefined
        post_likes: number |undefined
        comments:Comments[]|undefined
        userid:number|undefined
        username:string|undefined
        createdAt:number|undefined

        PostObject(){
                this.title=""
                this.body=""
                this.post_likes=0
                this.comments=[]
                this.userid=0
                this.username=""
                this.createdAt=0
        }
}

