import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash } from "react-bootstrap-icons";
import { Modal, Button, Form, Table, Container } from "react-bootstrap";
import { getAllBanners, deleteBanner,updateBanner  } from "../../services/apiService";

const AllBanners = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  const [banners, setBanners] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const [show, setShow] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getAllBanners();
        if (response.success) {
          setBanners(response.data);
        } else {
          console.error("Failed to fetch banners:", response.error);
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    };
    fetchBanners();
  }, [banners]);

  const handleDelete = (bannerId) => {
    setSelectedBannerId(bannerId);
    setShowDeleteModal(true);
  };
  const handleUpdate = (banner) => {
    setSelectedBanner(banner);
    setPreviewImage(banner.image_url ? `${IMAGE_BASE_URL}${banner.image_url}` : "");
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setSelectedBanner(null);
    setPreviewImage("");
  };

  const confirmDelete = async () => {
    if (selectedBannerId) {
      try {
          const response = await deleteBanner(selectedBannerId);
          if (response.success) {
            setBanners(banners.filter((banner) => banner.id !== selectedBannerId));
            setShowDeleteModal(false);
          } else {
            setError(response.message);
          }
      } catch (err) {
        setError("Failed to delete banner. Please try again.");
      }
    }
  };
  const handleSave = async () => {
    try {
      if (selectedBanner) {
        const updatedData = await updateBanner(selectedBanner);
        console.log("API Response:", updatedData); // Debugging
  
        if (updatedData.success) {
          setBanners((prevBanners) =>
            prevBanners.map((banner) =>
              banner.id === selectedBanner.id ? { ...banner, ...updatedData.data } : banner
            )
          );
          setShow(false);
          setSelectedBanner(null);
          setPreviewImage("");
        } else {
          console.error("Update failed:", updatedData);
          setError("Failed to update Banner.");
        }
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update Banner.");
    }
  };
  
  
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setSelectedBanner({ ...selectedBanner, image_url: file });
    } else {
      // Retain existing image if no new file is selected
      setSelectedCategory({ ...selectedBanner, image_url: selectedBanner.image_url });
    }
  };

  return (
    <Container fluid className="mt-4">
      <div className="table-responsive p-2 bg-white">
        {banners.length === 0 ? (
          <p style={{ color: "red", textAlign: "center", fontSize: "15px" }}>
            No Banners Found
          </p>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Banner Image</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner, index) => (
                <tr key={banner.id || index}>
                  <td>{index + 1}</td>
                  <td>{banner.title}</td>
                  <td>
                    {banner.image_url ? (
                      <img
                        src={`${IMAGE_BASE_URL}${banner.image_url}`}
                        alt="Banner"
                        style={{ width: "100px", height: "100px", maxWidth: "100px", maxHeight: "100px", objectFit: "contain" }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td>{banner.status === 1 ? "Active" : "Inactive"}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleUpdate(banner)}
                    >
                      <Pencil />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(banner.id)}
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
            {selectedBanner && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Banner Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedBanner.title}
                    onChange={(e) => setSelectedBanner({ ...selectedBanner, title: e.target.value })}
                  />
                </Form.Group>
  
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Banner Image</Form.Label>
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
                    value={selectedBanner.status}
                    onChange={(e) => setSelectedBanner({ ...selectedBanner, status: Number(e.target.value) })}
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
        <Modal.Body>Are you sure you want to delete this banner?</Modal.Body>
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

export default AllBanners;
