'use client'

import { SessionProvider } from 'next-auth/react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from 'react-query-devtools';
import { rollbarClientConfig } from '@/lib/rollbar'
import { isDevelopment } from '@/utils/env'
import { ErrorBoundary, Provider } from '@rollbar/react' // Provider imports 'rollbar'

const queryClient = new QueryClient()

export function AppProvider({ children }: { children: React.ReactNode }) {
    if (isDevelopment()) {
        return (
            <QueryClientProvider client={queryClient}>
                <SessionProvider>
                    <ErrorBoundary>{children}</ErrorBoundary>
                </SessionProvider>
            </QueryClientProvider>
        )
    } else
        return (
            <QueryClientProvider client={queryClient}>
                <SessionProvider>
                    <Provider config={rollbarClientConfig}>
                        <ErrorBoundary>{children}</ErrorBoundary>
                    </Provider>
                </SessionProvider>
            </QueryClientProvider>
        )
}
