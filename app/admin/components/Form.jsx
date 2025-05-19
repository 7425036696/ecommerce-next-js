'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

export default function Form({
  editingThing,
  onSave,
  onCancel,
  tableName = 'brands',
  title = 'Brand',
  showSlug = false,
  showEmail = false, // New prop for admins
}) {
  const isEdit = Boolean(editingThing);
  const [name, setName] = useState(editingThing?.name || '');
  const [slug, setSlug] = useState(editingThing?.slug || '');
  const [email, setEmail] = useState(editingThing?.email || ''); // For admins
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editingThing?.image || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(editingThing?.name || '');
    setSlug(editingThing?.slug || '');
    setEmail(editingThing?.email || '');
    setImagePreview(editingThing?.image || null);
    setImageFile(null);
  }, [editingThing]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const uploadImage = async () => {
    if (!imageFile) return editingThing?.image;

    const ext = imageFile.name.split('.').pop();
    const fileName = `${name}-${Date.now()}.${ext}`;
    const filePath = fileName;

    const { error } = await supabase.storage.from('images').upload(filePath, imageFile, { upsert: true });
    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || (showEmail && !email) || (!imageFile && !isEdit)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadImage();
      const payload = { name, image: imageUrl };
      if (showSlug) payload.slug = slug;
      if (showEmail) payload.email = email;

      let error;
      if (isEdit) {
        ({ error } = await supabase.from(tableName).update(payload).eq('id', editingThing.id));
      } else {
        ({ error } = await supabase.from(tableName).insert([payload]));
      }

      if (error) throw new Error(error.message);

      toast.success(`${title} ${isEdit ? 'updated' : 'created'}!`);
      setName('');
      setSlug('');
      setEmail('');
      setImageFile(null);
      setImagePreview(null);
      onSave();
      if (isEdit) onCancel();
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 bg-white rounded-xl p-5 w-full md:w-[400px]">
      <h1 className="font-semibold">{isEdit ? 'Update' : 'Create'} {title}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Image Preview */}
        {imagePreview && (
          <div className="flex justify-center">
            <img src={imagePreview} alt="Image Preview" className="h-24 w-24 object-contain" />
          </div>
        )}

        {/* Image Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="image" className="text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border px-3 py-2 rounded-lg"
            required={!isEdit}
          />
        </div>

        {/* Name Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            {title} Name
          </label>
          <input
            id="name"
            type="text"
            placeholder={`${title} Name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-4 py-2 rounded-lg w-full"
            required
          />
        </div>

        {/* Email Input (for Admins) */}
        {showEmail && (
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-4 py-2 rounded-lg w-full"
              required
            />
          </div>
        )}

        {/* Slug Input (for Categories/Brands) */}
        {showSlug && (
          <div className="flex flex-col gap-2">
            <label htmlFor="slug" className="text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              id="slug"
              type="text"
              placeholder="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="border px-4 py-2 rounded-lg w-full"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white w-full ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Please wait...' : isEdit ? 'Update' : 'Create'}
        </button>

        {/* Cancel Button */}
        {isEdit && (
          <button onClick={onCancel} className="text-sm text-red-500 mt-3">
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}