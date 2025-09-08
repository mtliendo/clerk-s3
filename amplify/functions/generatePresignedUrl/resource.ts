import { defineFunction } from '@aws-amplify/backend'

export const generatePresignedUrl = defineFunction({
	name: 'generate-presigned-url',
	runtime: 22,
	entry: './main.ts',
})
