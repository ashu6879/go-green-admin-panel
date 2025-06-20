import React, { useState, useEffect } from "react";
import { Eye } from "react-bootstrap-icons";
import {
  Modal,
  Table,
  Container,
  Form,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from "react-bootstrap";
import { getAllUnverifiedUsers, verifyUser } from "../../services/apiService";

const UnverifiedUsers = () => {
  const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  const [vendors, setVendors] = useState([]);
  const [delivery_partners, setDelivery_partners] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [userType, setUserType] = useState("vendors");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToVerify, setUserToVerify] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUnverifiedUsers();
        if (response.success) {
          setVendors(response.vendors);
          setDelivery_partners(response.delivery_partners);
        }
      } catch (error) {
        console.error("Error fetching unverified users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleVerify = async (userId) => {
    try {
      const response = await verifyUser(userId);
      if (response.success) {
        setVendors((prev) => prev.filter((user) => user.user_id !== userId));
        setDelivery_partners((prev) =>
          prev.filter((user) => user.user_id !== userId)
        );
      }
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  const filteredUsers = userType === "vendors" ? vendors : delivery_partners;

  return (
    <Container fluid className="p-4">
      <h4>Unverified Users</h4>
      <ToggleButtonGroup
        type="radio"
        name="userType"
        value={userType}
        onChange={setUserType}
        className="mb-3"
      >
        <ToggleButton
          id="toggle-vendors"
          value="vendors"
          className={`custom-toggle ${userType === 'vendors' ? 'active-green' : ''}`}
        >
          Unverified Vendors
        </ToggleButton>

        <ToggleButton
          id="toggle-delivery"
          value="delivery_partners"
          className={`custom-toggle ${userType === 'delivery_partners' ? 'active-green' : ''}`}
        >
          Unverified Delivery Partners
        </ToggleButton>
      </ToggleButtonGroup>

      <div className="table-responsive p-2 bg-white">
        <Table >
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Identity Type</th>
              <th>Identity Proof</th>
              <th>Verify</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.user_id}>
                <td>{index + 1}</td>
                <td>
                  {user.firstname} {user.lastname}
                </td>
                <td>{user.email}</td>
                <td>
                  {user.prefix} {user.phonenumber}
                </td>
                <td>{user.country_status}</td>
                <td>
                  <Eye
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedImage(`${IMAGE_BASE_URL}${user.identity_proof}`);
                      setShowImageModal(true);
                    }}
                  />
                </td>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={user.is_verified === 1}
                    onChange={() => {
                      setUserToVerify(user);
                      setSelectedImage(`${IMAGE_BASE_URL}${user.identity_proof}`);
                      setShowConfirmModal(true);
                    }}
                    disabled={user.is_verified === 1}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {/* Image Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Identity Proof</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img src={selectedImage} alt="Identity Proof" className="img-fluid" />
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Verify User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to verify this user?</p>
          <p><strong>{userToVerify?.firstname} {userToVerify?.lastname}</strong></p>
          <img
            src={selectedImage}
            alt="Identity Proof"
            className="img-fluid"
            style={{
              maxWidth: "100%",
              width: "auto",
              height: "auto",
              maxHeight: "400px",
              minHeight: "200px",
              minWidth: "200px",
              objectFit: "contain",
              border: "1px solid #ddd",
              borderRadius: "8px",
              display: "block",
              margin: "0 auto",
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={async () => {
              if (userToVerify) {
                await handleVerify(userToVerify.user_id);
                setUserToVerify(null);
                setShowConfirmModal(false);
              }
            }}
          >
            Yes, Verify
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UnverifiedUsers;
