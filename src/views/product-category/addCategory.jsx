import React, { useState, useRef } from "react";
import { Card, Form, Button, InputGroup, Row, Col, Container, Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import { addCategory } from "../../services/apiService";

const AddCategory = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const fileInputRef = useRef(null);  // ✅ File input reference

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category_logo: null, 
    });

    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            const file = files[0];
            if (file) {
                setFormData({ ...formData, category_logo: file });
                setPreview(URL.createObjectURL(file)); // ✅ Show image preview
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
    
        // ✅ Append file if exists
        if (formData.category_logo) {
            formDataToSend.append("category_logo", formData.category_logo);
        }
        try {
            const result = await addCategory(formDataToSend);
    
            if (result.success) {
                // ✅ Show success modal
                setShowModal(true);
    
                // ✅ Reset form fields & preview
                setFormData({
                    name: "",
                    description: "",
                    category_logo: null,
                });
                setPreview(null);
    
                // ✅ Clear file input manually
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } else {
                setError(result.error?.message || "Failed to add category.");
            }
    
        } catch (err) {
            setError("Failed to add category. Please try again.");
        }
    };

    return (
        <Container fluid className="p-4">
            <Card className="borderless w-100">
                <Card.Body>
                    <h4 className="mb-3 f-w-400 text-center">Add Category</h4>
                    {error && <p className="text-danger text-center">{error}</p>}
                    
                    <Form onSubmit={handleSubmit} autoComplete="off">
                        <Row>
                            {/* Left Column - Name & Logo */}
                            <Col md={6} className="mb-3">
                                {/* Category Name */}
                                <Form.Label>Category Name</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FeatherIcon icon="tag" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Category Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </InputGroup>

                                {/* Upload Logo */}
                                <Form.Label>Upload Logo</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    name="category_logo"
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
                                            alt="Logo Preview"
                                            className="img-fluid"
                                            style={{ maxWidth: "60px", maxHeight: "60px", borderRadius: "5px" }}
                                        />
                                    </div>
                                )}
                            </Col>

                            {/* Right Column - Description */}
                            <Col md={6} className="mb-3">
                                <Form.Label>Category Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder="Enter category description..."
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
                                    Add Category
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Success Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Category Created Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The category has been added successfully!</p>
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
