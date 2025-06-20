import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash } from "react-bootstrap-icons";
import { Modal, Button, Form, Table, Container } from "react-bootstrap";
import { getAllCategories,getAllSubCategories } from "../../services/apiService";

const SubcategoryList = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const [showModal, setShowModal] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [categories, setCategories] = useState([]); // Stores categories from API

  useEffect(() => {
            const fetchSubCategories = async () => {
                try {
                    const response = await getAllSubCategories(); // Pass catID
                    if (response.success) {
                      console.log(response.data)
                      setSubcategories(response.data); // ✅ Sets array if successful
                    } else {
                        console.error("Failed to fetch categories:", response.error);
                    }
                } catch (err) {
                    console.error("Error fetching categories:", err);
                }
            };
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
  fetchSubCategories();
  }, [API_URL, token]);
  

  const handleDelete = (subcategoryId) => {
    setSelectedSubcategoryId(subcategoryId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedSubcategoryId) {
      try {
        if (token) {
          const config = {
            headers: { Authorization: `Bearer ${token}` },
            data: { id: selectedSubcategoryId },
          };
          await axios.delete(`${API_URL}/subcategories`, config);
          setSubcategories(subcategories.filter((sub) => sub.id !== selectedSubcategoryId));
          setShowDeleteModal(false);
        }
      } catch (err) {
        setError("Failed to delete subcategory. Please try again.");
      }
    }
  };

  const handleUpdate = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setPreviewImage(subcategory.subcategory_logo ? `${IMAGE_BASE_URL}${subcategory.subcategory_logo}` : "");
    setShowModal(true);
  };
  

  const handleClose = () => {
    setShowModal(false);
    setSelectedSubcategory(null);
    setPreviewImage("");
  };
  const handleSave = async () => {
    try {
      if (token && selectedSubcategory) {
        const config = { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", 
          }
        };
  
        const formData = new FormData();
        formData.append("id", selectedSubcategory.id);
        formData.append("name", selectedSubcategory.name);
        formData.append("description", selectedSubcategory.description);
        formData.append("category_id", selectedSubcategory.category_id);
        formData.append("status", selectedSubcategory.status);
  
        if (selectedSubcategory.subcategory_logo instanceof File) {
          formData.append("subcategory_logo", selectedSubcategory.subcategory_logo); // New image
        } else if (selectedSubcategory.category_logo) {
          formData.append("existing_category_logo", selectedSubcategory.subcategory_logo); // Retain existing image
        }
  
        // API call
        const response = await axios.put(`${API_URL}/subcategories`, formData, config);
        console.log("Update Response:", response.data.subcategories); // Debugging log
  
        if (response.data && response.data.subcategories) {
          setSubcategories((prevCategories) =>
            prevCategories.map((cat) =>
              cat.id === selectedSubcategory.id ? response.data.subcategories : cat
            )
          );
        }
  
        setShowModal(false);
        setSelectedSubcategory(null);
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
      setSelectedSubcategory({ ...selectedSubcategory, subcategory_logo: file });
    }
  };
  

  return (
    <Container fluid className="mt-4">
      {error && <p className="text-danger">{error}</p>}
      
      <div className="table-responsive p-2 bg-white">
      {subcategories.length === 0 ? (
            <p style={{ color: "red", textAlign: "center", fontSize: "15px" }}>
              No SubCategories Found
            </p>
          ) : (
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Subcategory Name</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Logo</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subcategories.map((subcategory, index) => (
              <tr key={subcategory.id || index}>
                <td>{index + 1}</td>
                <td>{subcategory.name}</td>
                <td>{subcategory.category_name || "N/A"}</td>
                <td>{subcategory.description || "No Description"}</td>
                <td>
                  {subcategory.subcategory_logo ? (
                    <img src={`${IMAGE_BASE_URL}${subcategory.subcategory_logo}`} alt="Subcategory Logo" width="50" height="50" />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td>{subcategory.status === 1 ? "Active" : "Inactive"}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleUpdate(subcategory)}>
                    <Pencil />
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(subcategory.id)}>
                    <Trash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        )}
      </div>

      {/* Modal for Updating Subcategory */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Subcategory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubcategory && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Subcategory Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedSubcategory.name}
                  onChange={(e) => setSelectedSubcategory({ ...selectedSubcategory, name: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedSubcategory.description}
                  onChange={(e) => setSelectedSubcategory({ ...selectedSubcategory, description: e.target.value })}
                />
              </Form.Group>
              {/* Select Parent Category Field */}
              <Form.Group className="mb-3">
                <Form.Label>Select Parent Category</Form.Label>
                <Form.Control
                  as="select"
                  name="category_id"
                  value={selectedSubcategory.category_id || ""}
                  onChange={(e) => setSelectedSubcategory({ ...selectedSubcategory, category_id: e.target.value })}
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Subcategory Logo</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                {previewImage && (
                  <div className="mt-2">
                    <img src={previewImage} alt="Subcategory Preview" className="img-thumbnail" width="120" />
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={selectedSubcategory.status}
                  onChange={(e) => setSelectedSubcategory({ ...selectedSubcategory, status: Number(e.target.value) })}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Changes</Button>
        </Modal.Footer>
          </Modal>
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

export default SubcategoryList;
