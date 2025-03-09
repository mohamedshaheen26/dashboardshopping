import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Loading from "../components/Loading";

const API_BASE_URL = "https://nshopping.runasp.net/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    id: null,
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryId: "",
    imageFile: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Product`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Category/AllCategories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSaveProduct = async () => {
    if (!token) {
      alert("Unauthorized! Please log in again.");
      return;
    }

    if (
      !product.name ||
      !product.price ||
      !product.stock ||
      !product.categoryId
    ) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("Name", product.name);
    formData.append("Description", product.description);
    formData.append("Price", product.price);
    formData.append("Stock", product.stock);
    formData.append("CategoryId", product.categoryId);
    if (product.imageFile) {
      formData.append("imageFile", product.imageFile);
    }

    try {
      const method = product.id ? "PUT" : "POST";
      const url = product.id
        ? `${API_BASE_URL}/Product/${product.id}`
        : `${API_BASE_URL}/Product`;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`, // Ensure correct auth
        },
        body: formData,
      });

      if (response.status === 403) {
        alert("Access denied! You don’t have permission.");
        return;
      }

      if (!response.ok) throw new Error("Failed to save product");

      fetchProducts();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await fetch(`${API_BASE_URL}/Product/${productId}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const openModal = (productData = {}) => {
    setProduct({
      id: productData.id || null,
      name: productData.name || "",
      price: productData.price || "",
      stock: productData.stock || "",
      description: productData.description || "",
      categoryId: productData.categoryId || "",
      imageFile: null, // Reset file input
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setProduct({
      id: null,
      name: "",
      price: "",
      stock: "",
      description: "",
      categoryId: "",
      imageFile: null,
    });
  };

  return (
    <div className='main-container products'>
      <div className='main-title'>
        <h3>Products</h3>
      </div>
      <button className='btn btn-success mb-3' onClick={() => openModal()}>
        Add
      </button>
      <div className='table-responsive'>
        <table className='table'>
          <thead>
            <tr>
              <th>#</th>
              <th className='w-50'>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan='5' className='text-center'>
                  <Loading />
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((prod, index) => (
                <tr key={prod.id}>
                  <td>{index + 1}</td>
                  <td>{prod.name}</td>
                  <td>{prod.categoryName}</td>
                  <td>{prod.price}</td>
                  <td>
                    <button
                      className='btn btn-primary btn-sm me-2'
                      onClick={() => openModal(prod)}
                    >
                      Edit
                    </button>
                    <button
                      className='btn btn-danger btn-sm'
                      onClick={() => deleteProduct(prod.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='5' className='text-center'>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={product.id ? "Edit Product" : "Add Product"}
        onConfirm={handleSaveProduct}
        confirmText={loading ? "Saving..." : "Save"}
        closeText='Cancel'
      >
        <form>
          <div className='row'>
            <div className='col-md-12 mb-2'>
              <label className='form-label'>Product Name</label>
              <input
                type='text'
                className='form-control'
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
              />
            </div>
            <div className='col-md-12 mb-2'>
              <label className='form-label'>Description</label>
              <textarea
                className='form-control'
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              ></textarea>
            </div>
            <div className='col-md-6 mb-2'>
              <label className='form-label'>Price</label>
              <input
                type='number'
                className='form-control'
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
            </div>
            <div className='col-md-6 mb-2'>
              <label className='form-label'>Stock</label>
              <input
                type='number'
                className='form-control'
                value={product.stock}
                onChange={(e) =>
                  setProduct({ ...product, stock: e.target.value })
                }
              />
            </div>
            <div className='col-md-12 mb-2'>
              <label className='form-label'>Category</label>
              <select
                className='form-control'
                value={product.categoryId}
                onChange={(e) =>
                  setProduct({ ...product, categoryId: e.target.value })
                }
              >
                <option value=''>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-12 mb-2'>
              <label className='form-label'>Product Image</label>
              <input
                type='file'
                className='form-control'
                onChange={(e) =>
                  setProduct({ ...product, imageFile: e.target.files[0] })
                }
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
