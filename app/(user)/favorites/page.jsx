"use client";

import { ProductCard } from "@/app/components/Products";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { getProduct } from "@/lib/server";

export default function Page() {
  const { user } = useUser(); // Clerk user
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        let ids = [];

        if (user) {
          // Fetch from Supabase for logged-in users
          const { data, error } = await supabase
            .from("favourites")
            .select("product_id")
            .eq("user_id", user.id);

          if (error) throw error;

          ids = data.map((item) => item.product_id);
        } else {
          // Fetch from localStorage
          const storedFavorites = localStorage.getItem("favourites");
          if (storedFavorites) {
            const parsed = JSON.parse(storedFavorites);
            if (Array.isArray(parsed)) {
              ids = parsed;
            }
          }
        }

        setFavorites(ids);
      } catch (error) {
        console.error("Failed to load favorites", error);
        setFavorites([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (isLoading) {
    return (
      <div className="p-10 flex w-full justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-3 justify-center items-center p-5">
      <h1 className="text-2xl font-semibold">Favorites</h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col gap-5 justify-center items-center h-full w-full py-20">
          <div className="flex justify-center">
            <img className="h-[200px]" src="/svgs/Empty-pana.svg" alt="No favorites" />
          </div>
          <h1 className="text-gray-600 font-semibold">
            Please Add Products To Favorites
          </h1>
        </div>
      ) : (
        <div className="p-5 w-full md:max-w-[900px] gap-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          {favorites.map((productId) => (
            <ProductItem productId={productId} key={productId} />
          ))}
        </div>
      )}
    </main>
  );
}

function ProductItem({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const matchedProduct = await getProduct({ id: productId });
        setProduct(matchedProduct?.[0] || null);
      } catch (error) {
        console.error("Error fetching product", error);
        setProduct(null);
      }
    }

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div>Loading product...</div>;
  }

  return <ProductCard product={product} />;
}
