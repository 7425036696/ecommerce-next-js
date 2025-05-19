// hooks/useCategoriesAndBrands.js
'use client'
import { useState, useEffect } from 'react';
import {supabase} from './supabase';
import { fetchBrands, fetchCategories, fetchCollections, fetchProducts, fetchOrders, getOrder } from './server';
// Fetch categories
const useCategoriesAndBrands = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        const brandsData = await fetchBrands();
        setBrands(brandsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { categories, brands, loading, error,fetchCategories };
};
const useCollections = () => {
  const [collections, setCollections] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchCollections();
        setCollections(data);
              } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { collections, Loading, Error };
};
const useProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
              } catch (err) {
                console.log(err.message); 
      } finally {
        console.log('product is owrking')
      }
    };

    fetchData();
  }, []);

  return { products };
};// hooks/useUser.js


const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch session on mount
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
      } else {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };

    fetchSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};



export const useOrders = ({ id }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await fetchOrders({ id });
        setOrders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data: orders, isLoading: loading };
};

export const useOrder = ({ id }) => {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
console.log('idsjklslf' , id)
  useEffect(() => {
    if (!id) return;


    const fetchData = async () => {
      try {
        const data = await getOrder({ id });
        setOrder(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data: order, isLoading: loading };
};


 function useAllReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setReviews(data);
      setLoading(false);
    };

    fetchReviews();
  }, []);

  return { data: reviews, isLoading: loading };
}
 function useProductCount() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getCount = async () => {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      if (!error) setData(count ?? 0);
    };

    getCount();
  }, []);

  return { data };
}
function useUsersCount() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getCount = async () => {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      if (!error) setData(count ?? 0);
    };

    getCount();
  }, []);

  return { data };
}


function useOrdersCounts() {
  const [data, setData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const getOrders = async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("products");

      if (!error && orders) {
        const totalOrders = orders.length;

        const totalRevenue = orders.reduce((total, order) => {
          const orderRevenue = (order.products || []).reduce((sum, item) => {
            const price = item.product?.[0]?.price ?? 0;
            const quantity = item.quantity ?? 1;
            return sum + price * quantity;
          }, 0);
          return total + orderRevenue;
        }, 0);
        const roundedRevenue = Math.round(totalRevenue * 100) / 100;
        setData({ totalOrders,  totalRevenue: roundedRevenue  });
      }
    };

    getOrders();
  }, []);

  return { data };
}
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

function useOrdersCountsByTotalDays({ dates }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!dates.length) return;

    const fetchCounts = async () => {
      const results = await Promise.all(
        dates.map(async (dateObj) => {
          // get UTC start of day
          const startUTC = new Date(Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate()));
          // get UTC start of next day
          const endUTC = new Date(startUTC);
          endUTC.setUTCDate(startUTC.getUTCDate() + 1);

          const startISO = startUTC.toISOString();
          const endISO = endUTC.toISOString();

          // Debug logs
          console.log(`Querying orders from ${startISO} to ${endISO}`);

          const { data: orders, error } = await supabase
            .from("orders")
            .select("products, created_at")
            .gte("created_at", startISO)
            .lt("created_at", endISO);

          if (error) {
            console.error("Error fetching orders:", error);
            return { date: formatDate(dateObj), totalOrders: 0, totalRevenue: 0 };
          }

          const totalOrders = orders.length;

          const totalRevenue = orders.reduce((total, order) => {
            const orderRevenue = (order.products || []).reduce((sum, item) => {
              const price = item.product?.[0]?.price ?? 0;
              const quantity = item.quantity ?? 1;
              return sum + price * quantity;
            }, 0);
            return total + orderRevenue;
          }, 0);

          return { date: formatDate(dateObj), totalOrders, totalRevenue };
        })
      );

      setData(results.reverse()); // oldest to newest
    };

    fetchCounts();
  }, [dates]);
  return { data };
}

export {
useOrders,
useOrder,
useAllReview,
  useUser,
  useCollections,
  useOrdersCountsByTotalDays,
  useProducts,
  useProductCount,
  useOrdersCounts,
  useUsersCount,
  useCategoriesAndBrands,
};
