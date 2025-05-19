'use client';

import { useCategoriesAndBrands } from '../../../../../lib/data.js'; // Import the new hook
import toast from 'react-hot-toast';

export default function BasicDetails({ data, handleData }) {
  console.log('data', data);
  const { categories, brands, loading, error } = useCategoriesAndBrands(); // Use the hook

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <section className="flex-1 flex flex-col gap-3 bg-white rounded-xl p-4 border">
      <h1 className="font-semibold">Basic Details</h1>

      {/* Product Title */}
      <InputField
        label="Product Name"
        required
        value={data?.title ?? ''}
        onChange={(val) => handleData('title', val)}
        id="product-title"
        placeholder="Enter Title"
      />

      {/* Short Description */}
      <InputField
        label="Short Description"
        required
        value={data?.shortDescription ?? ''}
        onChange={(val) => handleData('shortDescription', val)}
        id="product-short-description"
        placeholder="Enter Short Description"
      />

      {/* Brand Select */}
      <SelectField
        label="Brand"
        required
        value={data?.brandId ?? ''}
        onChange={(val) => handleData('brandId', val)}
        options={brands}
        id="product-brand"
        placeholder="Select Brand"
      />

      {/* Category Select */}
      <SelectField
        label="Category"
        required
        value={data?.categoryId ?? ''}
        onChange={(val) => handleData('categoryId', val)}
        options={categories}
        id="product-category"
        placeholder="Select Category"
      />

      {/* Stock */}
      <InputField
        label="Stock"
        required
        type="number"
        value={data?.stock ?? ''}
        onChange={(val) => handleData('stock', Number(val))}
        id="product-stock"
        placeholder="Enter Stock"
      />

      {/* Price */}
      <InputField
        label="Price"
        required
        type="number"
        value={data?.price ?? ''}
        onChange={(val) => handleData('price', Number(val))}
        id="product-price"
        placeholder="Enter Price"
      />

      {/* Sale Price */}
      <InputField
        label="Sale Price"
        required
        type="number"
        value={data?.salePrice ?? ''}
        onChange={(val) => handleData('salePrice', Number(val))}
        id="product-sale-price"
        placeholder="Enter Sale Price"
      />

      {/* Is Featured */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-500 text-xs" htmlFor="product-is-featured">
          Is Featured Product <span className="text-red-500">*</span>
        </label>
        <select
          id="product-is-featured"
          className="border px-4 py-2 rounded-lg w-full outline-none"
          value={data?.isFeatured ? 'yes' : 'no'}
          onChange={(e) => handleData('isFeatured', e.target.value === 'yes')}
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>
    </section>
  );
}

function InputField({
  label,
  value,
  onChange,
  id,
  placeholder,
  type = 'text',
  required = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-500 text-xs" htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border px-4 py-2 rounded-lg w-full outline-none"
        required={required}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  id,
  options = [],
  placeholder,
  required = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-500 text-xs" htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border px-4 py-2 rounded-lg w-full outline-none"
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((item) => (
          <option value={item?.id} key={item?.id}>
            {item?.name}
          </option>
        ))}
      </select>
    </div>
  );
}
