import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateItemOutput } from 'aws-sdk/clients/dynamodb'
import { UpdatePostRequest } from '../../requests/UpdatePostRequest'
import { getUserId } from '../utils'
import { updatePost } from '../../businessLogic/posts'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const postId = event.pathParameters.postId
  const updatedPost: UpdatePostRequest = JSON.parse(event.body)
  const userId:string = getUserId(event)

  if(postId){
    const updatedItem: UpdateItemOutput = await updatePost(postId,userId,updatedPost)
    console.log("Updated Post "+postId)
    return {
      statusCode: 202,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body:JSON.stringify(
        updatedItem
      )
    }
  }
  return {
    statusCode: 400,
    body:'Invalid Post ID'
  }
}
