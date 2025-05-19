'use client';

import React, { useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { useUser } from '@clerk/nextjs'; // Importing useUser from data.js
import toast from 'react-hot-toast';

function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null); // null = loading, false = not admin, true = admin
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  const router = useRouter(); // Router to redirect non-admins

  const { user, loading, error } = useUser();
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close sidebar if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.emailAddresses[0].emailAddress) {
        setIsAdmin(false); // If no user email, they are not an admin
        return;
      }
      const email = user?.emailAddresses?.[0]?.emailAddress
      console.log(email, 'email')
      try {
        const { data, error } = await supabase
          .from('admins')
          .select('*')
const mainData = data.map((item) => item.email.trim() == email);
        if (error || !mainData) {
          setIsAdmin(false); 
        } else {
          // Trim email from the database in case there are newlines
       setIsAdmin(true);
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        setIsAdmin(false); // Set admin to false on error
        toast.error('An error occurred while checking admin status.');
      }
    };

    if (user) {
      checkAdmin();
    }
  }, [user]);

  // Show loading state while checking user and admin status
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-700 text-xl">
        Checking admin access...
      </div>
    );
  }

  // Show error message if there's an issue fetching user data
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500 text-xl font-semibold">
        Error: {error}
      </div>
    );
  }

  // Show "not an admin" message if user is not an admin
  if (!isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500 text-xl font-semibold">
        You are not an admin.
      </div>
    );
  }

  return (
    <main className="relative flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed md:hidden z-50 top-0 left-0 h-full w-[260px] bg-white shadow transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar />
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <section className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <section className="flex-1 bg-[#eff3f4] px-4">{children}</section>
      </section>
    </main>
  );
}

export default AdminLayout;
