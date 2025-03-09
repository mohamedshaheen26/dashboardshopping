import React, { useEffect, useState } from "react";

function Home() {
  const [dashboardData, setDashboardData] = useState({
    categories: 0,
    products: 0,
    customers: 0,
    orders: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const categoriesRes = await fetch(
          "https://nshopping.runasp.net/api/Category/AllCategories"
        );
        const productsRes = await fetch(
          "https://nshopping.runasp.net/api/Product"
        );
        const usersRes = await fetch(
          "https://nshopping.runasp.net/api/Users/All Users"
        );

        const categories = await categoriesRes.json();
        const products = await productsRes.json();
        const customers = await usersRes.json();

        let orderCount = 0;

        // Fetch orders for each user
        for (const user of customers) {
          const ordersRes = await fetch(
            `https://nshopping.runasp.net/api/Order/User/${user.id}`
          );
          if (ordersRes.ok) {
            const userOrders = await ordersRes.json();
            orderCount += userOrders.length;
          }
        }

        setDashboardData({
          categories: categories.length,
          products: products.length,
          customers: customers.length,
          orders: orderCount,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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
          <h1>{dashboardData.categories}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>Products</h3>
          </div>
          <h1>{dashboardData.products}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>Customers</h3>
          </div>
          <h1>{dashboardData.customers}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>Orders</h3>
          </div>
          <h1>{dashboardData.orders}</h1>
        </div>
      </div>
    </main>
  );
}

export default Home;
