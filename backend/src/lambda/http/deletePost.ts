import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { deletePost } from '../../businessLogic/posts'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const postId = event.pathParameters.postId
  const userId:string = getUserId(event)
  console.log("Delete post "+postId)

  if(postId){
    await deletePost(postId,userId)
    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body:''
    }
  }
  return {
    statusCode: 400,
    body:'Invalid Post ID'
  }
}