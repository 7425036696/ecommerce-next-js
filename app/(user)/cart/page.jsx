"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { getProduct } from "@/lib/server";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@clerk/nextjs";

export default function Page() {
  const supabase = createClientComponentClient();
  const { user } = useUser();

  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items from Supabase
  useEffect(() => {
    async function fetchCart() {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading cart:", error);
        setCartItems([]);
      } else {
        setCartItems(data);
      }
    }

    fetchCart();
  }, [user?.id]);

  // Fetch product details for each cart item
  useEffect(() => {
    async function fetchCartProducts() {
      try {
        const promises = cartItems.map((item) =>
          getProduct({ id: item.product_id }).then((res) => ({
            ...res[0],
            quantity: item.quantity,
          }))
        );
        const resolvedProducts = await Promise.all(promises);
        setProducts(resolvedProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }

    if (cartItems.length > 0) {
      fetchCartProducts();
    } else {
      setLoading(false);
    }
  }, [cartItems]);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    const item = cartItems.find((item) => item.product_id === productId);
    if (!item) return;

    const { error } = await supabase
      .from("cart")
      .update({ quantity })
      .eq("id", item.id);

    if (!error) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product_id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeItem = async (productId) => {
    const item = cartItems.find((item) => item.product_id === productId);
    if (!item) return;

    const { error } = await supabase.from("cart").delete().eq("id", item.id);

    if (!error) {
      setCartItems((prev) =>
        prev.filter((item) => item.product_id !== productId)
      );
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex w-full justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-5 justify-center items-center p-6">
      <h1 className="text-2xl font-semibold text-gray-800">Your Cart</h1>
      {products.length === 0 ? (
        <div className="flex flex-col gap-5 justify-center items-center h-full w-full py-20">
          <img
            className="h-[200px]"
            src="/svgs/Empty-pana.svg"
            alt="No Cart Items"
          />
          <h1 className="text-gray-600 font-semibold text-lg">
            Your cart is empty. Please add products to your cart.
          </h1>
        </div>
      ) : (
        <>
          <div className="p-5 w-full md:max-w-[900px] gap-6 grid grid-cols-1 md:grid-cols-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 items-center border px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  className="h-16 w-16 object-cover rounded-lg"
                  src={product.featureImage}
                  alt={product.title}
                />
                <div className="flex flex-col gap-2 w-full">
                  <h1 className="text-sm font-semibold text-gray-800">
                    {product.title}
                  </h1>
                  <h1 className="text-green-500 text-lg">
                    ₹{product.salePrice}{" "}
                    <span className="line-through text-xs text-gray-500">
                      ₹{product.price}
                    </span>
                  </h1>
                  <div className="flex items-center gap-3 text-xs">
                    <button
                      onClick={() =>
                        updateQuantity(product.id, product.quantity - 1)
                      }
                      disabled={product.quantity <= 1}
                      className="h-8 w-8 flex justify-center items-center bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors duration-200"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-gray-700">{product.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(product.id, product.quantity + 1)
                      }
                      className="h-8 w-8 flex justify-center items-center bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors duration-200"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-red-600 hover:text-red-700 transition-colors duration-200"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
          <div className="w-full md:max-w-[900px] flex justify-end mt-6">
            <Link href={`/checkout?type=cart`}>
              <button className="bg-blue-600 px-6 py-3 text-sm rounded-lg text-white hover:bg-blue-700 transition-colors duration-300">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
