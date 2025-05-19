'use client';

import { useUser } from '@clerk/nextjs'; // ✅ Clerk hook
import { createCheckoutAndGetURL, createCheckoutCODAndGetId } from '@/lib/server';
import confetti from 'canvas-confetti';
import { CheckSquare2Icon, Square } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Checkout({ productList }) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState('prepaid');
  const [address, setAddress] = useState(null);
  const router = useRouter();
  const { user, isLoaded } = useUser(); // ✅ Clerk hook
  
  const handleAddress = (key, value) => {
    setAddress({ ...(address ?? {}), [key]: value });
  };

  const totalPrice = productList?.reduce((prev, curr) => {
    return prev + curr?.quantity * curr?.product[0]?.salePrice;
  }, 0);

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      if (totalPrice <= 0) {
        throw new Error('Price should be greater than 0');
      }
      if (!address?.fullName || !address?.mobile || !address?.addressLine1) {
        throw new Error('Please Fill All Address Details');
      }

      if (!productList || productList?.length === 0) {
        throw new Error('Product List Is Empty');
      }

      if (paymentMode === 'prepaid') {
        const url = await createCheckoutAndGetURL({
          uid: user?.id,
          products: productList,
          address: address,
        });
        router.push(url);
      } else {
        const checkoutId = await createCheckoutCODAndGetId({
          uid: user?.id,
          products: productList,
          address: address,
        });
        router.push(`/checkout-success?order_id=${checkoutId}`);
        toast.success('Successfully Placed!');
        confetti();
      }
    } catch (error) {
      toast.error(error?.message);
    }
    setIsLoading(false);
  };

  if (!isLoaded) {
    return <div>Loading...</div>; // Ensure user data is loaded before rendering
  }

  return (
    <section className="flex flex-col md:flex-row gap-3">
      <section className="flex-1 flex flex-col gap-4 border rounded-xl p-4">
        <h1 className="text-xl">Shipping Address</h1>
        <div className="flex flex-col gap-2">
          {/* Address Fields */}
          {['fullName', 'mobile', 'email', 'addressLine1', 'addressLine2', 'pincode', 'city', 'state'].map((field) => (
            <input
              key={field}
              type={field === 'email' ? 'email' : 'text'}
              id={field}
              name={field}
              placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1')}`}
              value={address?.[field] ?? ''}
              onChange={(e) => handleAddress(field, e.target.value)}
              className="border px-4 py-2 rounded-lg w-full focus:outline-none"
            />
          ))}
          <textarea
            id="delivery-notes"
            name="delivery-notes"
            placeholder="Notes about your order, e.g special notes for delivery"
            value={address?.orderNote ?? ''}
            onChange={(e) => handleAddress('orderNote', e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
      </section>
      <div className="flex-1 flex flex-col gap-3">
        <section className="flex flex-col gap-3 border rounded-xl p-4">
          <h1 className="text-xl">Products</h1>
          <div className="flex flex-col gap-2">
            {productList?.map((item, ix) => (
              <div className="flex gap-3 items-center" key={ix}>
                <img
                  className="w-10 h-10 object-cover rounded-lg"
                  src={item?.product[0]?.featureImage}
                  alt=""
                />
                <div className="flex-1 flex flex-col">
                  <h1 className="text-sm">{item?.product[0]?.title}</h1>
                  <h3 className="text-green-600 font-semibold text-[10px]">
                    ₹ {item?.product[0]?.salePrice}{' '}
                    <span className="text-black">X</span>{' '}
                    <span className="text-gray-600">{item?.quantity}</span>
                  </h3>
                </div>
                <div>
                  <h3 className="text-sm">
                    ₹ {item?.product[0]?.salePrice * item?.quantity}
                  </h3>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between w-full items-center p-2 font-semibold">
            <h1>Total</h1>
            <h1>₹ {totalPrice}</h1>
          </div>
        </section>
        <section className="flex flex-col gap-3 border rounded-xl p-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-xl">Payment Mode</h2>
            <div className="flex items-center gap-3">
              {/* Payment Buttons */}
              {['prepaid', 'cod'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className="flex items-center gap-1 text-xs"
                >
                  {paymentMode === mode && (
                    <CheckSquare2Icon className="text-blue-500" size={13} />
                  )}
                  {paymentMode !== mode && <Square size={13} />}
                  {mode === 'prepaid' ? 'Prepaid' : 'Cash On Delivery'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <CheckSquare2Icon className="text-blue-500" size={13} />
            <h4 className="text-xs text-gray-600">
              I agree with the{' '}
              <span className="text-blue-700">terms & conditions</span>
            </h4>
          </div>
          <button
            disabled={isLoading}
            onClick={handlePlaceOrder}
            className="bg-black text-white"
          >
            Place Order
          </button>
        </section>
      </div>
    </section>
  );
}
