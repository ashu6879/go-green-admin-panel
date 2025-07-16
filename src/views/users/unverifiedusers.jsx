import React from "react";
import { Table, Modal, Button, Input, Badge, Space } from "antd";
import useUnverifiedUsers from "./unverifieduserhook";
import UserPreview from "./components/UserPreview";

const UnverifiedUsers = ({user="vendors"}) => {
  const {
    userType,
    setUserType,
    loading,
    search,
    setSearch,
    filteredUsers,
    showViewModal,
    selectedUser,
    handleView,
    handleApprove,
    handleReject,
    handleCloseModal,
    getBadgeStatus,
    viewLoading,
  } = useUnverifiedUsers(user);   

  const columns = [
    {
      title: "Sr.",
      dataIndex: "sr",
      key: "sr",
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: userType === "vendors"?"Vendor Name":"Rider Name",
      dataIndex: "name",
      key: "name",
      render: (_, user) => (
        <div>
          <span style={{ fontWeight: "bold" }}>
            {userType === "vendors"
              ? user.storename || `${user.firstname} ${user.lastname}`
              : `${user.firstname} ${user.lastname}`}
          </span>
          <br />
          <span style={{ color: "#888", fontSize: 12 }}>
            {userType === "vendors" ? user.address : user.address || "-"}
          </span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phonenumber",
      key: "phonenumber",
      render: (_, user) => `${user.prefix || ''} ${user.phonenumber}`,
    },
    {
      title: "Is Verified",
      dataIndex: "is_verified",
      key: "is_verified",
      render: (val) => {
        const badge = getBadgeStatus(val);
        return <Badge color={badge.color} text={badge.text} />;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, user) => (
        <Space>
          <Button type="link" onClick={() => handleView(user)} disabled={user.is_verified === 1}>
            View
          </Button>
          <Button type="link" danger onClick={() => handleReject(user)} disabled={user.is_verified === 1}>
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="pt-4">
      <h4>Unverified {userType== "vendors"?"Vendors":"Rider"}</h4>
      {/* <div className="mb-3">
        <Button
          type={userType === "vendors" ? "primary" : "default"}
          onClick={() => setUserType("vendors")}
          style={{ marginRight: 8 }}
        >
          Unverified Vendors
        </Button>
        <Button
          type={userType === "delivery_partners" ? "primary" : "default"}
          onClick={() => setUserType("delivery_partners")}
        >
          Unverified Delivery Partners
        </Button>
      </div> */}
      <div className="mb-2">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        rowKey={record => record.user_id}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
      {/* View Modal */}
      <Modal
        open={showViewModal}
        onCancel={handleCloseModal}
        title={null}
        closable={false}    // 👈 this will hide the top-right close button

        footer={
          <div style={{ textAlign: 'right', padding: '16px 0', background: '#fff' }}>
            <Button 
              onClick={handleCloseModal} 
              style={{ marginRight: 12, borderRadius: '8px', padding: '8px 20px' }}
            >
              Close
            </Button>
            <Button 
              type="primary" 
              onClick={() => handleApprove(selectedUser)}
              disabled={selectedUser?.is_verified === 1}
              style={{ marginRight: 12, borderRadius: '8px', padding: '8px 20px' }}
            >
              Approve
            </Button>
            <Button 
              danger 
              onClick={() => handleReject(selectedUser)}
              disabled={selectedUser?.is_verified === 2}
              style={{ borderRadius: '8px', padding: '8px 20px' }}
            >
              Reject
            </Button>
          </div>
        }
        centered
        width={window.innerWidth >= 1200 ? 900 : window.innerWidth >= 768 ? 700 : '98%'}
        zIndex={2000}
        style={{ zIndex: 3000 }}
        // bodyStyle={{ padding: 0, background: '#fff', overflow: 'hidden' }}
      >
        {selectedUser ? (
          <UserPreview user={selectedUser} userType={userType} loading={viewLoading} />
        ) : null}
      </Modal>
    </div>
  );
};

export default UnverifiedUsers;
