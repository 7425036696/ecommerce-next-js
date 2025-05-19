'use client'
import { useUser } from "@clerk/nextjs";
import { useState,useEffect } from "react";
import Link from "next/link";
import { useOrders } from "@/lib/data";
export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  
  const { user, isLoaded } = useUser();  // Use Clerk's hook here
  
  useEffect(() => {
    setLastSnapDocList([]);
  }, [pageLimit]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }


  const { data: orders, isLoading, error } = useOrders({
    id: user.id
  });

  const handleNextPage = () => {
    let newStack = [...lastSnapDocList];
    newStack.push(orders?.length > 0 ? orders[orders.length - 1] : null);  // Adjust to your last document logic
    setLastSnapDocList(newStack);
  };

  const handlePrePage = () => {
    let newStack = [...lastSnapDocList];
    newStack.pop();
    setLastSnapDocList(newStack);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or replace this with your own spinner or loading component
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl w-full overflow-x-auto">
      <table className="border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">
              SN
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Customer
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Total Price
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Total Products
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Payment Mode
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">
              Status
            </th>
            <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((item, index) => (
            <Row index={index + lastSnapDocList?.length * pageLimit} item={item} key={item?.id} />
          ))}
        </tbody>
      </table>
      <div className="flex justify-between text-sm py-3">
        <button
          disabled={isLoading || lastSnapDocList?.length === 0}
          onClick={handlePrePage}
          className="px-4 py-2 rounded-lg bg-gray-300"
        >
          Previous
        </button>
        <select
          value={pageLimit}
          onChange={(e) => setPageLimit(Number(e.target.value))}
          className="px-5 rounded-xl"
          name="perpage"
          id="perpage"
        >
          <option value={3}>3 Items</option>
          <option value={5}>5 Items</option>
          <option value={10}>10 Items</option>
          <option value={20}>20 Items</option>
          <option value={100}>100 Items</option>
        </select>
        <button
          disabled={isLoading || orders?.length === 0}
          onClick={handleNextPage}
          className="px-4 py-2 rounded-lg bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}


function Row({ item, index }) {
  const totalAmount = item?.products?.reduce((sum, p) => {
    const price = p?.product?.[0]?.price ?? 0;
    const quantity = p?.quantity ?? 1;
    return sum + price * quantity;
  }, 0);

  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">
        {index + 1}
      </td>
      <td className="border-y bg-white px-3 py-2 whitespace-nowrap">
        <div className="flex flex-col">
          <h1>{item?.address?.email}</h1>
          <h1 className="text-xs text-gray-600">{item?.address?.mobile}</h1>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 whitespace-nowrap">
        ₹ {totalAmount.toFixed(2)}
      </td>
      <td className="border-y bg-white px-3 py-2">
        {item?.products?.length}
      </td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex">
          <h3 className="bg-blue-100 text-blue-500 text-xs rounded-lg px-2 py-1 uppercase">
            {item?.payment_mode}
          </h3>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex">
          <h3 className="bg-green-100 text-green-500 text-xs rounded-lg px-2 py-1 uppercase">
            {item?.status ?? "pending"}
          </h3>
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <div className="flex">
          <Link href={`/admin/orders/${item?.id}`}>
            <button className="bg-black text-white px-3 py-2 rounded-lg text-xs">
              View
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );
}


