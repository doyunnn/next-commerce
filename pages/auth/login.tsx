import GoogleLogin from '@/components/GoogleLogin'
import React from 'react'

export default function Login() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <GoogleLogin />
    </div>
  )
}
