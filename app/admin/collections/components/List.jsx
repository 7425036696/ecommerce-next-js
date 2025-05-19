'use client';
import { supabase } from '../../../../lib/supabase';
import { Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function List({
  items,
  refreshItems,
  setEditingThing,
  title = 'Collection',
  tableName = 'collections',
}) {
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: `Delete ${title}?`,
      text: 'This action is permanent!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (!error) {
        toast.success(`${title} deleted`);
        refreshItems();
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-3 md:pr-5 md:px-0 px-5 rounded-xl">
      <h1 className="text-xl font-bold">{title}s</h1>

      {/* Responsive Scrollable Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-y-3 w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="bg-white px-3 py-2 rounded-l-lg">SN</th>
              <th className="bg-white px-3 py-2">Image</th>
              <th className="bg-white px-3 py-2">Title</th>
              <th className="bg-white px-3 py-2"># Products</th>
              <th className="bg-white px-3 py-2 rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.id}>
                  <td className="bg-white px-3 py-2 rounded-l-lg text-center">
                    {index + 1}
                  </td>
                  <td className="bg-white px-3 py-2 text-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-10 w-10 object-cover mx-auto rounded"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 mx-auto rounded flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="bg-white px-3 py-2">{item.title}</td>
                  <td className="bg-white px-3 py-2 text-center">
                    {item.productIds?.length ?? 0}
                  </td>
                  <td className="bg-white px-3 py-2 rounded-r-lg text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setEditingThing(item)}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="bg-white px-3 py-2 text-center rounded-lg"
                >
                  No {title.toLowerCase()}s available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
