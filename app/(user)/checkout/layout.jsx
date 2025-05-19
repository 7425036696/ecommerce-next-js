'use client';

import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Layout({ children }) {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const productId = searchParams.get('productId');

  const { user, isLoaded } = useUser();
  const supabase = createClientComponentClient();

  const [cartItems, setCartItems] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (type === 'cart' && user) {
        const { data, error } = await supabase
          .from('cart')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching cart:', error);
          setCartItems([]);
        } else {
          setCartItems(data);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchCart();
  }, [type, user]);

  if (!isLoaded || loading) {
    return <div>Loading...</div>;
  }

  if (type === 'cart' && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-lg font-semibold">Your Cart is Empty</h2>
      </div>
    );
  }

  if (type === 'buynow' && !productId) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-lg font-semibold">Product Not Found!</h2>
      </div>
    );
  }

  return <>{children}</>;
}
