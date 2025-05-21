import { supabase } from "./supabase";

const getFeaturedProducts = async () => {
    const { data, error } = await supabase
      .from("products") 
      .select("*")
      .eq("isFeatured", true);
  
    if (error) throw error;
    return data;
  };
  const getProduct = async (id) =>{
    console.log( id, 'id roing')
    let { data, error } = await supabase
    .from('products')
    .select('*') // Selecting the 'id' column
    .eq('id', Number(id.id))
  console.log(data, 'da')
  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  
  return data;
  
  }
  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    return data;
  };
  
  // Fetch brands
  const fetchBrands = async () => {
    const { data, error } = await supabase.from('brands').select('*');
    if (error) throw error;
    return data;
  };
  const fetchCollections = async () => {
    const { data, error } = await supabase.from('collections').select('*');
    if (error) throw error;
    return data;
  };
  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
  };
  
  
  const getProductsByCategory = async ({ categoryId, page = 1, limit = 8 }) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('categoryId', Number(categoryId))
      .range(from, to);
    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  
    return products;
  };
  const getCategoryById = async (id) =>{
    console.log('caid', id.id)
    let { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', Number(id.id))
  if(error){
    console.log(error)
  }
  return categories
  }
  const getBrandById = async (id) =>{
    let { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', Number(id.id))
  if(error){
    console.log(error)
  }
  return brands
  }
  const getCollectionById = async (id) =>{
    let { data: brands, error } = await supabase
    .from('collections')
    .select('*')
    .eq('id', Number(id.id))
  if(error){
    console.log(error)
  }
  return brands
  }

// utils/stripe.js
import Stripe from 'stripe';
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

 // utils/stripe.js


 
 
// Utility function to create a Stripe checkout session
async function createStripeCheckout(products, orderId) {
  const lineItems = products.map((item) => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: item.product[0].title,
      },
      unit_amount: item.product[0].salePrice * 100, // Amount in cents
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${'http://localhost:3000'}/checkout-success?order_id=${orderId}`,
    cancel_url: `http://localhost:3000/checkout-failed?order_id=${orderId}`,
    metadata: {
      orderId: orderId,
    },
  });

  return session;
}

// Create Checkout URL for Prepaid orders
async function createCheckoutAndGetURL({ uid, products, address }) {
  // Insert the order into Supabase to generate the order ID
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: uid,
      address,
      payment_mode: 'prepaid',
      products,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw new Error(error.message); // Handle error inserting the order

  const orderId = order.id; // Get the generated order ID

  // Create the Stripe checkout session
  const session = await createStripeCheckout(products, orderId);
  
  // Update the Supabase order with Stripe session info
  await supabase
    .from('orders')
    .update({
      stripe_session_id: session.id,
      stripe_url: session.url,
    })
    .eq('id', orderId);

  return session.url; // Return the Stripe session URL
}

// Create COD Checkout and Return Order ID
async function createCheckoutCODAndGetId({ uid, products, address }) {
  // Insert the order into Supabase to generate the order ID
  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: uid,
      address,
      payment_mode: 'cod',
      products,
      status: 'placed',
    })
    .select()
    .single();

  if (error) throw new Error(error.message); // Handle error inserting the order

  return data.id; // Return the generated order ID
}

const fetchOrders = async ({id}) =>{
  console.log(id, 'fetid')
  const { data, error } = await supabase
  .from("orders") 
  .select("*")
  .eq("user_id", id );
console.log('dta', data)
if (error) throw error;
return data;
}
const getOrder = async ({id}) => {
  console.log(id, 'fgetlk')
  const { data, error } = await supabase
  .from("orders") 
  .select("*")
  .eq("id", Number(id) );
console.log('dta', data)
if (error) throw error;
return data;
}
 
 async function updateOrderStatus({ id, status }) {
  if (!id || !status) {
    throw new Error("Order ID and status are required.");
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
import axios from "axios";

 async function useUsers() {
  try {
    const res = await axios.get("https://api.clerk.dev/v1/users", {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    return {
      data: res.data,
      isLoading: false,
      error: null,
    };
  } catch (err) {
    return {
      data: [],
      isLoading: false,
      error: "Failed to fetch users",
    };
  }
}
 async function deleteReview({ uid, productId }) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .match({ uid, productId });

  if (error) {
    throw new Error(error.message);
  }
}
async function getProductRating(productId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId)

  if (error) {
    console.error('Error fetching reviews:', error)
    return { average: 0, count: 0 }
  }

  const ratings = data.map((r) => r.rating)
  const count = ratings.length
  const average = count === 0 ? 0 : ratings.reduce((a, b) => a + b, 0) / count

  return { average, count }
}

export {
  getBrandById,
  deleteReview,
  useUsers,
  getFeaturedProducts,
  createCheckoutAndGetURL,
  getProduct,
  createCheckoutCODAndGetId,
  getCollectionById,
  getCategoryById,
  fetchOrders,
  fetchBrands,
  getProductsByCategory,
  fetchCategories,
  getProductRating,
  getOrder,
  fetchCollections,
  fetchProducts,
  updateOrderStatus
};
