"use client";

import { getProduct, deleteReview } from "@/lib/server";
import {useAllReview} from '@/lib/data'
import { Rating } from "@mui/material";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from '@clerk/nextjs';


export default function ListView() {
  const { data: reviews } = useAllReview();

  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl">
      <div className="flex flex-col gap-4">
        {reviews?.map((item) => {
          return <ReviewCard item={item} key={item?.id} />;
        })}
      </div>
    </div>
  );
}

function ReviewCard({ item }) {
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const { data: product } = getProduct({id : item?.product_id});
console.log('product', product)
console.log('item', item)
  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;
    setIsLoading(true);
    try {
      await deleteReview({
        uid: item?.uid,
        productId: item?.productId,
      });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex gap-3 bg-white border p-5 rounded-xl">
      <div className="">
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between">
        <div>
      <div className="flex items-center gap-2">
        {user?.imageUrl && (
          <img
            src={user.imageUrl}
            alt="User Avatar"
            className="w-6 h-6 rounded-full"
          />
        )}
        <h1 className="font-semibold">{item?.display_name}</h1>
      </div>
      
      <Rating value={item?.rating} readOnly size="small" />
      
      <Link href={`/products/${item?.product_id}`}>
        <h1 className="text-xs">{product?.[0].title}</h1>
      </Link>
    </div>
          <button
           
            disabled={isLoading}
            onClick={handleDelete}
          >
            <Trash2 size={12} />
          </button>
        </div>
        <p className="text-sm text-gray-700 pt-1">{item?.message}</p>
      </div>
    </div>
  );
}