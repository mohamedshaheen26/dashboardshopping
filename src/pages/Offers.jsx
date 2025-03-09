import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import { API_BASE_URL } from "../config";

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [offerToEdit, setOfferToEdit] = useState(null);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Default form state
  const initialFormState = {
    name: "",
    categoryId: "",
    minQuantity: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchOffers();
    fetchCategories();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/Offer`);
      if (!response.ok) throw new Error("Failed to fetch offers");
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
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

  const addOffer = async () => {
    try {
      setIsSaving(true);

      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(), // Ensure proper format
        endDate: new Date(formData.endDate).toISOString(),
      };

      const response = await fetch(`${API_BASE_URL}/offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) throw new Error("Failed to add offer");

      const newOffer = await response.json();
      setOffers([...offers, newOffer]);
      setIsAddModalOpen(false);
      setFormData(initialFormState);
      console.log("New offer added:", newOffer);
    } catch (error) {
      console.error("Error adding offer:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const editOffer = async () => {
    if (!offerToEdit) return;

    try {
      setIsSaving(true);
      const response = await fetch(`${API_BASE_URL}/offer/${offerToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update offer");

      setIsEditModalOpen(false);
      setOfferToEdit(null);
      setFormData(initialFormState);
      await Promise.all([fetchOffers(), fetchCategories()]); // Refetch both offers and categories
    } catch (error) {
      console.error("Error updating offer:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteOffer = async (offerId) => {
    try {
      setIsSaving(true);
      const response = await fetch(`${API_BASE_URL}/offer/${offerId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to delete offer");

      setIsDeleteModalOpen(false);
      await fetchOffers(); // Ensure updated list is displayed
    } catch (error) {
      console.error("Error deleting offer:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };
  return (
    <div className='main-container orders'>
      <div className='main-title'>
        <h3>Offers</h3>
      </div>
      <button
        className='btn btn-success mb-3'
        onClick={() => {
          setIsAddModalOpen(true);
          setFormData(initialFormState); // Reset form when opening modal
        }}
      >
        Add Offer
      </button>

      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Discount %</th>
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
          ) : offers.length > 0 ? (
            offers.map((offer) => (
              <tr key={offer.id}>
                <td>{offer.name}</td>
                <td>{getCategoryName(offer.categoryId)}</td>
                <td>{offer.discountPercentage}%</td>
                <td>
                  <button
                    className='btn btn-primary btn-sm me-2'
                    onClick={() => {
                      setOfferToEdit(offer);
                      setFormData({
                        name: offer.name,
                        categoryId: offer.categoryId,
                        minQuantity: offer.minQuantity,
                        discountPercentage: offer.discountPercentage,
                        startDate: offer.startDate.split("T")[0], // Format date for input field
                        endDate: offer.endDate.split("T")[0],
                      });
                      setIsEditModalOpen(true);
                    }}
                  >
                    <i className='fas fa-edit'></i> Edit
                  </button>

                  <button
                    className='btn btn-danger btn-sm'
                    onClick={() => {
                      setOfferToDelete(offer);
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
              <td colSpan='10' className='text-center'>
                No offers available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Offer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title='Add Offer'
        onConfirm={addOffer}
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
        <form onSubmit={(e) => e.preventDefault()}>
          <div className='row'>
            <div className='col-md-12 mb-2'>
              <label className='form-label'>Offer Name</label>
              <input
                type='text'
                className='form-control'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className='col-md-12 mb-2'>
              <label className='form-label'>Category</label>
              <select
                className='form-control'
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                required
              >
                <option value=''>Select Category</option>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value=''>No categories available</option>
                )}
              </select>
            </div>
            <div className='col-md-6 mb-2'>
              <label className='form-label'>Minimum Quantity</label>
              <input
                type='number'
                className='form-control'
                value={formData.minQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, minQuantity: e.target.value })
                }
                required
              />
            </div>
            <div className='col-md-6 mb-2'>
              <label className='form-label'>Discount Percentage</label>
              <input
                type='number'
                className='form-control'
                value={formData.discountPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountPercentage: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className='col-md-6 mb-2'>
              <label className='form-label'>Start Date</label>
              <input
                type='date'
                className='form-control'
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>
            <div className='col-md-6 mb-2'>
              <label className='form-label'>End Date</label>
              <input
                type='date'
                className='form-control'
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Offer Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setOfferToEdit(null);
        }}
        title='Edit Offer'
        onConfirm={editOffer}
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
        <form onSubmit={(e) => e.preventDefault()}>
          <div className='row'>
            <div className='col-md-12 mb-2'>
              <label className='form-label'>Offer Name</label>
              <input
                type='text'
                className='form-control'
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className='col-md-12 mb-2'>
              <label className='form-label'>Category</label>
              <select
                className='form-control'
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                required
              >
                <option value=''>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='col-md-6 mb-2'>
              <label className='form-label'>Minimum Quantity</label>
              <input
                type='number'
                className='form-control'
                value={formData.minQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, minQuantity: e.target.value })
                }
                required
              />
            </div>
            <div className='col-md-6 mb-2'>
              <label className='form-label'>Discount Percentage</label>
              <input
                type='number'
                className='form-control'
                value={formData.discountPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountPercentage: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className='col-md-6 mb-2'>
              <label className='form-label'>Start Date</label>
              <input
                type='date'
                className='form-control'
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>
            <div className='col-md-6 mb-2'>
              <label className='form-label'>End Date</label>
              <input
                type='date'
                className='form-control'
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Offer Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title='Delete Offer'
        onConfirm={async () => {
          setIsSaving(true);
          await deleteOffer(offerToDelete.id);
          setIsSaving(false);
        }}
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
        {offerToDelete ? (
          <p>Are you sure you want to delete {offerToDelete.name}?</p>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default OffersPage;
