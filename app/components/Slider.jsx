'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';
import Slider from 'react-slick';
import FavouriteButton from './FavouriteButton'
import AddToCartButton from './AddToCartButton';
export default function FeaturedProductSlider({ featuredProducts }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  };

  return (
    <div className="overflow-x-hidden">
      <Slider {...settings}>
        {featuredProducts?.map((product) => (
          <div key={product?.id}>
            <div className="flex flex-col-reverse md:flex-row gap-6 bg-[#f8f8f8] p-6 md:px-24 md:py-20 w-full items-center">
              {/* Left Section */}
              <div className="flex-1 flex flex-col gap-5">
                <h2 className="text-gray-500 text-xs md:text-base">NEW FASHION</h2>

                <div className="flex flex-col gap-2">
                  <Link href={`/products/${product?.id}`}>
                    <h1 className="md:text-4xl text-2xl font-semibold hover:underline cursor-pointer">
                      {product?.title}
                    </h1>
                  </Link>
                  <p className="text-gray-600 md:text-sm text-xs max-w-md line-clamp-2">
                    {product?.shortDescription}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Link href={`/checkout?type=buynow&productId=${product?.id}`}>
                    <button className="bg-blue-500 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-600 transition">
                      BUY NOW
                    </button>
                  </Link>
                 <AddToCartButton product={product}/>
        <FavouriteButton productId={product?.id}/>
        </div>
              </div>

              {/* Right Section */}
              <div className="flex-1 flex justify-center items-center">
                <Link href={`/products/${product?.id}`}>
                  <img
                    className="h-[14rem] md:h-[23rem] object-contain"
                    src={product?.featureImage}
                    alt={product?.title}
                  />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
