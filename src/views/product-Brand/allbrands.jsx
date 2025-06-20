import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash } from "react-bootstrap-icons";
import { Modal, Button, Form, Table, Container } from "react-bootstrap";
import { getAllCategories,productfetchBrands } from "../../services/apiService";

const ProductBrandList = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const [show, setShow] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [categories, setCategories] = useState([]); // Stores categories from API

  useEffect(() => {
    const fetchBrands = async () => {
        try {
            const response = await productfetchBrands(); // Using API service
            if (response.success) {
                setBrands(response.data); // ✅ Sets array if successful
            } else {
                console.error("Failed to fetch brands:", response.error);
            }
        } catch (err) {
            console.error("Error fetching brands:", err);
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

    fetchBrands();
    fetchCategories();

// ✅ Add empty dependency array to run **only on mount**
}, []); 


  const handleDelete = (brandId) => {
    setSelectedBrandId(brandId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedBrandId) {
      try {
        if (token) {
          const config = {
            headers: { Authorization: `Bearer ${token}` },
            data: { id: selectedBrandId },
          };
          await axios.delete(`${API_URL}/product-brands`, config);
          setBrands(brands.filter((brand) => brand.id !== selectedBrandId));
          setShowDeleteModal(false);
        }
      } catch (err) {
        setError("Failed to delete brand. Please try again.");
      }
    }
  };

  const handleUpdate = (brand) => {
    setSelectedBrand(brand);
    setPreviewImage(brand.brand_logo ? `${IMAGE_BASE_URL}${brand.brand_logo}` : "");
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedBrand(null);
    setPreviewImage("");
  };

  const handleSave = async () => {
    try {
      if (token && selectedBrand) {
        const config = { 
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", 
          }
        };
  
        const formData = new FormData();
        formData.append("id", selectedBrand.id);
        formData.append("name", selectedBrand.name);
        formData.append("description", selectedBrand.description);
        formData.append("categoryid", selectedBrand.categoryid);
        formData.append("status", selectedBrand.status);
  
        if (selectedBrand.brand_logo instanceof File) {
          formData.append("brand_logo", selectedBrand.brand_logo); // New image
        } else if (selectedBrand.brand_logo) {
          formData.append("existing_brand_logo", selectedBrand.brand_logo); // Retain existing image
        }
        console.log("updated brand",formData)
        const response = await axios.put(`${API_URL}/product-brands`, formData, config);
        console.log("Update Response:", response.data.productBrand);
  
        if (response.data && response.data.productBrand) {
          setBrands((prevBrands) =>
            prevBrands.map((brand) =>
              brand.id === selectedBrand.id ? response.data.productBrand : brand
            )
          );
        }
  
        setShow(false);
        setSelectedBrand(null);
        setPreviewImage("");
      }
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      setError("Failed to update brand.");
    }
  };
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setSelectedBrand({ ...selectedBrand, brand_logo: file });
    } else {
      setSelectedBrand({ ...selectedBrand, brand_logo: selectedBrand.brand_logo });
    }
  };

  return (
    <Container fluid className="mt-4">
      <div className="table-responsive p-2 bg-white">
      {(brands || []).length === 0 ? (
          <p style={{ color: "red", textAlign: "center", fontSize: "15px" }}>
            No Brands Found
          </p>
        ) : (
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Brand Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Logo</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand, index) => (
              <tr key={brand.id || index}>
                <td>{index + 1}</td>
                <td>{brand.name}</td>
                <td>{brand.description}</td>
                <td>{brand.category_name}</td>
                <td>
                  {brand.brand_logo ? (
                    <img src={`${IMAGE_BASE_URL}${brand.brand_logo}`} alt="Brand Logo" width="50" height="50" />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td>{brand.status === 1 ? "Active" : "Inactive"}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleUpdate(brand)}>
                    <Pencil />
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(brand.id)}>
                    <Trash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        )}
      </div>

      {/* Modal for Updating Brand */}
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-primary">Update Brand</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBrand && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Brand Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedBrand.name}
                  onChange={(e) => setSelectedBrand({ ...selectedBrand, name: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedBrand.description}
                  onChange={(e) => setSelectedBrand({ ...selectedBrand, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Select Parent Category</Form.Label>
                <Form.Control
                  as="select"
                  name="categoryid" // Ensure name matches API field
                  value={selectedBrand.categoryid || ""} // Use categoryid from API response
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    console.log("Selected Category ID:", selectedId); // Debugging output
                    setSelectedBrand({
                      ...selectedBrand,
                      categoryid: selectedId, // Send selected category ID
                    });
                  }}
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} {/* Display category name */}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Brand Logo</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                {previewImage && (
                  <div className="mt-2">
                    <img src={previewImage} alt="Brand Preview" className="img-thumbnail" width="120" />
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Status</Form.Label>
                <Form.Select
                  value={selectedBrand.status}
                  onChange={(e) => setSelectedBrand({ ...selectedBrand, status: Number(e.target.value) })}
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
        <Modal.Body>Are you sure you want to delete this brand?</Modal.Body>
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

export default ProductBrandList;
