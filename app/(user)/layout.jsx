"use client";

import Footer from "../components/Footer";
import Header from "../components/Header";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function Layout({ children }) {
  return (
    <main>
      <Header />
=        <UserChecking>
          <section className="min-h-screen">{children}</section>
        </UserChecking>
      <Footer />
    </main>
  );
}

function UserChecking({ children }) {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        {/* Optional loading spinner */}
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="h-screen w-full flex flex-col gap-3 justify-center items-center">
        <h1 className="text-sm text-gray-600">You are not logged in!</h1>
        <Link href="/login">
          <button className="text-white bg-blue-500 px-4 py-2 text-sm rounded-xl">
            Login
          </button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
