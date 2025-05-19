'use client'
import { useState, useEffect } from "react";
import Header from "./components/Header";
import FeaturedProductSlider from "./components/Slider";
import { getFeaturedProducts } from "../lib/server.js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Collection from "./components/Collection";
import {
  fetchCollections as getCollections,
  fetchCategories as getCategories,
  fetchBrands,
  fetchProducts
} from "../lib/server";
import Categories from "./components/Categories";
import ProductGridview from "./components/Products";
import Reviews from "./components/Reviews";
import Brands from "./components/Brands";
import Footer from './components/Footer'
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          featuredProductsData,
          collectionsData,
          categoriesData,
          productsData,
          brandsData
        ] = await Promise.all([
          getFeaturedProducts(),
          getCollections(),
          getCategories(),
          fetchProducts(), // Same as featuredProducts for now
          fetchBrands()
        ]);

        setFeaturedProducts(featuredProductsData);
        setCollections(collectionsData);
        setCategories(categoriesData);
        setProducts(productsData);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <FeaturedProductSlider featuredProducts={featuredProducts} />
      <Collection collections={collections} />
      <Categories categories={categories} />
      <ProductGridview products={products} />
      <Brands brands={brands} />
      <Footer/>
      </>
  );
}
