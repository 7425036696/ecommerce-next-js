"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
export default function AddToCartButton({ product }) {
  const { user } = useUser();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const checkCart = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("cart")
        .select("id")
        .eq("user_id", user?.id)
        .eq("product_id", product?.id)
        .maybeSingle();

      if (error) {
        console.error("Check cart error:", error);
        return;
      }

      setIsAdded(!!data);
    };

    checkCart();
  }, [product?.id, user]);

  const handleAddToCart = async () => {
    if (!user) return alert("Please login to add to cart");

    const { data: existingItem } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user?.id)
      .eq("product_id", product?.id)
      .maybeSingle();

    if (existingItem) {
      const { error: updateError } = await supabase
        .from("cart")
        .update({ quantity: existingItem.quantity + 1 })
        .eq("id", existingItem?.id);

      if (updateError) return console.error(updateError);
    } else {
      const { error: insertError } = await supabase.from("cart").insert([
        {
          user_id: user?.id,
          product_id: product?.id,
          quantity: 1,
        },
      ]);

      if (insertError) return console.error(insertError);
    }

    setIsAdded(true);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`px-4 py-2 text-white rounded-md ${
        isAdded ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {isAdded ? <CheckCircle size={20} /> : <ShoppingCart size={20} />}
    </button>
  );
}
