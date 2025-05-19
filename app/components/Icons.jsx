// components/HeaderIcons.jsx
"use client";

import { Heart, Search, ShoppingCart, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import AdminButton from './AdminButton'
import { supabase } from "@/lib/supabase";
export default function Icons() {
  const [cartCount, setCartCount] = useState(0);
const [length, setLength] = useState(null)
  useEffect(() => {
    const fetchLength =  async () =>{
    let { data: favourites, error } = await supabase
    .from('favourites')
    .select('*')
    let { data, errors } = await supabase
    .from('cart')
    .select('*')
    setLength(favourites.length)
    setCartCount(data.length)

  }
  fetchLength()
  }, []);

  return (
    <div className="flex items-center gap-1">
      <UserButton/>
      <AdminButton/>
      <Link href={`/search`}>
        <button
          title="Search Products"
          className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
        >
          <Search size={14} />
        </button>
      </Link>

      <div className="flex items-center gap-1">
        <Link href={`/favorites`}>
          <button
            title="My Favorites"
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50 relative"
          >
            <Heart size={14} />
           {length > 0 && (
              <span className="absolute top-0 right-0 text-[8px] text-white bg-red-500 rounded-full px-1">
                {length}
              </span>
            )} 
          </button>
        </Link>

        <Link href={`/cart`}>
          <button
            title="My Cart"
            className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50 relative"
          >
            <ShoppingCart size={14} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 text-[8px] text-white bg-red-500 rounded-full px-1">
                {cartCount}
              </span>
            )}
          </button>
        </Link>
      </div>

      <Link href={`/account`}>
        <button
          title="My Account"
          className="h-8 w-8 flex justify-center items-center rounded-full hover:bg-gray-50"
        >
          <UserCircle2 size={14} />
        </button>
      </Link>

    </div>
  );
}
