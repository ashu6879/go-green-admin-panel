import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash } from 'react-bootstrap-icons'; // Import Bootstrap Icons
import { Modal, Button, Form, Table, Container } from "react-bootstrap";
import { getAllCategories, getAllSubCategories,getAllProducts,productfetchBrands } from "../../services/apiService";


const ProductList  = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const BASE_URL =import.meta.env.VITE_IMAGE_BASE_URL; // Image Base URL
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [previewImage, setPreviewImage] = useState(selectedUser?.featured_image || "");
  const [previewImages, setPreviewImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // //console.log("token from allproducts",token)

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
    }, [API_URL]);

    useEffect(() => {
    const fetchSubCategories = async () => {
        try {
            const response = await getAllSubCategories(); // Pass catID
            if (response.success) {
              console.log(response.data)
                setSubCategories(response.data); // ✅ Sets array if successful
            } else {
                console.error("Failed to fetch categories:", response.error);
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };
    fetchSubCategories();
    const fetchproducts = async () => {
      try {
          const response = await getAllProducts();
          if (response.success) {
              console.log(response.data);
              setUsers(response.data); // ✅ Renamed for clarity
          } else {
              console.error("Failed to fetch products:", response.error);
          }
      } catch (err) {
          console.error("Error fetching products:", err);
      }
  };

    fetchproducts();
  }, [API_URL, token]);
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await productfetchBrands(); // Using API service
                if (response.success) {
                    setBrands(response.data); // ✅ Sets array if successful
                } else {
                    console.error("Failed to fetch Brands:", response.error);
                }
            } catch (err) {
                console.error("Error fetching Brands:", err);
            }
        };
        fetchBrands();
    }, [API_URL]);
  
  const handleDelete = (user) => {
    setSelectedUserId(user.id);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
      if (selectedUserId) {
          //console.log("Deleting user with ID:", selectedUserId);
          deleteUser(selectedUserId);
          setShowDeleteModal(false);
      }
  };

  const handleCloseDeleteModal = () => {
      setShowDeleteModal(false);
      setSelectedUserId(null);
  };
  const deleteUser = async (userId) => {
    try {
      if (token) {
        //console.log("aagya");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
          data: { id: userId }, // Move body into "data"
        };
        const response = await axios.delete(`${API_URL}/products/products`, config);
        setUsers(users.filter(user => user.id !== userId));
        //console.log("Product deleted:", response);
      }
    } catch (err) {
      setError("Failed to delete product. Please try again.");
    }
  };
  
    // Open Modal with Selected User Details
    const handleUpdate = (user) => {
      setSelectedUser(user);
      setShow(true);
    };
  
    // Close Modal
    const handleClose = () => {
      setShow(false);
      setSelectedUser(null);
    };
  
    // Handle Save (Update) Button
