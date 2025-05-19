"use client";

import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { Rating } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddReview({ productId, refreshReviews }) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(4);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!user) throw new Error("Please log in first");

      const { error } = await supabase.from("reviews").insert({
        uid: user.id,
        product_id: productId,
        rating,
        message,
        display_name: user.fullName,
        photo_url: user.imageUrl,
      });

      if (error) throw error;

      toast.success("Review submitted");
      setMessage("");
      refreshReviews?.(); // <-- Trigger refresh
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 p-3 rounded-xl border w-full">
      <h1 className="text-lg font-semibold">Rate This Product</h1>
      <Rating
        value={rating}
        onChange={(event, newValue) => setRating(newValue)}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your thoughts on this product..."
        className="w-full border border-lg px-4 py-2 focus:outline-none"
      />
      <button onClick={handleSubmit}  disabled={isLoading}>
        Submit
      </button>
    </div>
  );
}
