import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash } from "react-bootstrap-icons";
import { Modal, Button, Form, Table, Container } from "react-bootstrap";
import { getAllCategories,deletecategory } from "../../services/apiService";

const CategoryList = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL; // Image Base URL
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showemptydata, setshowemptydata] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
          const response = await getAllCategories(); // Using API service
          if (response.success) {
              setCategories(response.data); // ✅ Sets array if successful
          } else {
              console.error("Failed to fetch categories:", response.error);
          }
      } catch (err) {
          console.error("Error fetching categories:", err);
      }
  };

    fetchCategories();
  }, [API_URL, token]);

  const handleDelete = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedCategoryId) {
      try {
          const response = await deletecategory(selectedCategoryId);
          if (response.success) {
            setCategories(categories.filter((category) => category.id !== selectedCategoryId));
            setShowDeleteModal(false);
          } else {
            setError(response.message);
          }
      } catch (err) {
        setError("Failed to delete category. Please try again.");
      }
    }
  };

  const handleUpdate = (category) => {
    setSelectedCategory(category);
    setPreviewImage(category.category_logo ? `${IMAGE_BASE_URL}${category.category_logo}` : "");
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedCategory(null);
    setPreviewImage("");
  };

  const handleSave = async () => {
    try {
      if (token && selectedCategory) {
        const config = { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", 
          }
        };
  
        const formData = new FormData();
        formData.append("id", selectedCategory.id);
        formData.append("name", selectedCategory.name);
        formData.append("description", selectedCategory.description);
        formData.append("status", selectedCategory.status);
  
        if (selectedCategory.category_logo instanceof File) {
          formData.append("category_logo", selectedCategory.category_logo); // New image
        } else if (selectedCategory.category_logo) {
          formData.append("existing_category_logo", selectedCategory.category_logo); // Retain existing image
        }
  
        // API call
        const response = await axios.put(`${API_URL}/categories`, formData, config);
        console.log("Update Response:", response.data.category); // Debugging log
  
        if (response.data && response.data.category) {
          setCategories((prevCategories) =>
            prevCategories.map((cat) =>
              cat.id === selectedCategory.id ? response.data.category : cat
            )
          );
        }
  
        setShow(false);
        setSelectedCategory(null);
        setPreviewImage("");
      }
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      setError("Failed to update category.");
    }
  };
  
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setSelectedCategory({ ...selectedCategory, category_logo: file });
    } else {
      // Retain existing image if no new file is selected
      setSelectedCategory({ ...selectedCategory, category_logo: selectedCategory.category_logo });
    }
  };

  return (
    <Container fluid className="mt-4">
        <div className="table-responsive p-2 bg-white">
          {categories.length === 0 ? (
            <p style={{ color: "red", textAlign: "center", fontSize: "15px" }}>
              No Categories Found
            </p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Logo</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category.id || index}>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td>
                      {category.category_logo ? (
                        <img
                          src={`${IMAGE_BASE_URL}${category.category_logo}`}
                          alt="Category Logo"
                          width="50"
                          height="50"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td>{category.status === 1 ? "Active" : "Inactive"}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleUpdate(category)}
                      >
                        <Pencil />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

      {/* Modal for Updating Category */}
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-primary">Update Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCategory && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Category Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedCategory.name}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedCategory.description}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Category Logo</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                {previewImage && (
                  <div className="mt-2">
                    <img src={previewImage} alt="Category Preview" className="img-thumbnail" width="120" />
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Status</Form.Label>
                <Form.Select
                  value={selectedCategory.status}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, status: Number(e.target.value) })}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CategoryList;
