import { defineBackend } from '@aws-amplify/backend'
import { generatePresignedUrl } from './functions/generatePresignedUrl/resource'
import { storage } from './storage/resource'
import { HttpJwtAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers'
import {
	CorsHttpMethod,
	HttpApi,
	HttpMethod,
} from 'aws-cdk-lib/aws-apigatewayv2'
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { Stack } from 'aws-cdk-lib'

const backend = defineBackend({
	storage,
	generatePresignedUrl,
})

// const apiStack = backend.createStack('api-stack')

const clerkJwtAuthorizer = new HttpJwtAuthorizer(
	'ClerkJwtAuthorizer',
	'https://apparent-panda-97.clerk.accounts.dev',
	{
		jwtAudience: ['apigw-s3'],
		authorizerName: 'ClerkJwtAuthorizer',
		identitySource: ['$request.header.Authorization'],
	}
)

const httpAPI = new HttpApi(
	Stack.of(backend.generatePresignedUrl.resources.lambda),
	'HttpApi',
	{
		defaultAuthorizer: clerkJwtAuthorizer,
		corsPreflight: {
			allowOrigins: ['*'],
			allowHeaders: ['*'],
			allowMethods: [
				CorsHttpMethod.GET,
				CorsHttpMethod.POST,
				CorsHttpMethod.PUT,
			],
		},
	}
)

httpAPI.addRoutes({
	path: '/generate-presigned-url',
	methods: [HttpMethod.GET, HttpMethod.POST],
	integration: new HttpLambdaIntegration(
		'generate-presigned-url',
		backend.generatePresignedUrl.resources.lambda
	),
})

backend.addOutput({
	custom: {
		API: {
			[httpAPI.httpApiName!]: {
				endpoint: httpAPI.url,
				region: Stack.of(httpAPI).region,
				apiName: httpAPI.httpApiName,
			},
		},
	},
})
