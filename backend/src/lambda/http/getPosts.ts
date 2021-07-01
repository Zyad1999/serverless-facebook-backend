import 'source-map-support/register'

import {APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getAllPosts } from '../../businessLogic/posts'


export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {

  const posts = await getAllPosts()
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
