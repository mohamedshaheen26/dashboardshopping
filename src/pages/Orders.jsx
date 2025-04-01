import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import Modal from "../components/Modal";

import { API_BASE_URL } from "../config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [editedStatus, setEditedStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const token = localStorage.getItem("token");

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const showAlert = (message, type) => {
    if (typeof message === "object") {
      message = message.message || "An error occurred"; // Extract string message from object
    }
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 3000);
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const ordersResponse = await fetch(`${API_BASE_URL}/order/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!ordersResponse.ok) throw new Error("Failed to fetch orders");
      const orders = await ordersResponse.json();
      setOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    if (!selectedOrderId) return;
    setIsSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/order/${selectedOrderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: editedStatus }),
      });

      // ✅ Update UI immediately
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId
            ? { ...order, status: editedStatus }
            : order
        )
      );
      trackOrderStatus(selectedOrderId);
      setIsEditModalOpen(false); // ✅ Close modal
    } catch (error) {
      console.error("Error updating order status:", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/order/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete order");

      fetchAllOrders();
      showAlert("Order Have Been Cancelled", "danger");
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const trackOrderStatus = async (orderId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/order/track-status?orderId=${orderId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to track order status");

      const status = await response.json();
      showAlert(status, "success");
    } catch (error) {
      console.error("Error tracking order status:", error);
    }
  };

  return (
    <div className='main-container orders'>
      {alertMessage && <Alert message={alertMessage} type={alertType} />}
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
              <th>Actions</th>
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
                  <td>
                    <button
                      className='btn btn-primary btn-sm me-2'
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setEditedStatus(order.status);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <i className='fas fa-edit'></i> Edit
                    </button>
                    <button
                      className='btn btn-danger btn-sm'
                      onClick={() => deleteOrder(order.id)}
                    >
                      <i className='fas fa-ban'></i> Cancel
                    </button>
                  </td>
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

      {/* ✅ Status Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit Order Status'
        onConfirm={updateOrderStatus}
        confirmText={
          isSaving ? (
            <span className='spinner-border spinner-border-sm'></span>
          ) : (
            "Save"
          )
        }
        confirmDisabled={isSaving}
        closeText='Cancel'
      >
        <select
          className='form-control mb-3'
          value={editedStatus}
          onChange={(e) => setEditedStatus(e.target.value)}
        >
          <option value='Pending'>Pending</option>
          <option value='Delivered'>Delivered</option>
          <option value='Shipped'>Shipped</option>
        </select>
      </Modal>
    </div>
  );
};

export default Orders;
