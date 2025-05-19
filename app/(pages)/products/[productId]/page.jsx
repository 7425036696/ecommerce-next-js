import { getProduct } from "@/lib/server";
import Photos from "./components/Photos";
import Details from "./components/Details";
import Reviews from "./components/Reviews";
import RelatedProducts from "./components/RelatedProducts";
import AddReview from "./components/AddReiveiw";

// ✅ Fix generateMetadata
export async function generateMetadata(props) {
  const params = await props.params;
  const productId = params.productId;
  const product = await getProduct({ id: productId });

  return {
    title: `${product[0]?.title} | Product`,
    description: product[0]?.shortDescription ?? "",
    openGraph: {
      images: [product[0]?.featureImage],
    },
  };
}

// ✅ Fix default Page
export default async function Page(props) {
  const params = await props.params;
  const productId = params.productId;
  const product = await getProduct({ id: productId });
  return (
    <main className="p-5 md:p-10">
      <section className="flex flex-col-reverse md:flex-row gap-3">
        <Photos
          imageList={[product[0]?.featureImage, ...(product[0]?.images ?? [])]}
        />
        <Details product={product[0]} />
      </section>
      <div className="flex justify-center py-10">
        <div className="flex flex-col md:flex-row gap-4 md:max-w-[900px] w-full">
          <AddReview productId={productId} />
          <Reviews productId={productId} />
        </div>
      </div>
      <RelatedProducts categoryId={product[0]?.categoryId} />
    </main>
  );
}
