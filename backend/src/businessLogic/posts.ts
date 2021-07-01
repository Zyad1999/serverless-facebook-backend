import { PostItem } from '../models/PostItem'
import { PostAccess } from '../dataLayer/postsAccess'
import { StorageAccess } from '../dataLayer/storageAccess'
import { CreatePostRequest } from '../requests/CreatePostRequest'
import { UpdatePostRequest } from '../requests/UpdatePostRequest'
import { UpdateItemOutput } from 'aws-sdk/clients/dynamodb'

const postAccess = new PostAccess()
const storageAccess = new StorageAccess()

export async function getAllPosts(): Promise<PostItem[]> {
    return await postAccess.getAllPosts()
}

export async function getUserPosts(userId:string,currentUserId:string): Promise<PostItem[]> {
    if(userId !== currentUserId){
        //User Trying to access posts not current user
        //then return only requested user`s public posts only
        return await postAccess.getUserPosts(userId,"public")
    }else if(userId == currentUserId){
        //User Trying to access posts is current user
        //then return all requested users posts
        const publicPosts = await postAccess.getUserPosts(userId,"public")
        const privatePosts = await postAccess.getUserPosts(userId,"private")
        return [...publicPosts,...privatePosts] as PostItem[]
    }
}

export async function getPost(postId:string,userId:string): Promise<PostItem> {
    return await postAccess.getPost(postId,userId)
}

export async function createPost(newPost: CreatePostRequest,postId:string,userId:string): Promise<PostItem>{
    const createdAt = new Date().toISOString()
    const userIdPrivacy: string = ""+userId+newPost.privacy
    const newItem:PostItem = {
        userId,
        createdAt,
        postId,
        ...newPost,
        userIdPrivacy
    }
    console.log("Created new post " + newItem)
    await postAccess.createPost(newItem)
    console.log("Added new item")
    return newItem
}

export async function deletePost(postId:string,userId:string){
    await postAccess.deletePost(postId,userId)
}

export async function updatePost(postId:string,userId:string,updatedPost: UpdatePostRequest): Promise<UpdateItemOutput> {
    return await postAccess.updatePost(postId,userId,updatedPost)
}

export function getUploadUrl(postId:string): string{
    return storageAccess.getS3UploadUrl(postId)
}

export async function addTodoAttachment(postId:string,userId:string){
    await postAccess.addPhoto(postId,userId)
}