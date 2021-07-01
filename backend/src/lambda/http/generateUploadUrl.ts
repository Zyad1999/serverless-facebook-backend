import 'source-map-support/register'
import { getUploadUrl,addTodoAttachment } from '../../businessLogic/posts'
import { getUserId } from '../utils'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const postId = event.pathParameters.postId
  const userId:string = getUserId(event)

  const signedURL:string = getUploadUrl(postId)
  await  addTodoAttachment(postId,userId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: signedURL
    })
  }
}
