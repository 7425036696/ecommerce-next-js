'use client';
import { useState, useEffect } from 'react';
import Form from '../components/Form';
import List from '../components/List';
import { useCategoriesAndBrands } from '../../../lib/data';
import { fetchBrands } from '@/lib/server';

export default function BrandsPage() {
  const [editingBrand, setEditingBrand] = useState(null);
  const { brands, loading, error, fetchCategories } = useCategoriesAndBrands(); // Fetch both categories and brands

  return (
    <div className="p-5 flex flex-col md:flex-row gap-5">
      {/* Form for Editing/Adding Brand */}
      <Form
        editingThing={editingBrand}
        onSave={fetchBrands}  // Refreshes brands after saving
        onCancel={() => setEditingBrand(null)}
        tableName="brands"
        title="Brand"
        showSlug={false}
      />

      {/* List to Display Brands */}
      <List
        items={brands}
        refreshItems={fetchBrands}  // Refresh brands when required
        setEditingThing={setEditingBrand}
        tableName="brands"
        title="Brand"
        showSlug={false}
      />

      {/* Loading and Error States */}
      {loading && <div>Loading brands...</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}
