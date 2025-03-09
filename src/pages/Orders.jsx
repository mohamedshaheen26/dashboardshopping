import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { API_BASE_URL } from "../config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      // 1️⃣ Fetch All Users (Assuming there's an endpoint for this)
      const usersResponse = await fetch(`${API_BASE_URL}/Users/All Users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!usersResponse.ok) throw new Error("Failed to fetch users");
      const users = await usersResponse.json();

      // 2️⃣ Fetch Orders for Each User
      let allOrders = [];

      for (const user of users) {
        const ordersResponse = await fetch(
          `${API_BASE_URL}/Order/User/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (ordersResponse.ok) {
          const userOrders = await ordersResponse.json();
          allOrders = [
            ...allOrders,
            ...userOrders.map((order) => ({
              ...order,
              userName: user.firstName + " " + user.lastName,
            })),
          ];
        }
      }

      // 3️⃣ Set Orders
      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='main-container orders'>
      <div className='main-title'>
        <h3>Orders</h3>
      </div>

      <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Order ID</th>
              <th>Total Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className='text-center'>
                  <Loading />
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.userName}</td>
                  <td>{order.id}</td>
                  <td>${order.totalAmount}</td>
                  <td>{order.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6' className='text-center'>
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
