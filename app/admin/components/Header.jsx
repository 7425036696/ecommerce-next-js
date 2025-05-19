'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { useUser } from '@clerk/nextjs'; // ✅ Import Clerk's `useUser` hook

export default function Header({ toggleSidebar }) {
  const { user, isLoaded } = useUser(); // ✅ Clerk hook to get user data
console.log(user,'this is me')
  // Ensure the user data is loaded
  if (!isLoaded) {
    return null; // Optionally show a loading spinner here
  }

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 shadow-md sticky top-0 z-50">
      {/* Sidebar toggle for mobile */}
      <button onClick={toggleSidebar} className="md:hidden">
        <Menu size={24} />
      </button>

      {/* Title */}
      <h1 className="text-lg font-semibold">My App</h1>

      {/* User Info */}
      {user && (
        <div className="flex items-center space-x-3 max-w-xs overflow-hidden">
          {/* Name & Email - hide on small screens */}
          <div className="hidden sm:flex flex-col text-right text-sm leading-tight truncate max-w-[120px]">
            <span className="font-medium truncate">{user.firstName || 'User'}</span>
            <span className="text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress}</span>
          </div>
          {/* Avatar */}
          {user.imageUrl && (
            <img
              src={user.imageUrl}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border"
            />
          )}
        </div>
      )}
    </header>
  );
}
