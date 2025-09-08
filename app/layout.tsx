import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from '@clerk/nextjs'
import './globals.css'
import ConfigureAmplifyClientSide from './components/ConfigureAmplifyClientSide'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Clerk Next.js App Router',
	description: 'Next.js app with Clerk authentication',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<ConfigureAmplifyClientSide />
					<header className="p-4 border-b">
						<div className="max-w-4xl mx-auto flex justify-between items-center">
							<h1 className="text-xl font-bold">Clerk + Next.js App Router</h1>
							<div className="flex gap-2">
								<SignedOut>
									<SignInButton />
									<SignUpButton />
								</SignedOut>
								<SignedIn>
									<UserButton />
								</SignedIn>
							</div>
						</div>
					</header>
					<main className="max-w-4xl mx-auto p-4">{children}</main>
				</body>
			</html>
		</ClerkProvider>
	)
}
