'use client'
import { useLayoutEffect } from 'react'
import AuthGoogle from './components/AuthGoogle'

export default function AuthPage() {
    useLayoutEffect(() => {
        document.title = `Join Quiz.AI`
    }, [])

    /**
     * render UI
     */
    return <AuthGoogle />
}
