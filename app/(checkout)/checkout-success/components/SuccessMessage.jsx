"use client";

import confetti from "canvas-confetti";
import { useEffect } from "react";
import { useUser } from '@clerk/nextjs';
import { supabase } from "@/lib/supabase";
export default function SuccessMessage({ products }) {
  const { user } = useUser();
  const removePurchasedItemsFromCart = async (orderProducts) => {
    if (!user || !orderProducts?.length) return;
  
    const productIdsToRemove = orderProducts.map(p => p.id);
  
    console.log("User ID:", user.id);
    console.log("Product IDs to remove:", productIdsToRemove);
  
    const { error } = await supabase
      .from('cart')
      .delete()
      .in('product_id', productIdsToRemove)
      .eq('user_id', user.id);
  
    if (error) {
      console.error('Failed to remove purchased items from cart:', error);
    } else {
      console.log('Cart items removed successfully.');
    }
  };
  

  useEffect(() => {
    // Trigger confetti animation
    confetti();

    if (Array.isArray(products)) {
      removePurchasedItemsFromCart(products);
    }
  }, [products]);

  return null;
}
