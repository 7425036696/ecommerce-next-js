import { ProductCard } from "@/app/components/Products";
import { getProductsByCategory } from "@/lib/server";

export default async function RelatedProducts({ categoryId, page = 1 }) {
  const limit = 8; // You can change this to any number per page
  const products = await getProductsByCategory({ categoryId, page, limit });

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col gap-5 max-w-[900px] p-5">
        <h1 className="text-center font-semibold text-lg">Related Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products?.map((item) => (
            <ProductCard product={item} key={item?.id} />
          ))}
        </div>
        {/* Pagination controls could go here */}
      </div>
    </div>
  );
}
