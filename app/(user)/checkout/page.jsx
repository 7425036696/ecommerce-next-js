'use client';

import { useUser } from '@clerk/nextjs';
import { getProduct } from '@/lib/server';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Checkout from './components/Checkout';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Page() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const productId = searchParams.get('productId');

  const supabase = createClientComponentClient();

  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        let finalProductList = [];

        if (type === 'buynow' && productId) {
          const product = await getProduct({ id: productId });
          finalProductList = [
            {
              id: productId,
              quantity: 1,
              product,
            },
          ];
        } else if (type === 'cart' && user) {
          const { data: cartItems, error: cartError } = await supabase
            .from('cart')
            .select('*')
            .eq('user_id', user.id);

          if (cartError) {
            throw new Error(cartError.message);
          }

          const products = await Promise.all(
            cartItems.map(async (item) => {
              const product = await getProduct({ id: item.product_id });
              return {
                id: item.product_id,
                quantity: item.quantity,
                product,
              };
            })
          );

          finalProductList = products;
        }

        setProductList(finalProductList);
      } catch (err) {
        console.error(err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      fetchProducts();
    }
  }, [type, productId, user, isLoaded]);

  if (!isLoaded || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!productList || productList.length === 0) {
    return (
      <div>
        <h1>Products Not Found</h1>
      </div>
    );
  }

  return (
    <main className="p-5 flex flex-col gap-4">
      <h1 className="text-xl">Checkout</h1>
      <Checkout productList={productList} />
    </main>
  );
}
