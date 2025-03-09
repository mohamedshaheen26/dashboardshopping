import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";

const API_BASE_URL = "https://nshopping.runasp.net/api";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Users/All Users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch customers");

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const DeleteUser = (id) => async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(
        `https://nshopping.runasp.net/api/Users/${id}?confirm=true`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // If authentication is required
            Accept: "*/*",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete user");

      setCustomers(customers.filter((customer) => customer.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className='main-container customers'>
      <div className='main-title'>
        <h3>Customers</h3>
      </div>

      <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
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
            ) : customers.length > 0 ? (
              customers.map((customer, index) => (
                <tr key={customer.id}>
                  <td>{index + 1}</td>
                  <td>{customer.firstName + " " + customer.lastName}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phoneNumber || "N/A"}</td>
                  <td>
                    <button
                      className='btn btn-sm btn-danger'
                      onClick={DeleteUser(customer.id)}
                    >
                      <i className='fas fa-trash me-1'></i>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='5' className='text-center'>
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
