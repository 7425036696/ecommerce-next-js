'use client'
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Suspense, useState, useEffect } from "react";
import { Rating } from "@mui/material";
import FavouriteButton from './FavouriteButton'
import AddToCartButton from "./AddToCartButton";
import {getProductRating} from '@/lib/server'

export default function ProductsGridView({ products }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Display 12 products per page

  // Calculate the total number of pages
  const totalPages = Math.ceil(products?.length / itemsPerPage);

  // Get the products for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products?.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to page 1 if products change
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  return (
    <section className="w-full flex justify-center">
      <div className="flex flex-col gap-5 max-w-[900px] p-5">
        <h1 className="text-center font-semibold text-lg">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {currentProducts?.map((item) => {
            return <ProductCard product={item} key={item?.id} />;
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-5">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-lg text-sm ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export function ProductCard({ product }) {
  return (
    <div className="flex flex-col gap-3 border p-4 rounded-xl shadow-sm hover:shadow-md transition">
      <div className="relative w-full">
        <img
          src={product?.featureImage || 'any.png'}
          className="rounded-xl h-48 w-full object-cover"
          alt={product?.title}
        />
        <div className="absolute top-2 right-2">
        <FavouriteButton productId={product?.id}/>
        </div>
      </div>
  
      <Link href={`/products/${product?.id}`}>
        <h1 className="font-semibold line-clamp-2 text-sm hover:text-blue-600 transition">
          {product?.title}
        </h1>
      </Link>
  
      <div>
        <h2 className="text-green-600 text-sm font-semibold">
          ₹ {product?.salePrice}{" "}
          <span className="line-through text-xs text-gray-500">
            ₹ {product?.price}
          </span>
        </h2>
      </div>
  
      <p className="text-xs text-gray-600 line-clamp-2">{product?.shortDescription}</p>
  
      <Suspense>
        <RatingReview product={product} />
      </Suspense>
  
      {product?.stock <= (product?.orders ?? 0) && (
        <div>
          <h3 className="text-red-500 text-xs font-semibold">Out Of Stock</h3>
        </div>
      )}
  
      <div className="flex items-center gap-3">
        <Link href={`/checkout?type=buynow&productId=${product?.id}`} className="w-full">
          <button className="bg-blue-600 hover:bg-blue-700 transition text-white text-xs px-4 py-2 rounded-lg w-full">
            Buy Now
          </button>
        </Link>
      <AddToCartButton product={product}/>
      </div>
    </div>
  );
  
}

  function RatingReview({ product }) {
  const [counts, setCounts] = useState({
    averageRating: 0,
    totalReviews: 0,
  })

  useEffect(() => {
    async function fetchRating() {
      const { average, count } = await getProductRating(product.id)
      setCounts({ averageRating: average, totalReviews: count })
    }

    if (product?.id) {
      fetchRating()
    }
  }, [product?.id])

  return (
    <div className="flex gap-3 items-center">
      <Rating value={counts?.averageRating ?? 0} />
      <h1 className="text-xs text-gray-400">
        <span>{counts?.averageRating?.toFixed(1)}</span> ({counts?.totalReviews})
      </h1>
    </div>
  )
}

