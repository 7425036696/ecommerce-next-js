import { ProductCard } from "@/app/components/Products";
import {getProduct, getCollectionById} from '@/lib/server'

export async function generateMetadata({ params }) {
    const { collectionId } = params; // ✅ No await needed here
    const collection = await getCollectionById({ id: collectionId });
  
    return {
      title: `${collection[0]?.title} | Collection`,
      description: collection[0]?.subTitle ?? "",
      openGraph: {
        images: [collection[0]?.image],
      },
    };
  }
  

export default async function Page({ params }) {
  const { collectionId } = params;
  const collection = await getCollectionById({ id: collectionId });
  console.log(collection[0])
  return (
    <main className="flex justify-center p-5 md:px-10 md:py-5 w-full">
      <div className="flex flex-col gap-6 max-w-[900px] p-5">
        <div className="w-full flex justify-center">
          <img className="h-[110px]" src={collection[0]?.image} alt="" />
        </div>
        <h1 className="text-center font-semibold text-4xl">
          {collection[0].title}
        </h1>
        <h1 className="text-center text-gray-500">{collection[0].subTitle}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-self-center justify-center items-center gap-4 md:gap-5">
          {collection[0]?.productIds?.map((productId) => {
            return <Product productId={productId} key={productId} />;
          })}
        </div>
      </div>
    </main>
  );
}

async function Product({ productId }) {
    console.log(productId, 'idp')
  const product = await getProduct({ id: productId });
  console.log('prod' , product)
  return <ProductCard product={product[0]} />;
}