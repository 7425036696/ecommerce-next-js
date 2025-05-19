"use client";

import React, { useEffect, useState } from "react";
import { Heart, HeartOff } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase"; // adjust path as needed

const FavouriteButton = ({ productId }) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useUser(); // Clerk user

  useEffect(() => {
    const checkFavourite = async () => {
      if (!user) return setLoading(false);
      const { data, error } = await supabase
        .from("favourites")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single();

      if (data) setIsFavourite(true);
      setLoading(false);
    };

    checkFavourite();
  }, [user, productId]);

  const toggleFavourite = async () => {
    if (!user) {
      toast.error("Please log in to favorite products");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      if (isFavourite) {
        const { error } = await supabase
          .from("favourites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) throw error;

        toast.success("Removed from favorites");
        setIsFavourite(false);
      } else {
        const { error } = await supabase.from("favourites").insert([
          {
            user_id: user.id,
            product_id: productId,
          },
        ]);

        if (error) throw error;

        toast.success("Added to favorites");
        setIsFavourite(true);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  if (loading) return null;

  return (
    <button
      className="text-xl hover:scale-110 transition-transform"
      onClick={toggleFavourite}
    >
      {isFavourite ? <Heart color="red" fill="red" /> : <HeartOff color="gray" />}
    </button>
  );
};

export default FavouriteButton;
