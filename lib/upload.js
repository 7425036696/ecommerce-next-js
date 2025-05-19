import { supabase } from "./supabase";

const upload = async () => {
  // Step 1: Delete all existing categories
   // 1. Delete ALL categories (no filter)
//    const { error: deleteError } = await supabase.from("collections").delete().gt("id", 0);
//    if (deleteError) {
//      console.error   ("❌ Delete error:", JSON.stringify(deleteError, null, 2));
//      return;
//    }
//   // Step 2: Insert new categories
//   const { data, error } = await supabase.from("categories").insert([
//     {
//       name: "Electronics",
//       slug: "electronics",
//       image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
//     },
//     {
//       name: "Fashion",
//       slug: "fashion",
//       image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
//     },
//     {
//       name: "Home & Kitchen",
//       slug: "home-kitchen",
//       image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
//     },
//     {
//       name: "Beauty",
//       slug: "beauty",
//       image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080&auto=format&fit=crop"
//     },
//     {
//       name: "Sports & Outdoors",
//       slug: "sports-outdoors",
//       image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2070&auto=format&fit=crop"
//     },
//     {
//       name: "Books",
//       slug: "books",
//       image: "https://images.unsplash.com/photo-1509266272358-7701da638078?q=80&w=2086&auto=format&fit=crop"
//     },
//     {
//       name: "Toys & Games",
//       slug: "toys-games",
//       image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
//     },
//     {
//       name: "Health & Wellness",
//       slug: "health-wellness",
//       image: "https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?q=80&w=2087&auto=format&fit=crop"
//     },
//     {
//       name: "Jewelry",
//       slug: "jewelry",
//       image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=2080&auto=format&fit=crop"
//     },
//     {
//       name: "Automotive",
//       slug: "automotive",
//       image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
//     }
//   ]);

//   if (error) {
//     console.error("Failed to insert categories:", error.message);
//     return;
//   }

//   console.log("Categories uploaded successfully:", data);
//   return data;
};

// Call the function (optional)
upload();

export default upload;
