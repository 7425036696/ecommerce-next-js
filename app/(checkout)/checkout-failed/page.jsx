import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import Link from "next/link";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";



const fetchCheckout = async (order_id) => {
  const supabase = createServerComponentClient({ cookies });
  console.log('tupe', typeof order_id)
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", Number(order_id))
    .single();

  if (error) {
    console.error(error.message);
    return null;
  }

  return data;
};

  
export default async function Page({ searchParams }) {
  const { order_id } = searchParams;
  const checkout = await fetchCheckout(order_id);

  return (
    <main>
      <Header />
      <section className="min-h-screen flex flex-col gap-3 justify-center items-center">
        <div className="flex justify-center w-full">
          <img src="success.svg" className="h-48" alt="" />
        </div>
        <h1 className="text-2xl font-semibold">Your Payment Was Not Success</h1>
        <div className="flex items-center gap-4 text-sm">
          <Link href={"/"}>
            <button className="text-blue-600 border border-blue-600 px-5 py-2 rounded-lg bg-white">
              Shop
            </button>
          </Link>
          <Link href={checkout?.stripe_url || "/"}>
  <button className="bg-blue-600 border px-5 py-2 rounded-lg text-white">
    Retry
  </button>
</Link>

        </div>
      </section>
      <Footer />
    </main>
  );
}