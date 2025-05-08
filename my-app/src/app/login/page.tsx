

import React, { Suspense } from 'react'
import LoginForm from './LoginForm'

const PageLogin = () => {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

export default PageLogin