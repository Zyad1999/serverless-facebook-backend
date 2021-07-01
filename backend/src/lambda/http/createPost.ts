import 'source-map-support/register'
import * as uuid from 'uuid'
import { getUserId } from '../utils'
import { createPost } from '../../businessLogic/posts'


import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreatePostRequest } from '../../requests/CreatePostRequest'
import { PostItem } from '../../models/PostItem'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const newPostBody: CreatePostRequest = JSON.parse(event.body)
  const postId:string = uuid.v4()
  const userId:string = getUserId(event)

  const newPost:PostItem = await createPost(newPostBody,postId,userId)
  console.log("Creat new post "+newPost)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({post: newPost})
  }
}