import React, { useState, useEffect ,useRef } from "react";
import { Card, Form, Button, InputGroup, Row, Col, Container, Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import { getAllCategories,addProductBrand } from "../../services/apiService";

const AddProductBrand = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const fileInputRef = useRef(null);  // ✅ File input reference

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        brand_logo: null, 
    });

    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState([]); // Stores categories from API

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
    }, []);
    

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            const file = files[0];
            if (file) {
                setFormData({ ...formData, brand_logo: file });
                setPreview(URL.createObjectURL(file)); // ✅ Show image preview
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("category_id", formData.category_id);
        console.log(formData.brand_logo)
        if (formData.brand_logo) {
            formDataToSend.append("brand_logo", formData.brand_logo);
        }

        try {
            await addProductBrand(formDataToSend);
            setShowModal(true);

            // Reset form
            setFormData({ name: "", description: "", category_id: "", brand_logo: null });
            setPreview(null);

            // Clear file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            setError("Failed to add product brand. Please try again.");
        }
    };

    return (
        <Container fluid className="p-4">
            <Card className="borderless w-100">
                <Card.Body>
                    <h4 className="mb-3 f-w-400 text-center">Add Product Brand</h4>
                    {error && <p className="text-danger text-center">{error}</p>}
                    
                    <Form onSubmit={handleSubmit} autoComplete="off">
                        <Row>
                            {/* Left Column - Name & Logo */}
                            <Col md={6} className="mb-3">
                                {/* Product Brand Name */}
                                <Form.Label>Brand Name</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FeatherIcon icon="tag" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Brand Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </InputGroup>

                                {/* Upload Brand Logo */}
                                <Form.Label>Upload Brand Logo</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    name="brand_logo"
                                    onChange={handleChange}
                                    ref={fileInputRef}  // ✅ Attach ref to file input
                                    required
                                />

                                {/* Logo Preview */}
                                {preview && (
                                    <div className="mt-3">
                                        <p>Logo Preview:</p>
                                        <img
                                            src={preview}
                                            alt="Brand Logo Preview"
                                            className="img-fluid"
                                            style={{ maxWidth: "60px", maxHeight: "60px", borderRadius: "5px" }}
                                        />
                                    </div>
                                )}
                            </Col>

                            {/* Right Column - Description & Parent Category Selection */}
                            <Col md={6} className="mb-3">
                                {/* Brand Description */}
                                <Form.Group controlId="brandDescription">
                                    <Form.Label>Brand Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        placeholder="Enter brand description..."
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                </Col>
                                <Col md={6} className="mb-3">
                                {/* Parent Category Selection */}
                                <Form.Group controlId="parentCategory" className="mt-3">
                                    <Form.Label>Select Product Category</Form.Label>
                                    <Form.Select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Select Category --</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                </Col>
                        </Row>

                        {/* Submit Button */}
                        <Row>
                            <Col md={12} className="text-center">
                                <Button type="submit" className="btn btn-primary w-50">
                                    Add Brand
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Success Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Product Brand Created Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The product brand has been added successfully!</p>
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

export default AddProductBrand;
