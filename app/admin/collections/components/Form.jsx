'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

export default function Form({
  editingThing,
  onSave,
  onCancel,
  products = [],
}) {
  const isEdit = Boolean(editingThing);
  const [title, setTitle] = useState(editingThing?.title || '');
  const [subTitle, setSubTitle] = useState(editingThing?.subTitle || '');
  const [selectedProducts, setSelectedProducts] = useState(editingThing?.productIds || []);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editingThing?.image || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingThing) {
      setTitle(editingThing.title || '');
      setSubTitle(editingThing.subTitle || '');
      setSelectedProducts(editingThing.productIds || []);
      setImagePreview(editingThing.image || null);
      setImageFile(null);
    }
  }, [editingThing]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const uploadImage = async () => {
    if (!imageFile) return editingThing?.image;

    const ext = imageFile.name.split('.').pop();
    const fileName = `${title}-${Date.now()}.${ext}`;
    const filePath = fileName;

    const { error } = await supabase.storage.from('images').upload(filePath, imageFile, { upsert: true });
    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !subTitle || selectedProducts.length === 0 || (!imageFile && !isEdit)) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadImage();
      const payload = {
        title,
        subTitle,
        image: imageUrl,
        productIds: selectedProducts,
      };

      let error;
      if (isEdit) {
        ({ error } = await supabase.from('collections').update(payload).eq('id', editingThing.id));
      } else {
        ({ error } = await supabase.from('collections').insert([payload]));
      }

      if (error) throw new Error(error.message);

      toast.success(`Collection ${isEdit ? 'updated' : 'created'}!`);
      setTitle('');
      setSubTitle('');
      setSelectedProducts([]);
      setImageFile(null);
      setImagePreview(null);
      onSave();
      if (isEdit) onCancel();
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const addProduct = (id) => {
    const stringId = String(id);
    if (!selectedProducts.includes(stringId)) {
      setSelectedProducts((prev) => [...prev, stringId]);
    }
  };

  const removeProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((pid) => pid !== String(id)));
  };

  return (
    <div className="flex flex-col gap-6 bg-white rounded-xl p-5 w-full md:w-[500px]">
      <h1 className="font-semibold text-lg">{isEdit ? 'Update' : 'Create'} Collection</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {imagePreview && (
          <div className="flex justify-center">
            <img src={imagePreview} alt="Preview" className="h-24 w-24 object-contain" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label>Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="border px-3 py-2 rounded-lg" required={!isEdit} />
        </div>

        <div className="flex flex-col gap-2">
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="border px-4 py-2 rounded-lg" required />
        </div>

        <div className="flex flex-col gap-2">
          <label>Subtitle</label>
          <input type="text" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} className="border px-4 py-2 rounded-lg" required />
        </div>

        <div className="flex flex-col gap-2">
          <label>Select Product</label>
          <select
            className="border px-4 py-2 rounded-lg"
            onChange={(e) => {
              const selectedId = e.target.value;
              if (selectedId) {
                addProduct(selectedId);
                e.target.value = ''; // Reset the dropdown after selection
              }
            }}
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
                disabled={selectedProducts.includes(String(product.id))}
              >
                {product.title}
              </option>
            ))}
          </select>
        </div>

        {selectedProducts.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedProducts.map((productId) => {
              const product = products.find((p) => String(p.id) === String(productId));
              return (
                <div key={productId} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                  <span>{product?.title || 'Unknown Product'}</span>
                  <button type="button" onClick={() => removeProduct(productId)}>
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end gap-4">
          {isEdit && (
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-300 text-black">
              Cancel
            </button>
          )}
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-black text-white">
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
