"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminButton() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.emailAddresses?.[0]?.emailAddress) {
        setLoading(false);
        return;
      }

      const userEmail = user?.emailAddresses?.[0]?.emailAddress
      try {
        const { data, error } = await supabase
        .from("admins")
        .select("email");
    
      if (error) {
        console.error("Error fetching admin emails:", error);
        return false;
      }
    
      // Check if user's email matches any trimmed admin email
      const isAdmin = data.some((admin) => admin.email.trim().toLowerCase() === userEmail.trim().toLowerCase());
      setIsAdmin(isAdmin)
        if (error) {
          setError(error);
          console.error("Error fetching admin:", error);
        }

        setIsAdmin(data?.length > 0);  // ✅ Set based on match
      } catch (err) {
        setError(err);
        console.error("Unexpected error:", err);
      }

      setLoading(false);
    };

    checkAdmin();
  }, [user?.id]); // safer to rely on id rather than email

  if (loading) return <button>Loading...</button>;
  if (error) return <div>Error: {error.message}</div>;

  return isAdmin ? (
    <Link href="/admin">
      <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
        Admin
      </button>
    </Link>
  ) : null;
}
