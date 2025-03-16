import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import { API_BASE_URL } from "../config";

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
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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
      alert("Failed to fetch products. Please try again.");
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
      alert("Failed to fetch categories. Please try again.");
    }
  };

  const handleAddProduct = async () => {
    if (!token) {
      alert("Unauthorized! Please log in again.");
      return;
    }
    setIsSaving(true);

    if (
      !product.name ||
      !product.price ||
      !product.stock ||
      !product.categoryId
    ) {
      alert("Please fill all fields");
      setIsSaving(false);
      return;
    }

    if (isNaN(product.price) || isNaN(product.stock)) {
      alert("Price and stock must be numbers.");
      setIsSaving(false);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("Name", product.name);
    formData.append("Description", product.description);
    formData.append("Price", parseFloat(product.price)); // Ensure correct type
    formData.append("Stock", parseInt(product.stock)); // Ensure correct type
    formData.append("CategoryId", parseInt(product.categoryId)); // Ensure correct type
    if (product.imageFile instanceof File) {
      formData.append("imageFile", product.imageFile);
    }

    // Debug FormData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/Product`, {
        method: "POST",
        headers: {
          accept: "*/*",
        },
        body: formData,
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (response.status === 403) {
        alert("Access denied! You don’t have permission.");
        return;
      }

      if (!response.ok) {
        let errorResponse = await response.text();
        console.error("Server error response:", errorResponse);
        alert(`Error: ${errorResponse}`);
        throw new Error("Failed to add product");
      }

      fetchProducts(); // Refresh product list
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    } finally {
      setLoading(false);
      setIsSaving(false);
    }
  };

  const handleUpdateProduct = async () => {
    if (!token) {
      alert("Unauthorized! Please log in again.");
      return;
    }
    setIsSaving(true);

    // Validate required fields
    if (
      !product.name ||
      !product.price ||
      !product.stock ||
      !product.categoryId
    ) {
      alert("Please fill all fields");
      setIsSaving(false);
      return;
    }

    setLoading(true);

    // ✅ API expects JSON, not FormData
    const productData = {
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: Number(product.stock),
      imageUrl: product.imageUrl, // Use imageUrl instead of file
      categoryId: Number(product.categoryId),
    };
    console.log(productData);

    try {
      const response = await fetch(`${API_BASE_URL}/Product/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // ✅ Ensure JSON is sent
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData), // ✅ Send JSON instead of FormData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Response:", errorText);
        throw new Error("Failed to update product");
      }

      fetchProducts(); // Refresh list
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product. Please try again.");
    } finally {
      setLoading(false);
      setIsSaving(false);
    }
  };

  const handleSaveProduct = async () => {
    if (product.id) {
      await handleUpdateProduct(); // Update existing product
    } else {
      await handleAddProduct(); // Add new product
    }
  };

  const deleteProduct = async (productId) => {
    if (!token) {
      alert("Unauthorized! Please log in again.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(`${API_BASE_URL}/Product/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        alert(
          "Access denied! You don’t have permission to delete this product."
        );
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      fetchProducts();
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again.");
    } finally {
      setIsSaving(false);
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
      imageFile: null,
    });
    setImagePreview(productData.imageUrl || null);
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
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }

      setProduct({ ...product, imageFile: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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
                      onClick={() => {
                        setProductToDelete(prod);
                        setIsDeleteModalOpen(true);
                      }}
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
        onConfirm={handleSaveProduct} // Call handleSaveProduct
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
            {imagePreview && (
              <div className='col-lg-4'>
                <img
                  src={imagePreview}
                  alt='Product Preview'
                  className='img-fluid'
                  style={{ maxWidth: "200px", maxHeight: "200px" }}
                />
              </div>
            )}
            <div className={`col-lg-${imagePreview ? "8" : "12"}`}>
              <div className='row'>
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
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title='Delete Product'
        confirmColor='danger'
        onConfirm={() => deleteProduct(productToDelete.id)}
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
        {productToDelete ? (
          <>
            <p>Are you sure you want to delete {productToDelete.name}?</p>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default Products;