const handleSave = async () => {
    try {
        if (!token) {
            setError("Unauthorized: No token found.");
            return;
        }

        const config = {
            headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data" 
            }
        };
        // console.log("🔍 Selected User:", selectedUser);

        // Prepare form data
        const formData = new FormData();
        formData.append("id", selectedUser.id);
        formData.append("name", selectedUser.name);
        formData.append("description", selectedUser.description);
        formData.append("category_id", selectedUser.category_id);
        formData.append("sub_category", selectedUser.sub_category);
        formData.append("manufacturer_details", selectedUser.manufacturer_details);
        formData.append("feature_description", selectedUser.feature_description);
        formData.append("price", selectedUser.price);
        formData.append("stock", selectedUser.stock);
        formData.append("title", selectedUser.title);
        formData.append("brand_id", selectedUser.brand_id);
        formData.append("feature_title", selectedUser.feature_title);
        formData.append("subtitle", selectedUser.subtitle);
        formData.append("size", selectedUser.size);
        formData.append("fast_delivery_available", selectedUser.fast_delivery_available);

        // Append featured image if changed
        if (selectedUser.featured_image instanceof File) {
            formData.append("featuredImage", selectedUser.featured_image);
        }

        // Append gallery images correctly
        if (selectedUser.gallery_images && selectedUser.gallery_images.length > 0) {
            selectedUser.gallery_images.forEach((file) => {
                if (file instanceof File) {
                    formData.append("galleryImages", file); // Match backend field name
                }
            });
        }

        // Debugging: Log form data before sending
        // console.log("🛠 Sending FormData:");
        for (let pair of formData.entries()) {
            console.log(`📌 ${pair[0]}:`, pair[1]);
        }

        // Send request
        const response = await axios.post(`${API_URL}/update-products`, formData, config);

        // console.log("✅ API Response Data:", response.data);

        if (response.data.success) {
            setUsers(prevUsers =>
                prevUsers.map(user => (user.id === selectedUser.id ? response.data.product : user))
            );
            setSelectedUser(response.data.product);
        } else {
            setError("Failed to update product. Try again.");
        }
    } catch (err) {
        console.error("❌ Error updating product:", err);
        setError("Failed to update product. Please try again.");
    }

    setShow(false);
};

    
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        console.log("New Selected Product Image URL:", imageUrl); // Debugging
    
        setPreviewImage(imageUrl);
        setSelectedUser(prevState => ({
          ...prevState,
          featured_image: file, // Store file in state
        }));
      }
    };
    
    const handleGalleryImagesChange = (event) => {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        const imageUrls = files.map(file => URL.createObjectURL(file));
    
        // console.log("🆕 Newly Selected Gallery Images (Preview URLs):", imageUrls);
        
        setPreviewImages(prevImages => [...prevImages, ...imageUrls]);
    
        setSelectedUser(prevState => {
          const updatedGalleryImages = [...(prevState.gallery_images || []), ...files];
    
          // console.log("🛠 Updated gallery_images in selectedUser:", updatedGalleryImages);
    
          return { ...prevState, gallery_images: updatedGalleryImages };
        });
      }
    };
    const handleDeleteFeaturedImage = () => {
      setSelectedUser(prevState => ({ ...prevState, featured_image: null }));
    };
    const handleDeleteGalleryImage = (index) => {
      const updatedGalleryImages = [...selectedUser.gallery_images];
      updatedGalleryImages.splice(index, 1);
      setSelectedUser(prevState => ({ ...prevState, gallery_images: updatedGalleryImages }));
    };
    
    const handleDeletePreviewImage = (index) => {
      const updatedPreviewImages = [...previewImages];
      updatedPreviewImages.splice(index, 1);
      setPreviewImages(updatedPreviewImages);
    };
    const handleFeaturedChange = async (userId, isChecked) => {
      setLoading(true);
    
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      };
    
      const payload = {
        id: userId,
        is_featured: isChecked ? 1 : 0
      };
    
      try {
        const response = await axios.put(`${API_URL}/makeproductfeatures`, payload, config);
    
        // ✅ Update local users state immediately
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, is_featured: isChecked ? 1 : 0 } : user
          )
        );
    
      } catch (error) {
        console.error("Error updating featured status:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };
    
    const handleTodayDealChange = async (userId, isChecked) => {
      setLoading(true);
    
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      };
    
      const payload = {
        id: userId,
        is_today_deal: isChecked ? 1 : 0
      };
    
      try {
        const response = await axios.put(`${API_URL}/makeproductweeklydeal`, payload, config);
    
        // ✅ Update local users state immediately
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, is_today_deal: isChecked ? 1 : 0 } : user
          )
        );
    
      } catch (error) {
        console.error("Error updating today's deal status:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Container fluid className="mt-4">
        <div className="table-responsive p-2 bg-white">
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Category Name</th>
                <th>Sub Category Name</th>
                <th>Manufacturer Details</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Today Deal</th>
                <th>Featured Image</th>
                <th>Gallery Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id || user._id || index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  {/* <td>{user.description}</td> */}
                  <td>{user.description.length > 30 ? user.description.slice(0, 30) + '...' : user.description}</td>
                  <td>{user.category_name}</td>
                  <td>{user.sub_category_name}</td>
                  <td>{user.manufacturer_details}</td>
                  <td>{user.price}</td>
                  <td>{user.stock}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={user.is_featured === 1}
                      onChange={(e) => handleFeaturedChange(user.id, e.target.checked)}
                      disabled={loading}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={user.is_today_deal === 1}
                      onChange={(e) => handleTodayDealChange(user.id, e.target.checked)}
                      disabled={loading}
                    />
                  </td>
                  <td>
                    <img src={`${BASE_URL}${user.featured_image}`} alt="Product" width="50" height="50" />
                  </td>
                  <td>
                    {user.gallery_images && user.gallery_images.length > 0 ? (
                      user.gallery_images.map((image, idx) => (
                        <img
                          key={idx}
                          src={`${BASE_URL}${image.image_path}`}
                          alt={`Gallery ${idx + 1}`}
                          width="50"
                          height="50"
                          style={{ marginRight: "5px" }}
                        />
                      ))
                    ) : (
                      <span>No Images</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <button className="btn btn-primary btn-sm me-2" onClick={() => handleUpdate(user)}>
                        <Pencil />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user)}>
                        <Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal for Updating Product */}
        <Modal show={show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold text-primary">Update Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <Form>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedUser.name}
                        onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Subtitle</Form.Label>
                      <Form.Control
                        type="text" 
                        value={selectedUser.subtitle}
                        onChange={(e) => setSelectedUser({ ...selectedUser, subtitle: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        as="select"
                        name="category_id"
                        value={selectedUser.category_id || ""}
                        onChange={(e) =>
                          setSelectedUser({ 
                            ...selectedUser, 
                            category_id: e.target.value,  // Store category ID
                            category_name: categories.find(cat => cat.id == e.target.value)?.name || "", // Get category name
                            sub_category: "",          // Reset sub-category
                            sub_category_id: "",
                            sub_category_name: ""      // Reset sub-category name
                          })
                        }
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
                      <Form.Label>Product Brand</Form.Label>
                      <Form.Control
                        as="select"
                        name="brand_id"
                        value={selectedUser.brand_id || ""}
                        onChange={(e) =>
                          setSelectedUser({ 
                            ...selectedUser, 
                            brand_id: e.target.value, // Store brand ID
                            brand_name: brands?.find(brand => String(brand.id) === e.target.value)?.name || "", // Get brand name safely
                          })
                        }
                        required
                      >
                        <option value="">-- Select Brand --</option> {/* Fixed label */}
                        {brands?.map((brand) => ( /* Safety check */
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Sub-Category</Form.Label>
                      <Form.Control
                        as="select"
                        name="sub_category"
                        value={selectedUser.sub_category || ""}
                        onChange={(e) => 
                          setSelectedUser({ 
                            ...selectedUser, 
                            sub_category: e.target.value,  // Store sub-category ID
                            sub_category_name: subCategories.find(sub => sub.id == e.target.value)?.name || "" // Get sub-category name
                          })
                        }
                        required
                      >
                        <option value="">-- Select Sub-Category --</option>
                        {subCategories
                          .filter((sub) => String(sub.category_id) === String(selectedUser.category_id))
                          .map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Price ($)</Form.Label>
                      <Form.Control
                        type="number"
                        value={selectedUser.price}
                        onChange={(e) => setSelectedUser({ ...selectedUser, price: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Product Size</Form.Label>
                      <Form.Control
                        type="number"
                        value={selectedUser.size}
                        onChange={(e) => setSelectedUser({ ...selectedUser, size: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Fast Delivery</Form.Label>
                      <Form.Select
                        value={selectedUser.fast_delivery_available}
                        onChange={(e) =>
                          setSelectedUser({
                            ...selectedUser,
                            fast_delivery_available: e.target.value,
                          })
                        }
                      >
                        <option value="1">Yes</option>
                        <option value="0">No</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Stock Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        value={selectedUser.stock}
                        onChange={(e) => setSelectedUser({ ...selectedUser, stock: e.target.value })}
                      />
                    </Form.Group>
                  </div>

                  <div className="col-md-6">
                  <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedUser.title}
                        onChange={(e) => setSelectedUser({ ...selectedUser, title: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Key Feature Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={selectedUser.feature_title}
                        onChange={(e) => setSelectedUser({ ...selectedUser, feature_title: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={selectedUser.description}
                        onChange={(e) => setSelectedUser({ ...selectedUser, description: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Key feature Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={selectedUser.feature_description}
                        onChange={(e) => setSelectedUser({ ...selectedUser, feature_description: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Manufacturer Details</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={selectedUser.manufacturer_details}
                        onChange={(e) => setSelectedUser({ ...selectedUser, manufacturer_details: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Product Image</Form.Label>
                      <Form.Control type="file" accept="image/*" onChange={handleImageChange} />

                      {/* Show current product image if available */}
                      {(previewImage || selectedUser.featured_image) && (
                        <div className="mt-2 position-relative d-inline-block">
                          <img
                            src={previewImage || `${BASE_URL}${selectedUser.featured_image}`} // Use preview first, fallback to existing image
                            alt="Product Preview"
                            className="img-thumbnail"
                            width="60"
                            height="60"
                          />
                          {/* Delete button */}
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle"
                            style={{ fontSize: "10px", lineHeight: "1"}}
                            onClick={handleDeleteFeaturedImage}
                          >
                            ✖
                          </button>
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Gallery Images</Form.Label>
                      <Form.Control type="file" accept="image/*" multiple onChange={handleGalleryImagesChange} />

                      {/* Show existing gallery images first, then new uploads */}
                      <div className="mt-2 d-flex flex-wrap">
                        {[
                          ...(selectedUser.gallery_images || []).map((img, index) => {
                            const imageUrl = typeof img === "string" ? `${BASE_URL}${img}` : `${BASE_URL}${img.image_path}`;
                            return (
                              <div key={index} className="position-relative m-1">
                                <img
                                  src={imageUrl}
                                  alt={`Gallery Preview ${index + 1}`}
                                  className="img-thumbnail"
                                  width="60"
                                  height="60"
                                />
                                {/* Delete button */}
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle"
                                  style={{ fontSize: "10px", lineHeight: "1"}}
                                  onClick={() => handleDeleteGalleryImage(index)}
                                >
                                  ✖
                                </button>
                              </div>
                            );
                          }),
                          ...previewImages.map((imageUrl, index) => (
                            <div key={`new-${index}`} className="position-relative m-1">
                              <img
                                src={imageUrl}
                                alt={`Gallery Preview New ${index + 1}`}
                                className="img-thumbnail"
                                width="80"
                                height="80"
                              />
                              {/* Delete button for newly added images */}
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle"
                                style={{ fontSize: "10px", lineHeight: "1"}}
                                onClick={() => handleDeletePreviewImage(index)}
                              >
                                ✖
                              </button>
                            </div>
                          ))
                        ]}
                      </div>
                    </Form.Group>

                  </div>
                </div>
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
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseDeleteModal}>
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

export default ProductList;
