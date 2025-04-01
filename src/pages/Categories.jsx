import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { API_BASE_URL } from "../config";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // Loader state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Category/AllCategories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!categoryName) {
      alert("Please enter a category name");
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Category/Add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) throw new Error("Failed to add category");

      setCategoryName("");
      fetchCategories();
      setIsAddModalOpen(false);
      toast.success(`${categoryName} Category Added Successfully`, {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        closeButton: false,
      });
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCategory = async () => {
    if (!categoryToDelete) return;

    setIsSaving(true);
    try {
      await fetch(`${API_BASE_URL}/Category/${categoryToDelete.id}`, {
        method: "DELETE",
      });

      fetchCategories();
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      toast.success(`${categoryName} Category Deleted Successfully`, {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        closeButton: false,
      });
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const editCategory = async () => {
    if (!categoryToEdit || !categoryName) return;

    setIsSaving(true);
    try {
      await fetch(`${API_BASE_URL}/Category/update/${categoryToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });

      fetchCategories();
      setIsEditModalOpen(false);
      setCategoryToEdit(null);
      setCategoryName("");
      toast.success(`${categoryName} Category Edit Successfully`, {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        closeButton: false,
      });
    } catch (error) {
      console.error("Error editing category:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className='main-container categories'>
      <div className='main-title'>
        <h3>Categories</h3>
      </div>
      <button
        className='btn btn-success mb-3'
        onClick={() => {
          setCategoryName("");
          setIsAddModalOpen(true);
        }}
      >
        Add
      </button>
      <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='3' className='text-center'>
                  <Loading />
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((category, index) => (
                <tr key={category.id}>
                  <td>{index + 1}</td>
                  <td>{category.name}</td>
                  <td>
                    <button
                      className='btn btn-primary btn-sm me-2'
                      onClick={() => {
                        setCategoryToEdit(category);
                        setCategoryName(category.name);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <i className='fas fa-edit'></i> Edit
                    </button>
                    <button
                      className='btn btn-danger btn-sm'
                      onClick={() => {
                        setCategoryToDelete(category);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <i className='fas fa-trash'></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='3' className='text-center'>
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title='Add Category'
        onConfirm={addCategory}
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
        <form>
          <div className='row'>
            <div className='col-md-12 mb-2'>
              <label htmlFor='categoryName' className='form-label'>
                Category Name
              </label>
              <input
                type='text'
                className='form-control'
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title='Edit Category'
        onConfirm={editCategory}
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
        <input
          type='text'
          className='form-control mb-3'
          placeholder='Edit category name'
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </Modal>

      {/* Delete Category Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title='Delete Category'
        confirmColor='danger'
        onConfirm={deleteCategory}
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
        {categoryToDelete ? (
          <>
            <p>Are you sure you want to delete {categoryToDelete.name}?</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default CategoryManager;
