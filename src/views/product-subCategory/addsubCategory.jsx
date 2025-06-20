import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Button, InputGroup, Row, Col, Container, Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import axios from "axios";
import { getAllCategories } from "../../services/apiService";

const AddCategory = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_id: "", // Stores selected category ID
        subcategory_logo: null,
    });

    const [categories, setCategories] = useState([]); // Stores categories from API
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Fetch categories on component mount
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
                setFormData({ ...formData, subcategory_logo: file }); // ✅ Updated field
                setPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
    
        // ✅ Append text fields
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("category_id", formData.category_id); // ✅ Sending category ID
    
        // ✅ Append file as `subcategory_logo`
        if (formData.subcategory_logo) {
            formDataToSend.append("subcategory_logo", formData.subcategory_logo);
        }
    
        try {
            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "multipart/form-data",
                },
            };
    
            await axios.post(`${API_URL}/subcategories`, formDataToSend, config);
    
            // ✅ Show success modal
            setShowModal(true);
    
            // ✅ Reset form fields & preview
            setFormData({
                name: "",
                description: "",
                category_id: "",
                subcategory_logo: null,
            });
            setPreview(null);
    
            // ✅ Clear file input manually
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
    
        } catch (err) {
            setError("Failed to add sub-category. Please try again.");
        }
    };
    

    return (
        <Container fluid className="p-4">
            <Card className="borderless w-100">
                <Card.Body>
                    <h4 className="mb-3 f-w-400 text-center">Add Sub-Category</h4>
                    {error && <p className="text-danger text-center">{error}</p>}

                    <Form onSubmit={handleSubmit} autoComplete="off">
                        <Row>
                            {/* Left Column - Name & Logo */}
                            <Col md={6} className="mb-3">
                                {/* Category Name */}
                                <Form.Label>Sub-Category Name</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FeatherIcon icon="tag" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Sub-Category Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </InputGroup>

                                {/* Select Category */}
                                <Form.Label>Select Parent Category</Form.Label>
                                <Form.Control
                                    as="select"
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
                                </Form.Control>

                                {/* Upload Logo */}
                                <Form.Label>Upload Logo</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    name="subcategory_logo"  // ✅ Updated name
                                    onChange={handleChange}
                                    ref={fileInputRef}
                                    required
                                />

                                {/* Logo Preview */}
                                {preview && (
                                    <div className="mt-3">
                                        <p>Logo Preview:</p>
                                        <img
                                            src={preview}
                                            alt="Logo Preview"
                                            className="img-fluid"
                                            style={{ maxWidth: "60px", maxHeight: "60px", borderRadius: "5px" }}
                                        />
                                    </div>
                                )}
                            </Col>

                            {/* Right Column - Description */}
                            <Col md={6} className="mb-3">
                                <Form.Label>Sub-Category Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={9}
                                    placeholder="Enter sub-category description..."
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                        </Row>

                        {/* Submit Button */}
                        <Row>
                            <Col md={12} className="text-center">
                                <Button type="submit" className="btn btn-primary w-50">
                                    Add Sub-Category
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Success Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sub-Category Created Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The sub-category has been added successfully!</p>
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

export default AddCategory;
