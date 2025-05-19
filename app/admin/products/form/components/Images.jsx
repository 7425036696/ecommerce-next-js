'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../../../lib/supabase';
import toast from 'react-hot-toast';

export default function Images({
  setFeatureImage,
  featureImage,
  setProductImage,
  productImage,
  setImageList,
  imageList,
}) {
  const [uploading, setUploading] = useState(false);

  // Handle feature image upload
  const handleFeatureImageUpload = async (file) => {
    try {
      setUploading(true);
      const ext = file.name.split('.').pop();
      const fileName = `feature-${Date.now()}.${ext}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage.from('images').upload(filePath, file, { upsert: true });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
      console.log('Feature Image URL:', urlData.publicUrl); // Debugging line
      setFeatureImage(urlData.publicUrl); // Update feature image URL state
      toast.success('Feature image uploaded!');
    } catch (err) {
      toast.error(err.message || 'Failed to upload feature image');
    } finally {
      setUploading(false);
    }
  };

  // Handle product image upload
  const handleProductImageUpload = async (file) => {
    try {
      setUploading(true);
      const ext = file.name.split('.').pop();
      const fileName = `product-${Date.now()}.${ext}`;
      const filePath = `products/${fileName}`;

      const { error } = await supabase.storage.from('images').upload(filePath, file, { upsert: true });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
      console.log('Product Image URL:', urlData.publicUrl); // Debugging line
      setProductImage(urlData.publicUrl); // Update product image URL state
      toast.success('Product image uploaded!');
    } catch (err) {
      toast.error(err.message || 'Failed to upload product image');
    } finally {
      setUploading(false);
    }
  };

  // Handle image list upload
  const handleImageListUpload = async (files) => {
    try {
      setUploading(true);
      const urls = [];

      for (const file of files) {
        const ext = file.name.split('.').pop();
        const fileName = `product-${Date.now()}-${file.name}`;
        const filePath = `products/${fileName}`;

        const { error } = await supabase.storage.from('images').upload(filePath, file, { upsert: true });
        if (error) throw error;

        const { data: urlData } = supabase.storage.from('images').getPublicUrl(filePath);
        urls.push(urlData.publicUrl);
      }

      const allImages = [...(imageList || []), ...urls];
      setImageList(allImages); // Update the image list state
      toast.success('Images uploaded!');
    } catch (err) {
      toast.error(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (featureImage) {
      console.log('Feature Image Updated:', featureImage); // Debugging line
    }
    if (productImage) {
      console.log('Product Image Updated:', productImage); // Debugging line
    }
  }, [featureImage, productImage]);

  return (
    <section className="flex flex-col gap-3 bg-white border p-4 rounded-xl">
      <h1 className="font-semibold">Images</h1>

      {/* Display Product Image */}
      <p className="text-xs text-gray-500">Product Image</p>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleProductImageUpload(file);
        }}
        className="border px-4 py-2 rounded-lg w-full outline-none"
      />
      {productImage && (
        <div className="flex justify-center mb-4">
          <img src={productImage} alt="Product" className="h-20 object-cover rounded-lg" />
        </div>
      )}
      {/* Display Feature Image */}
      <p className="text-xs text-gray-500">Feature Image</p>

      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFeatureImageUpload(file);
        }}
        className="border px-4 py-2 rounded-lg w-full outline-none"
      />
      {featureImage && (
        <div className="flex justify-center mb-4">
          <img src={featureImage} alt="Feature" className="h-20 object-cover rounded-lg" />
        </div>
      )}
      {/* Image List */}
      <div>
      <p className="text-xs text-gray-500">Additional Images</p>

        <input
          type="file"
          multiple
          onChange={(e) => {
            const files = e.target.files;
            if (files) handleImageListUpload(files);
          }}
          className="border px-4 py-2 mt-2 rounded-lg w-full outline-none"
        />
        <div className="grid grid-cols-3 gap-2 mt-2">
          {imageList?.map((url, index) => (
            <img key={index} src={url} alt={`Image ${index + 1}`} className="h-16 object-cover rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}
