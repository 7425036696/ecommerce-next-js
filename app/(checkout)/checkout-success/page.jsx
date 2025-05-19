import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import SuccessMessage from "./components/SuccessMessage";

const fetchCheckout = async (supabase, order_id) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", order_id)
    .single();

  if (error || !data) {
    throw new Error("Invalid Checkout ID");
  }
  return data;
};

const updateProductStock = async (supabase, productId, quantityPurchased) => {
  // Log the productId to debug
  console.log("Updating stock for product ID:", productId);

  // Fetch the current stock for the product
  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("stock")
    .eq("id", productId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch product stock for product ID ${productId}: ${fetchError.message}`);
  }

  // Calculate the new stock
  const newStock = product.stock - quantityPurchased;

  // Ensure stock doesn't go negative
  if (newStock < 0) {
    throw new Error(`Not enough stock for product ID ${productId}`);
  }

  // Update the stock
  const { error } = await supabase
    .from("products")
    .update({ stock: newStock })
    .eq("id", productId);

  if (error) {
    throw new Error(`Failed to update stock for product ID ${productId}: ${error.message}`);
  }
};

export default async function Page({ searchParams }) {
  const supabase = createServerComponentClient({ cookies });
  const order_id = searchParams?.order_id;

  if (!order_id) {
    return (
      <main>
        <Header />
        <section className="min-h-screen flex justify-center items-center">
          <h1 className="text-xl">Missing checkout ID</h1>
        </section>
        <Footer />
      </main>
    );
  }

  try {
    const checkout = await fetchCheckout(supabase, order_id);

    // Log the checkout data to check if products are structured properly
    console.log("Checkout products:", checkout.products);

    // If the checkout is successful, update the stock for each product
    for (const product of checkout.products) {
      console.log("Product data:", product);
      if (product.id && product.quantity) {
        await updateProductStock(supabase, product.id, product.quantity);
      } else {
        console.error("Invalid product data:", product);
      }
    }

    console.log(checkout, "check");

    return (
      <main>
        <Header />
        <SuccessMessage products={checkout.products} />
        <section className="min-h-screen flex flex-col gap-3 justify-center items-center">
          <div className="flex justify-center w-full">
            <img src="success.svg" className="h-48" alt="Payment Success" />
          </div>
          <h1 className="text-2xl font-semibold text-green">
            Your Order Is{" "}
            <span className="font-bold text-green-600">Successfully</span> Placed
          </h1>
          <div className="flex items-center gap-4 text-sm">
            <Link href={"/account"}>
              <button className="text-blue-600 border border-blue-600 px-5 py-2 rounded-lg bg-white">
                Go To Orders Page
              </button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  } catch (error) {
    return (
      <main>
        <Header />
        <section className="min-h-screen flex justify-center items-center">
          <h1 className="text-red-600 font-semibold text-xl">
            Something went wrong: {error.message}
          </h1>
        </section>
        <Footer />
      </main>
    );
  }
}

