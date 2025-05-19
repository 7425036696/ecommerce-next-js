"use client";

import { useUser } from "@clerk/nextjs"; // se Clerk's useUser hook for managing user state
import { LogOut } from "lucide-react"; // Import the LogOut icon from Lucide
import toast from "react-hot-toast"; // Toast notifications for success/error feedback
import { useRouter } from "next/navigation"; // Router to redirect after logout

function LogOutButton() {
  const { user, signOut } = useUser(); // Get user and signOut method from Clerk
  const router = useRouter(); // Initialize the router to redirect after logout

  if (!user) {
    return <></>; // If no user is logged in, return nothing
  }

  const handleLogout = async () => {
    if (!confirm("Are you sure?")) return; // Confirm before logging out

    try {
      // Use Clerk's signOut method to log the user out
      await toast.promise(signOut(), {
        loading: "Logging out...",
        success: "Successfully logged out",
        error: (e) => e?.message || "Error logging out",
      });
      router.push("/login"); // Redirect to the login page after successful logout
    } catch (error) {
      toast.error(error?.message || "Error logging out"); // Handle any errors during logout
    }
  };

  return (
    <button
      onClick={handleLogout} // Handle the logout click
      className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
    >
      <LogOut size={14} />
    </button>
  );
}

export { LogOutButton };
