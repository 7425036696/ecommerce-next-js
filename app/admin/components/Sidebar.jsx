'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
const menuItems = [
  { name: 'Dashboard', icon: '🏠', link: '/admin' },
  { name: 'Orders', icon: '📦', link: '/admin/orders' },
  { name: 'Customers', icon: '👥', link: '/admin/customers' },
  { name: 'Reviews', icon: '⭐', link: '/admin/reviews' },
  { name: 'Products', icon: '📱', link: '/admin/products' },
  { name: 'Categories', icon: '🏷️', link: '/admin/categories' },
  { name: 'Brands', icon: '🏢', link: '/admin/brands' },
  { name: 'Collections', icon: '🗂️', link: '/admin/collections' },
  { name: 'Admins', icon: '🛡️', link: '/admin/admins' },
]

const Sidebar = ({ onLinkClick }) => {
  const pathname = usePathname()
  const router = useRouter() // ✅ This was missing
  const { signOut } = useClerk();

  const handleClick = () => {
    if (window.innerWidth < 768 && onLinkClick) {
      onLinkClick()
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(); // Clerk logout
      router.push("/login"); // Redirect after logout
    } catch (error) {
      console.error("Logout error:", error.message);
    } 

    if (window.innerWidth < 768 && onLinkClick) {
      onLinkClick()
    }
  }

  return (
    <div className="w-64 h-screen flex flex-col bg-white border-r border-gray-200 shadow-md relative z-40">
      {/* Logo */}
      <div className="flex items-center justify-center py-4 border-b">
        <Link href={'/'}>
        <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.link
          return (
            <Link
              key={item.name}
              href={item.link}
              onClick={handleClick}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition 
              ${isActive ? 'bg-gray-100 text-black' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-red-600 rounded hover:bg-red-50 font-medium"
        >
          🔓 Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
