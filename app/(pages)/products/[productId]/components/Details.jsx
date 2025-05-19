
import { Rating } from "@mui/material";
import Link from "next/link";
import { Suspense } from "react";
import{getCategoryById, getBrandById} from '@/lib/server'
import AddToCartButton from "@/app/components/AddToCartButton";
// import FavouriteButton from "@/app/components/FavouriteButton";
export default function Details({ product }) {
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex gap-3">
        <Category categoryId={product?.categoryId} />
        <Brand brandId={product?.brandId} />
      </div>
      <h1 className="font-semibold text-xl md:text-4xl">{product?.title}</h1>
      <Suspense fallback="Loading Reviews...">
        <RatingReview product={product} />
      </Suspense>
      <h2 className="text-gray-600 text-sm line-clamp-3 md:line-clamp-4">
        {product?.shortDescription}
      </h2>
      <h3 className="text-green-500 font-bold text-lg">
        ₹ {product?.salePrice}{" "}
        <span className="line-through text-gray-700 text-sm">
          ₹ {product?.price}
        </span>
      </h3>
      <div className="flex flex-wrap items-center gap-4">
  <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
    <button className="bg-black text-white rounded-lg px-5 py-2 font-medium hover:bg-gray-800 transition">
      Buy Now
    </button>
  </Link>

  <AddToCartButton product={product}/>

  {/* <FavouriteButton productId={product?.id}/> */}
</div>

      {product?.stock <= (product?.orders ?? 0) && (
        <div className="flex">
          <h3 className="text-red-500 py-1 rounded-lg text-sm font-semibold">
            Out Of Stock
          </h3>
        </div>
      )}
      <div className="flex flex-col gap-2 py-2">
        <div
          className="text-gray-600"
          dangerouslySetInnerHTML={{ __html: product?.longDescription ?? "" }}
        ></div>
      </div>
    </div>
  );
}

async function Category({ categoryId }) {
  const category = await getCategoryById({id : categoryId})
  return (
    <Link href={`/categories/${categoryId}`}>
      <div className="flex items-center gap-1 border px-3 py-1 rounded-full">
        <img className="h-4" src={category[0]?.image} alt="" />
        <h4 className="text-xs font-semibold">{category[0]?.name}</h4>
      </div>
    </Link>
  );
}

async function Brand({ brandId }) {
  const brand = await getBrandById({id : brandId})

  return (
    <div className="flex items-center gap-1 border px-3 py-1 rounded-full">
      <img className="h-4" src={brand[0]?.image} alt="" />
      <h4 className="text-xs font-semibold">{brand[0]?.name}</h4>
    </div>
  );
}

function RatingReview({ product }) {
  const counts = {
    averageRating: 4.3,
    totalReviews: 32,
  };

  return (
    <div className="flex gap-3 items-center">
      <Rating value={counts?.averageRating ?? 0} readOnly />
      <h1 className="text-sm text-gray-400">
        <span>{counts?.averageRating?.toFixed(1)}</span> ({counts?.totalReviews})
      </h1>
    </div>
  );
}
