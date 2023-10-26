export class Comments{
        commentID:number|undefined
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
        title:string | undefined
        body:string | undefined
        post_likes: number |undefined
        comments:Comments[]|undefined
        authorid:number|undefined
        username:string|undefined
        createdat:number|undefined
        updatedat:number|undefined

        PostObject(){
                this.title=""
                this.body=""
                this.post_likes=0
                this.comments=[]
                this.authorid=0
                this.username=""
                this.createdat=0
                this.updatedat=0
        }
}

