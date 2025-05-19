'use client';

import {algoliasearch} from 'algoliasearch';
import {
  InstantSearch,
  useHits,
  useSearchBox,
} from 'react-instantsearch-hooks-web';

const searchClient = algoliasearch('HVES6SJZRY', 'dd244b365fefe5081cae61ff48a5a12c');

import { ProductCard } from '@/app/components/Products';

function CustomSearchBox() {
  const { query, refine } = useSearchBox(); 
  return (
    <input
      type="search"
      value={query}
      onChange={(e) => refine(e.currentTarget.value)}
      placeholder="Search products..."
      className="w-full max-w-xl px-4 py-2 border rounded mb-6"
    />
  );
}

function CustomHits() {
  const { hits } = useHits();

  if (!hits.length) {
    return <p className="text-center text-gray-500">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {hits.map((product) => (
        <ProductCard key={product.objectID} product={product} />
      ))}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="max-w-7xl mx-auto p-6">
      <InstantSearch searchClient={searchClient} indexName="products_rows">
        <CustomSearchBox />
        <CustomHits />
      </InstantSearch>
    </main>
  );
}
