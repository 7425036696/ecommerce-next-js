import {  getCategoryById, getProductsByCategory } from "@/lib/server";
import { ProductCard } from '@/app/components/Products'


export async function generateMetadata({ params }) {
  const { categoryId } = params;
  const category = await getCategoryById({ id: categoryId });

  return {
    title: `${category[0]?.name} | Category`,
    openGraph: {
      images: [category[0]?.image],
    },
  };
}

export default async function Page({ params }) {
  const { categoryId } = params;
  const category = await getCategoryById({ id: categoryId });
  const products = await getProductsByCategory({ categoryId: categoryId });
  return (
    <main className="flex justify-center p-5 md:px-10 md:py-5 w-full">
      <div className="flex flex-col gap-6 max-w-[900px] p-5">
        <h1 className="text-center font-semibold text-4xl">{category[0].name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-self-center justify-center items-center gap-4 md:gap-5">
          {products?.map((item) => {
            return <ProductCard product={item} key={item?.id} />;
          })} 
        </div>
      </div>
    </main>
  );
}