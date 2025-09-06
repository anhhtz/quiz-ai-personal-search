'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function ErrorContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const error = searchParams?.get('error')
    const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard'

    useEffect(() => {
        if (!error) {
            router.push('/dashboard')
            return
        }
        // Log the error
        console.error(`[AuthErrorPage] Authentication error: ${error}`)
    }, [error, router])

    const getErrorMessage = (errorCode: string) => {
        switch (errorCode) {
            case 'AccountExists':
                return 'This Google account is already linked to another user.'
            case 'LinkingFailed':
                return 'Failed to link Google account. Please try again.'
            case 'Unauthorized':
                return 'Please sign in with your Agribank account first.'
            case 'AccessDenied':
                return 'Access denied. Please ensure you are using your work email.'
            case 'EmailMismatch':
                return 'The Google account email does not match your work email.'
            default:
                return errorCode || 'An error occurred during authentication'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Authentication Error
                    </h2>
                    <div className="mt-2 text-center text-sm text-gray-600">
                        {getErrorMessage(error || '')}
                    </div>
                    <div className="mt-6 flex justify-center space-x-4">
                        <Link
                            href="/dashboard"
                            className="text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AuthErrorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorContent />
        </Suspense>
    )
}
