import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'
import { env } from '$amplify/env/generate-presigned-url'

const s3 = new S3Client()

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
	console.log('event context', event.requestContext)
	const claims = event.requestContext as unknown as {
		authorizer: {
			jwt: {
				claims: {
					sub: string
				}
			}
		}
	}
	const sub = claims.authorizer.jwt.claims.sub
	console.log('sub', sub)
	const filename = `random-memes/${sub}/${randomUUID()}`

	// Create presigned PUT URL
	const command = new PutObjectCommand({
		Bucket: env.BLOG_PICS_BUCKET_NAME,
		Key: filename,
		ContentType: 'image/jpeg',
	})

	const url = await getSignedUrl(s3, command, {
		expiresIn: 60 * 3, // 3 minutes
	})

	return {
		body: JSON.stringify({ url, headers: { 'Content-Type': 'image/jpeg' } }),
	}
}
