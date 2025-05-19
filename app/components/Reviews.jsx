"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Rating } from "@mui/material";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const PAGE_SIZE = 5;

export default function Reviews({ productId }) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchReviews = async () => {
    setIsLoading(true);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error, count } = await supabase
      .from("reviews")
      .select("*", { count: "exact" }) // enable counting
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      toast.error("Failed to load reviews.");
    } else {
      setReviews(data);
      setTotalCount(count || 0);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, page]);

  const handleDelete = async (reviewId) => {
    if (!confirm("Are you sure?")) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("uid", user.id);

      if (error) throw error;

      toast.success("Successfully deleted");

      // If user deletes the last item on the last page, go to previous page
      const isLastItemOnPage = reviews.length === 1 && page > 1;
      setPage((prev) => (isLastItemOnPage ? prev - 1 : prev));
      fetchReviews();
    } catch (error) {
      toast.error(error.message || "Failed to delete review");
    }
    setIsLoading(false);
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="flex flex-col gap-3 p-3 rounded-xl border w-full">
      <h1 className="text-lg font-semibold">Reviews</h1>
      <div className="flex flex-col gap-4">
        {reviews?.map((item) => (
          <div key={item.id} className="flex gap-3">
            <img src={item?.photo_url} className="w-8 h-8 rounded-full object-cover" />
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between">
                <div>
                  <h1 className="font-semibold">{item?.display_name}</h1>
                  <Rating value={item?.rating} readOnly size="small" />
                </div>
                {user?.id === item?.uid && (
                  <button
                    disabled={isLoading}
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 pt-1">{item?.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm px-2 py-1">{page} / {totalPages}</span>
          <button
            className="px-3 py-1 text-sm border rounded disabled:opacity-50"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
