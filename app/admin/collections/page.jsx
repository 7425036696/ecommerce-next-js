'use client';
import { useEffect, useState } from 'react';
import Form from './components/Form';
import List from './components/List';
import { useProducts } from '../../../lib/data';
import {fetchCollections} from '@/lib/server'

export default function CollectionPage() {
  const [editingCollection, setEditingCollection] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { products } = useProducts();

  const loadCollections = async () => {
    setLoading(true);
    try {
      const data = await fetchCollections();
      setCollections(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  return (
    <div className="p-5 flex flex-col md:flex-row gap-5">
      <Form
        editingThing={editingCollection}
        onSave={loadCollections}
        products={products}
        onCancel={() => setEditingCollection(null)}
      />
      <List
        items={collections}
        refreshItems={loadCollections}
        setEditingThing={setEditingCollection}
      />
      {loading && <div>Loading collections...</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
