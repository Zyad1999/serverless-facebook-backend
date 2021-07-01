import * as AWS  from 'aws-sdk'
import { DocumentClient, UpdateItemOutput } from 'aws-sdk/clients/dynamodb'

import { PostItem } from '../models/PostItem'
import { UpdatePostRequest } from '../requests/UpdatePostRequest'



export class PostAccess {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly postIndex = process.env.INDEX_NAME,
    private readonly postIndex2 = process.env.INDEX_NAME_2,
    private readonly bucketName = process.env.PHOTOS_S3_BUCKET,
    private readonly postsTable = process.env.POSTS_TABLE) {
  }

  async getAllPosts(): Promise<PostItem[]> {
    const result = await this.docClient.query({
        TableName: this.postsTable,
        IndexName: this.postIndex,
        KeyConditionExpression: 'privacy = :privacy',
        ExpressionAttributeValues: {
          ':privacy': "public"
        }
      })
      .promise()
    console.log("Return all public posts")
    return result.Items as PostItem[]
  }

  async getUserPosts(userId:string,privacy:string): Promise<PostItem[]> {
    const userIdPrivacy: string = ""+userId+privacy
    const result = await this.docClient.query({
        TableName: this.postsTable,
        IndexName: this.postIndex2,
        KeyConditionExpression: 'userIdPrivacy = :userIdPrivacy',
        ExpressionAttributeValues: {
          ':userIdPrivacy': userIdPrivacy
        }
      })
      .promise()
    console.log("Return all posts of user "+ userId)
    return result.Items as PostItem[]
  }

  async getPost(postId:string,userId:string): Promise<PostItem> {
    const result = await this.docClient.query({
        TableName: this.postsTable,
        KeyConditionExpression: 'userId = :userId AND postId = :postId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':postId' : postId
        }
      })
      .promise()
    console.log("Return requested post")
    return result.Items[0] as PostItem
  }

  async createPost(post:PostItem){
    await this.docClient
    .put({
      TableName: this.postsTable,
      Item: post
    })
    .promise()
    console.log("Create new post")
  }

  async deletePost(postId:string,userId:string){
    await this.docClient
    .delete({
      TableName: this.postsTable,
      Key: {
        userId: userId,
        postId: postId
      }
    })
    .promise()
    console.log("Delete post " + postId + "for the user "+ userId)
  }

  async updatePost(postId:string,userId:string,updatedPost: UpdatePostRequest): Promise<UpdateItemOutput> {
    const userIdPrivacy: string = ""+userId+updatedPost.privacy
    const newPost:UpdateItemOutput = await this.docClient
    .update({
      TableName: this.postsTable,
      ReturnValues: "ALL_NEW",
      Key: {
        userId: userId,
        postId: postId
      },
      ExpressionAttributeNames: {
        '#text': 'text'
      },
      UpdateExpression:
        'set #text = :text, privacy = :privacy, userIdPrivacy = :userIdPrivacy',
      ExpressionAttributeValues: {
        ':text': updatedPost.text,
        ':privacy': updatedPost.privacy,
        ':userIdPrivacy': userIdPrivacy
      }
    })
    .promise()
    console.log("Update post "+ postId+" for user "+ userId)
    return newPost
  }

  async addPhoto(postId:string,userId:string){
    await this.docClient
    .update({
      TableName: this.postsTable,
      Key: {
        userId: userId,
        postId: postId
      },
      UpdateExpression:
        'set photoUrl = :photoUrl',
      ExpressionAttributeValues: {
        ':photoUrl': `https://${this.bucketName}.s3.amazonaws.com/${postId}`
      }
    })
    .promise()
    console.log("Add photo for the post "+postId + "of the user "+userId)
  }
}