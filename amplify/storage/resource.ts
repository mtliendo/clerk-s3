import { defineStorage } from '@aws-amplify/backend'
import { generatePresignedUrl } from '../functions/generatePresignedUrl/resource'

export const storage = defineStorage({
	name: 'blog-pics',
	access: (allow) => ({
		'random-memes/*': [
			allow.resource(generatePresignedUrl).to(['write', 'read']),
		],
		'diagrams/*': [allow.resource(generatePresignedUrl).to(['write', 'read'])],
	}),
})
