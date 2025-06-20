import React, { useState, useRef } from "react";
import { Card, Form, Button, InputGroup, Row, Col, Container, Modal } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import { addBanner } from "../../services/apiService";

const AddBanner = () => {
    const bannerInputRef = useRef(null); // ✅ File input reference for banner image

    const [formData, setFormData] = useState({
        title: "",
        status: "",
        banner_image: null,
    });

    const [bannerPreview, setBannerPreview] = useState(null);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;
        if (type === "file") {
            const file = files[0];
            if (file) {
                setFormData({ ...formData, banner_image: file });
                setBannerPreview(URL.createObjectURL(file));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // ✅ Append fields
        formDataToSend.append("title", formData.title);
        formDataToSend.append("status", formData.status);

        // ✅ Append banner image if exists
        if (formData.banner_image) {
            formDataToSend.append("banner_image", formData.banner_image);
        }

        try {
            const result = await addBanner(formDataToSend);

            if (result.success) {
                setShowModal(true);

                // ✅ Reset form
                setFormData({
                    title: "",
                    status: "",
                    banner_image: null,
                });
                setBannerPreview(null);

                // ✅ Clear file input
                if (bannerInputRef.current) {
                    bannerInputRef.current.value = "";
                }
            } else {
                setError(result.error?.message || "Failed to add banner.");
            }
        } catch (err) {
            setError("Failed to add banner. Please try again.");
        }
    };

    return (
        <Container fluid className="p-4">
            <Card className="borderless w-100">
                <Card.Body>
                    <h4 className="mb-3 f-w-400 text-center">Add Banner</h4>
                    {error && <p className="text-danger text-center">{error}</p>}

                    <Form onSubmit={handleSubmit} autoComplete="off">
                        <Row>
                            <Col md={6} className="mb-3">
                                {/* Title */}
                                <Form.Label>Title</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FeatherIcon icon="tag" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Banner Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </InputGroup>
                            </Col>

                            <Col md={6} className="mb-3">
                                {/* Status */}
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </Form.Control>
                            </Col>

                            <Col md={12} className="mb-3">
                                {/* Upload Banner */}
                                <Form.Label>Upload Banner</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    name="banner_image"
                                    onChange={handleChange}
                                    ref={bannerInputRef}  // ✅ Attach ref to file input
                                    required
                                />

                                {/* Banner Preview */}
                                {bannerPreview && (
                                    <div className="mt-3">
                                        <p>Banner Preview:</p>
                                        <img
                                            src={bannerPreview}
                                            alt="Banner Preview"
                                            className="img-fluid"
                                            style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "5px" }}
                                        />
                                    </div>
                                )}
                            </Col>
                        </Row>

                        {/* Submit Button */}
                        <Row>
                            <Col md={12} className="text-center">
                                <Button type="submit" className="btn btn-primary w-50">
                                    Add Banner
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Success Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Banner Created Successfully</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The banner has been added successfully!</p>
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

export default AddBanner;
