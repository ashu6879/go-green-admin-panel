import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Button, Row, Col, Container, Modal } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { getAllCategories, getAllSubCategoriesbyID, productfetchBrands } from "../../services/apiService";

const ProductRegistration = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      price: "",
      category: "",
      sub_category: "",
      stock: "",
      manufacturer_details: "",
      title:"",
      subtitle:"",
      size:"",
      feature_title:"",
      product_brand:"",
      feature_description:"",
      fast_delivery_available:"",
      featuredImage: null,
      galleryImages: [],
      ingredients: "",
      miscellaneous: "",
      nutritional_facts: "",
      keyValues: [{ key: "", value: "" }] // Initial key-value pair
    });

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [featuredPreview, setFeaturedPreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const fileInputRef = useRef(null);

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

    useEffect(() => {
        if (formData.category) {
            const fetchSubCategories = async () => {
                try {
                    const response = await getAllSubCategoriesbyID(formData.category); // Pass catID
                    if (response.success) {
                        setSubCategories(response.data.length > 0 ? response.data : []); // ✅ Set empty array if no data
                    } else {
                        console.error("Failed to fetch categories:", response.error);
                        setSubCategories([]); // Ensure state is cleared on failure
                    }
                } catch (err) {
                    console.error("Error fetching categories:", err);
                    setSubCategories([]); // Ensure state is cleared on error
                }
            };
            fetchSubCategories();
        }
    }, [formData.category]);

    const handleChange = (e, index = null) => {
        const { name, value, type, files } = e.target;
        if (index !== null) {
            // Ensure keyValues exists
            const updatedKeyValues = [...formData.keyValues];
            updatedKeyValues[index][name] = value; // Directly update the key-value pair
            setFormData({ ...formData, keyValues: updatedKeyValues });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    
        if (type === "file") {
            if (name === "featuredImage") {
                const file = files[0];
                if (file) {
                    setFormData({ ...formData, featuredImage: file });
                    setFeaturedPreview(URL.createObjectURL(file));
                }
            } else if (name === "galleryImages") {
                const fileArray = Array.from(files);
                setFormData({ ...formData, galleryImages: fileArray });
                setGalleryPreviews(fileArray.map(file => URL.createObjectURL(file)));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formDataToSend = new FormData();
    
        // Append form fields to FormData
        Object.keys(formData).forEach((key) => {
            if (key === "galleryImages") {
                formData.galleryImages.forEach((file) => {
                    formDataToSend.append("galleryImages", file);
                });
            } else if (key === "keyValues") {
                // Convert keyValues into the correct attributes format
                const attributes = JSON.stringify(formData.keyValues);
                formDataToSend.append("attributes", attributes);
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });
        console.log(formDataToSend)
        try {
            await axios.post(`${API_URL}/products`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });
    
            setShowModal(true);
            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                sub_category: "",
                stock: "",
                manufacturer_details: "",
                title: "",
                subtitle: "",
                size: "",
                product_brand:"",
                fast_delivery_available: "",
                featuredImage: null,
                galleryImages: [],
                feature_title:"",
                feature_description:"",
                ingredients: "",
                miscellaneous: "",
                nutritional_facts: "",
                keyValues: [{ key: "", value: "" }], // Reset key-value pairs
            });
            setFeaturedPreview(null);
            setGalleryPreviews([]);
        } catch (err) {
            console.error("Error posting product:", err);
            setError("Failed to add product. Please try again.");
        }
    };
    
    
const addKeyValue = () => {
    setFormData({
        ...formData,
        keyValues: [...formData.keyValues, { key: "", value: "" }],
    });
};

const removeKeyValue = (index) => {
    const updatedKeyValues = formData.keyValues.filter((_, i) => i !== index);
    setFormData({ ...formData, keyValues: updatedKeyValues });
}
    return (
        <Container fluid className="p-4">
            <Card className="borderless w-100">
                <Card.Body>
                    <h4 className="mb-3 f-w-400 text-center">Add Product</h4>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <Form onSubmit={handleSubmit} autoComplete="off">
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Product Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Product Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Product Sub-title"
                                    name="subtitle"
                                    value={formData.subtitle}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Key Feature title"
                                    name="feature_title"
                                    value={formData.feature_title}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Control
                                    type="number"
                                    placeholder="Product size"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Select
                                        name="fast_delivery_available"
                                        value={formData.fast_delivery_available}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            Fast Delievery
                                        </option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Control
                                    type="number"
                                    placeholder="Price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Control
                                    type="number"
                                    placeholder="Stock"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                            <Col md={6} className="mb-3">
                            <Form.Select 
                                name="product_brand" 
                                value={formData.product_brand || ""} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="">Select Brand</option>
                                {brands.map((brand) => (
                                <option key={brand.id} value={String(brand.id)}>
                                    {brand.name}
                                </option>
                                ))}
                            </Form.Select>
                            </Col>

                            <Col md={12} className="mb-3">
                            <Form.Control
                                as="textarea"
                                placeholder="Manufacturer Details"
                                name="manufacturer_details"
                                value={formData.manufacturer_details}
                                onChange={handleChange}
                                rows={3} // Adjust the number of rows as needed
                                required
                            />
                            </Col>
                            <Col md={6} className="mb-3">
                            <Form.Control
                                as="textarea"
                                placeholder="Key Features Descriptions"
                                name="feature_description"
                                value={formData.feature_description}
                                onChange={handleChange}
                                rows={3} // Adjust the number of rows as needed
                                required
                            />
                            </Col>
                            <Col md={6} className="mb-3">
                            <Form.Control
                                as="textarea"
                                placeholder="ingredients Descriptions"
                                name="ingredients"
                                value={formData.ingredients}
                                onChange={handleChange}
                                rows={3} // Adjust the number of rows as needed
                                required
                            />
                            </Col>
                            <Col md={6} className="mb-3">
                            <Form.Control
                                as="textarea"
                                placeholder="nutritional_facts Descriptions"
                                name="nutritional_facts"
                                value={formData.nutritional_facts}
                                onChange={handleChange}
                                rows={3} // Adjust the number of rows as needed
                                required
                            />
                            </Col>
                            <Col md={6} className="mb-3">
                            <Form.Control
                                as="textarea"
                                placeholder="miscellaneous Descriptions"
                                name="miscellaneous"
                                value={formData.miscellaneous}
                                onChange={handleChange}
                                rows={3} // Adjust the number of rows as needed
                                required
                            />
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Label>Subcategory</Form.Label>
                                <Form.Select name="sub_category" value={formData.sub_category} onChange={handleChange} required>
                                    <option value="">Select Subcategory</option>
                                    {subCategories.map((sub) => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Label>Upload Featured Image</Form.Label>
                                <Form.Control type="file" accept="image/*" name="featuredImage" onChange={handleChange} ref={fileInputRef} />
                                {featuredPreview && <img src={featuredPreview} alt="Preview" className="img-fluid mt-2" style={{ maxWidth: "100px" }} />}
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Label>Upload Gallery Images</Form.Label>
                                <Form.Control type="file" accept="image/*" name="galleryImages" multiple onChange={handleChange} />
                                {galleryPreviews.length > 0 && galleryPreviews.map((preview, index) => (
                                    <img key={index} src={preview} alt="Gallery Preview" className="img-fluid mt-2 me-2" style={{ maxWidth: "60px" }} />
                                ))}
                            </Col>
                            {/* Key-Value Input Section */}
                            <Col md={12}>
                                <h5>Additional Details</h5>
                            </Col>
                            {formData.keyValues.map((pair, index) => (
                                <Row key={index} className="align-items-center mb-2">
                                    <Col md={2}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Key"
                                            name="key"
                                            value={pair.key}
                                            onChange={(e) => handleChange(e, index)}
                                        />
                                    </Col>
                                    <Col md={8}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Value"
                                            name="value"
                                            value={pair.value}
                                            onChange={(e) => handleChange(e, index)}
                                        />
                                    </Col>
                                    <Col md={2} className="d-flex gap-2">
                                        <Button variant="danger" onClick={() => removeKeyValue(index)}>
                                            <FaTrash />
                                        </Button>
                                        <Button variant="success" onClick={addKeyValue}>
                                            <FaPlus />
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                            <Col md={12} className="text-center">
                                <Button type="submit" className="btn btn-primary w-50">Add Product</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            {/* Success Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Product Created Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The Product has been added successfully!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => setShowModal(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ProductRegistration;
