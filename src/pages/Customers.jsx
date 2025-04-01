import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { API_BASE_URL } from "../config";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Loader state
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

  const DeleteUser = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(
        `${API_BASE_URL}/Users/${userToDelete.id}?confirm=true`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // If authentication is required
            Accept: "*/*",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete user");
      setIsDeleteModalOpen(false);
      fetchCustomers();
      toast.danger(
        `${
          userToDelete.firstName + " " + userToDelete.lastName
        } Category Deleted Successfully`,
        {
          position: "top-left",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          closeButton: false,
        }
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) => customer.email !== "admin@example.com"
  );

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
              filteredCustomers.map((customer, index) => (
                <tr key={customer.id}>
                  <td>{index + 1}</td>
                  <td>{customer.firstName + " " + customer.lastName}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phoneNumber || "N/A"}</td>
                  <td>
                    <button
                      className='btn btn-sm btn-danger'
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setUserToDelete(customer);
                      }}
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
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title='Delete Category'
        onConfirm={DeleteUser}
        confirmText={
          isSaving ? (
            <span className='spinner-border spinner-border-sm'></span>
          ) : (
            "Delete"
          )
        }
        confirmDisabled={isSaving}
        closeText='Cancel'
      >
        {userToDelete ? (
          <>
            <p>
              Are you sure you want to delete{" "}
              {userToDelete.firstName + " " + userToDelete.lastName}?
            </p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default Customers;
