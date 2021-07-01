import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export class StorageAccess {
    constructor(
        private readonly bucketName = process.env.PHOTOS_S3_BUCKET,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
        private readonly s3 = new XAWS.S3({signatureVersion: 'v4'})){}
    
    getS3UploadUrl(postId:string):string{
        const signedURL:string = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: postId,
            Expires: this.urlExpiration
        })
        console.log("Generate attachment url for post "+postId)
        return signedURL
        
  }
}