"use client";

import { useOrder } from "@/lib/data";
import ChangeOrderStatus from './components/ChangeStatus'
import { useParams } from "next/navigation";

export default function Page() {
  const { orderId } = useParams();
  const { data, error, isLoading } = useOrder({ id: orderId });
const order = data[0]
console.log(data, 'dafa')
  if (isLoading) {
    return (
      <div className="flex justify-center py-48">
        {/* <CircularProgress /> */} laoding...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error.message}</div>;
  }
  const totalAmount = order?.products?.reduce((sum, item) => {
    const product = item?.product?.[0]; // get first product from array
    return sum + (product?.price || 0) * (item?.quantity || 1);
  }, 0);
  

  const address = order?.address || {};

  return (
    <main className="flex flex-col gap-4 p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <ChangeOrderStatus order={order} />
      </div>

      <div className="flex flex-col gap-2 border rounded-lg p-4 bg-white">
        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <h3 className="bg-blue-100 text-blue-500 text-xs rounded-lg px-2 py-1 uppercase">
              {order?.payment_mode}
            </h3>
            <h3 className="bg-green-100 text-green-500 text-xs rounded-lg px-2 py-1 uppercase">
              {order?.status ?? "pending"}
            </h3>
            <h3 className="text-green-600 font-semibold">
              ₹ {totalAmount?.toLocaleString("en-IN")}
            </h3>
          </div>
          <h4 className="text-gray-600 text-xs">
            {new Date(order?.created_at)?.toLocaleString()}
          </h4>
        </div>

        <div className="flex flex-col gap-3">
          {order?.products?.map((item) => (

            <div key={item.id} className="flex gap-2 items-center border-b py-2">
              <img
                className="h-10 w-10 rounded-lg object-cover"
                src={item?.product[0]?.productImage}
                alt={item?.product[0]?.name}
              />
              <div>
                <h1>{item?.product?.name}</h1>
                <h1 className="text-gray-500 text-xs">
                  ₹ {item?.product[0]?.price} × {item?.quantity}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h1 className="text-2xl font-semibold">Address</h1>
      <div className="flex flex-col gap-2 border rounded-lg p-4 bg-white">
        <table className="text-sm">
          <tbody>
            <tr><td className="pr-4">Full Name</td><td>{address?.fullName}</td></tr>
            <tr><td>Mobile</td><td>{address?.mobile}</td></tr>
            <tr><td>Email</td><td>{address?.email}</td></tr>
            <tr><td>Address Line 1</td><td>{address?.addressLine1}</td></tr>
            <tr><td>Address Line 2</td><td>{address?.addressLine2}</td></tr>
            <tr><td>Pincode</td><td>{address?.pincode}</td></tr>
            <tr><td>City</td><td>{address?.city}</td></tr>
            <tr><td>State</td><td>{address?.state}</td></tr>
            {address?.note && (
  <tr>
    <td>Notes</td>
    <td>{address.note}</td>
  </tr>
)}

          </tbody>
        </table>
      </div>
    </main>
  );
}
