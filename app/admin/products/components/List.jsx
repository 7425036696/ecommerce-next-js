"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase"; // Import Supabase client
import { Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [lastSnapDocList, setLastSnapDocList] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLastSnapDocList([]);
    fetchData();
  }, [pageLimit]);

  // Fetch product data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const offset = lastSnapDocList.length * pageLimit;
      const from = offset;
      const to = offset + pageLimit - 1;
  
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .range(from, to);
  
      if (error) throw error;
  
      setProducts(data); // Set the product data
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleNextPage = () => {
    setLastSnapDocList([...lastSnapDocList, pageLimit]);
    fetchData();
  };

  const handlePrePage = () => {
    setLastSnapDocList(lastSnapDocList.slice(0, -1));
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;

      toast.success("Successfully Deleted");
      fetchData(); // Re-fetch data after delete
    } catch (error) {
      toast.error("Error deleting product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (id) => {
    router.push(`/admin/products/form?id=${id}`);
  };

  return (
    <div className="flex-1 flex flex-col gap-3 md:px-5 px-3 rounded-xl w-full overflow-x-auto">
      <table className="w-full table-auto border-separate border-spacing-y-3">
        <thead>
          <tr>
            <th className="font-semibold border-y bg-white px-3 py-2 border-l rounded-l-lg">SN</th>
            <th className="font-semibold border-y bg-white px-3 py-2">Image</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Title</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Price</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Stock</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Orders</th>
            <th className="font-semibold border-y bg-white px-3 py-2 text-left">Status</th>
            <th className="font-semibold border-y bg-white px-3 py-2 border-r rounded-r-lg text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} className="text-center py-3">
                <div className="text-xl">Loading...</div>
              </td>
            </tr>
          ) : (
            products?.map((item, index) => (
              <Row key={item.id} index={index + lastSnapDocList.length * pageLimit} item={item} handleDelete={handleDelete} handleUpdate={handleUpdate} />
            ))
          )}
        </tbody>
      </table>
      <div className="flex justify-between text-sm py-3">
        <button
          disabled={isLoading || lastSnapDocList.length === 0}
          onClick={handlePrePage}
          className="btn btn-sm btn-bordered"
        >
          Previous
        </button>
        <select
          value={pageLimit}
          onChange={(e) => setPageLimit(Number(e.target.value))}
          className="px-5 rounded-xl"
        >
          <option value={3}>3 Items</option>
          <option value={5}>5 Items</option>
          <option value={10}>10 Items</option>
          <option value={20}>20 Items</option>
          <option value={100}>100 Items</option>
        </select>
        <button
          disabled={isLoading || products.length === 0}
          onClick={handleNextPage}
          className="btn btn-sm btn-bordered"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Row({ item, index, handleDelete, handleUpdate }) {
  return (
    <tr>
      <td className="border-y bg-white px-3 py-2 border-l rounded-l-lg text-center">{index + 1}</td>
      <td className="border-y bg-white px-3 py-2 text-center">
        <img className="h-10 w-10 object-cover" src={item.productImage} alt="" />
      </td>
      <td className="border-y bg-white px-3 py-2">{item.title} {item.isFeatured == true && (
    <span className="text-xs px-2 ml-2 py-1 rounded bg-yellow-100 text-yellow-800 border border-yellow-300">
      Featured
    </span>
  )}</td>
      <td className="border-y bg-white px-3 py-2">
        {item.salePrice < item.price && <span className="line-through text-gray-500">₹ {item.price}</span>} ₹ {item.salePrice}
      </td>
      <td className="border-y bg-white px-3 py-2">{item.stock}</td>
      <td className="border-y bg-white px-3 py-2">{item.orders ?? 0}</td>
      <td className="border-y bg-white px-3 py-2">
        <div className="flex">
          {item.stock - (item.orders ?? 0) > 0 ? (
            <span className="text-green-500 bg-green-100 px-2 py-1 rounded-md text-xs">Available</span>
          ) : (
            <span className="text-red-500 bg-red-100 px-2 py-1 rounded-md text-xs">Out Of Stock</span>
          )}
        </div>
      </td>
      <td className="border-y bg-white px-3 py-2 border-r rounded-r-lg">
        <div className="flex gap-2 justify-center">
          <button onClick={() => handleUpdate(item.id)} className="btn btn-sm btn-icon">
            <Edit2 size={13} />
          </button>
          <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-icon btn-danger">
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}
