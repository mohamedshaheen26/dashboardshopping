import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

function Home() {
  const [dashboardData, setDashboardData] = useState({
    categories: 0,
    products: 0,
    customers: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const categoriesRes = await fetch(
          `${API_BASE_URL}/Category/AllCategories`
        );
        const productsRes = await fetch(`${API_BASE_URL}/Product`);
        const usersRes = await fetch(`${API_BASE_URL}/Users/All Users`);
        const ordersRes = await fetch(`${API_BASE_URL}/Order`);

        const categories = await categoriesRes.json();
        const products = await productsRes.json();
        const customers = await usersRes.json();
        const orders = await ordersRes.json();

        setDashboardData({
          categories: categories.length,
          products: products.length,
          customers: customers.length,
          orders: orders.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <main className='main-container dashboard'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>

      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>Categories</h3>
          </div>
          <h1>
            {loading ? (
              <span className='spinner-border spinner-border-sm'></span>
            ) : (
              dashboardData.categories
            )}
          </h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>Products</h3>
          </div>
          <h1>
            {loading ? (
              <span className='spinner-border spinner-border-sm'></span>
            ) : (
              dashboardData.products
            )}
          </h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>Customers</h3>
          </div>
          <h1>
            {loading ? (
              <span className='spinner-border spinner-border-sm'></span>
            ) : (
              dashboardData.customers
            )}
          </h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>Orders</h3>
          </div>
          <h1>
            {loading ? (
              <span className='spinner-border spinner-border-sm'></span>
            ) : (
              dashboardData.orders
            )}
          </h1>
        </div>
      </div>
    </main>
  );
}

export default Home;
