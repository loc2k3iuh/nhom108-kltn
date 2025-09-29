import React from 'react'
import AuthLayoutPage from './AuthLayoutPage'
import SignInForm from '@/components/auth/SignInForm'

const LoginPage = () => {
  return (
    <div>
      <AuthLayoutPage>
        <SignInForm />
      </AuthLayoutPage>
    </div>
  )
}

export default LoginPage