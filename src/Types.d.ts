export interface Comments{
        userid:number,
        username:string,
        commentLikes:number,
        commentBody:string
        createdAt:number
    }

export interface PostObject{
        title:string,
        body:string,
        post_likes:number,
        comments:Comments[],
        userid:number,
        username:string,
        createdAt:number
}

