import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'
import { getUserPosts } from '../../businessLogic/posts'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const currentUserId:string = getUserId(event) //current userfrom authorization
  const userId:string = event.pathParameters.userId //requested user from the request parameters

  const posts = await getUserPosts(userId,currentUserId)
  console.log("Posts retrived are "+posts)

  if (posts) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        posts
      })
    }
  }
  return {
    statusCode: 404,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}