'use client';
import { useEffect, useState } from "react";
import BasicDetails from "./components/BasicDetails";
import Images from "./components/Images";
import Description from "./components/Description";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../../lib/supabase"; // Ensure you import Supabase client

export default function Page() {
  const [data, setData] = useState(null);
  const [featureImage, setFeatureImage] = useState(null);
  const [imageList, setImageList] = useState([]); // Image list state
  const [isLoading, setIsLoading] = useState(false);
  const [productImage, setProductImage] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  // Fetch product data if editing an existing product
  const fetchData = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const { data: product, error } = await supabase
        .from("products") // Replace with your actual table name
        .select("*")
        .eq("id", id) // Assuming "id" is the product identifier in the database
        .single(); // Fetch only one product

      if (error) throw error;

      setData(product); // Set the data retrieved from Supabase
      setFeatureImage(product.featureImageURL);
      setProductImage(product.productImageURL);
      setImageList(product.imageList || []); // Load the existing image list

    } catch (error) {
      toast.error(error.message || "Error fetching product data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleData = (key, value) => {
    setData((prevData) => {
      return {
        ...(prevData ?? {}),
        [key]: value,
      };
    });
  };

  // Create new product
  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("products").insert([{
        title: data?.title,
        shortDescription: data?.shortDescription,
        price: data?.price,
        longDescription: data?.longDescription,
        salePrice: data?.salePrice,
        stock: data?.stock,
        isFeatured: data?.isFeatured,
        brandId: data?.brandId,
        categoryId: data?.categoryId,
        productImage: productImage, // Product image
        featureImage: featureImage, // Feature image
        images: imageList, // Image list
      }]);

      if (error) throw error;

      setData(null);
      setFeatureImage(null);
      setImageList([]); // Clear image list
      toast.success("Product is successfully Created!");
      router.push(`/admin/products`); // Redirect to the product list page
    } catch (error) {
      console.error(error?.message);
      toast.error(error?.message || "Error creating product");
    }
    setIsLoading(false);
  };

  // Update existing product
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({
          title: data?.title,
          shortDescription: data?.shortDescription,
          price: data?.price,
          salePrice: data?.salePrice,
          stock: data?.stock,
          isFeatured: data?.isFeatured,
          brandId: data?.brandId,
          categoryId: data?.categoryId,
          productImage: productImage, // Product image
          featureImage: featureImage, // Feature image
          images: imageList, // Image list
          description: data?.description,
        })
        .eq("id", id); // Update the product where the id matches

      if (error) throw error;

      setData(null);
      setFeatureImage(null);
      setImageList([]); // Clear image list
      toast.success("Product is successfully Updated!");
      router.push(`/admin/products`); // Redirect to the product list page
    } catch (error) {
      console.error(error?.message);
      toast.error(error?.message || "Error updating product");
    }
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (id) {
          handleUpdate();
        } else {
          handleCreate();
        }
      }}
      className="flex flex-col gap-4 p-5"
    >
      <div className="flex justify-between w-full items-center">
        <h1 className="font-semibold">
          {id ? "Update Product" : "Create New Product"}
        </h1>
        <button type="submit">
          {id ? "Update" : "Create"}
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <div className="flex-1 flex">
          <BasicDetails data={data} handleData={handleData} />
        </div>
        <div className="flex-1 flex flex-col gap-5 h-full">
          {/* Images section will handle feature image, product image, and image list */}
          <Images
            data={data}
            featureImage={data?.featureImage || featureImage}
            setFeatureImage={setFeatureImage}
            imageList={data?.images || imageList}
            productImage={data?.productImage || productImage}
            setProductImage={setProductImage}
            setImageList={setImageList}
          />
          <Description data={data} handleData={handleData} />
        </div>
      </div>
    </form>
  );
}
