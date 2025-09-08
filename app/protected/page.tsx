'use client'
import React, { useEffect, useState } from 'react'
import { get } from 'aws-amplify/api'
import { useAuth } from '@clerk/nextjs'

function ProtectedPage() {
	const { getToken } = useAuth()
	const [url, setUrl] = useState<string | null>(null)
	useEffect(() => {
		async function getItem() {
			const token = await getToken({ template: 'apigw-s3' })
			console.log('token', token)
			try {
				const restOperation = get({
					apiName: 'HttpApi',
					path: 'generate-presigned-url',

					options: {
						headers: {
							Authorization: `Bearer ${token}`,
						},
						retryStrategy: {
							strategy: 'no-retry', // Overrides default retry strategy
						},
					},
				})
				const response = await restOperation.response
				const data = (await response.body.json()) as { body: string }
				console.log('data', data)
				const url = JSON.parse(data.body).url
				console.log('data', url)
				setUrl(url)
			} catch (error) {
				console.log('call failed: ', error)
			}
		}
		getItem()
	}, [getToken])

	return (
		<div>
			<input
				type="file"
				onChange={async (e) => {
					const token = await getToken({ template: 'apigw-s3' })
					console.log('token', token)
					const file = e.target.files?.[0]
					if (file && url) {
						const res = await fetch(url, {
							method: 'PUT',
							body: file,
							headers: {
								'Content-Type': file.type,
							},
						})
						console.log('res', res)
					}
				}}
			/>
		</div>
	)
}

export default ProtectedPage
