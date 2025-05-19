'use client';

import { useUser } from '@clerk/nextjs'; // ✅ Clerk hook
import { useOrders } from '@/lib/data';

export default function Page() {
  const { user, isLoaded } = useUser(); // ✅ Clerk hook

  const { data: orders, isLoading } = useOrders({ id: user?.id });

  if (!isLoaded || isLoading) {
    return <div className="p-5">Loading orders...</div>;
  }

  return (
    <main className="flex flex-col gap-4 p-5">
      <h1 className="text-2xl font-semibold">My Orders</h1>

      {(!orders || orders?.length === 0) && (
        <div className="flex flex-col items-center justify-center gap-3 py-11">
          <div className="flex justify-center">
            <img className="h-44" src="/svgs/Empty-pana.svg" alt="" />
          </div>
          <h1>You have no orders</h1>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {orders?.map((item, orderIndex) => {
          const totalAmount = item?.products?.reduce((prev, curr) => {
            const product = curr?.product?.[0];
            return prev + ((product?.price || 0) * curr?.quantity);
          }, 0);

          return (
            <div
              key={item.id || orderIndex}
              className="flex flex-col gap-2 border rounded-lg p-4"
            >
              <div className="flex flex-col gap-2">
                <div className="flex gap-3">
                  <h3>{orderIndex + 1}</h3>
                  <h3 className="bg-blue-100 text-blue-500 text-xs rounded-lg px-2 py-1 uppercase">
                    {item?.payment_mode}
                  </h3>
                  <h3 className="bg-green-100 text-green-500 text-xs rounded-lg px-2 py-1 uppercase">
                    {item?.status ?? 'pending'}
                  </h3>
                  <h3 className="text-green-600">₹ {totalAmount}</h3>
                </div>
                <h4 className="text-gray-600 text-xs">
                  {new Date(item?.created_at).toString()}
                </h4>
              </div>

              <div>
                {item?.products?.map((productItem, i) => {
                  const product = productItem?.product?.[0];
                  return (
                    <div key={i} className="flex gap-2 items-center">
                      <img
                        className="h-10 w-10 rounded-lg"
                        src={product?.productImage}
                        alt="Product Image"
                      />
                      <div>
                        <h1>{product?.name}</h1>
                        <h1 className="text-gray-500 text-xs">
                          ₹ {product?.price} <span>X</span>{' '}
                          <span>{productItem?.quantity}</span>
                        </h1>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
