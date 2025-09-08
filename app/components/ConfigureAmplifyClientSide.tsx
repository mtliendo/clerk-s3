'use client'

import { Amplify } from 'aws-amplify'
import outputs from '../../amplify_outputs.json'
import { parseAmplifyConfig } from 'aws-amplify/utils'

const amplifyConfig = parseAmplifyConfig(outputs)
Amplify.configure(
	{
		...amplifyConfig,
		API: {
			...amplifyConfig.API,
			REST: outputs.custom.API,
		},
	},
	{
		API: {
			REST: {
				retryStrategy: {
					strategy: 'no-retry', // Overrides default retry strategy
				},
			},
		},
		ssr: true,
	}
)

export default function ConfigureAmplifyClientSide() {
	return null
}
