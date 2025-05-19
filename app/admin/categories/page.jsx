'use client';
import { useState } from 'react';
import Form from '../components/Form';
import List from '../components/List';
import { useCategoriesAndBrands } from '../../../lib/data';

export default function CategoriesPage() {
  const [editingCategory, setEditingCategory] = useState(null);
  const { categories, brands, loading, error, fetchCategories } = useCategoriesAndBrands();

  return (
    <div className="p-5 flex flex-col md:flex-row gap-5">
      <Form
        editingThing={editingCategory}
        onSave={fetchCategories}  // This will call the function to refresh categories after save
        onCancel={() => setEditingCategory(null)}
        tableName="categories"
        title="Category"
        showSlug={true}
      />
      <List
        items={categories}
        refreshItems={fetchCategories}
        setEditingThing={setEditingCategory}
        tableName="categories"
        title="Category"
        showSlug={true}
      />
      {loading && <div>Loading categories and brands...</div>}
      {error && <div>Error: {error}</div>}
    </div>
  );
}
