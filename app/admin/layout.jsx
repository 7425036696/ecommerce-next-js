'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from './components/AdminLayout'
import { useUser } from '@clerk/nextjs'

// No need for AuthProvider when using Clerk
function Layout({ children }) {
  return <AdminChecking>{children}</AdminChecking>
}

export const AdminChecking = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login')
    }
  }, [isLoaded, isSignedIn])

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        {/* Optional: loading spinner */}
        <p>Loading...</p>
      </div>
    )
  }

  return <AdminLayout>{children}</AdminLayout>
}

export default Layout
