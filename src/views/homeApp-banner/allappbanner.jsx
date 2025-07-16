import React from "react";
import { Table, Modal, Button, Form, Input, Select, Switch, Upload, message } from "antd";
import {  Pencil, Trash, Plus } from "react-bootstrap-icons";
import useBannerTable from "./bannerhook";
import AddBanner from "./addappbanner";

const { Option } = Select;
const { Dragger } = Upload;

const AllBanners = () => {
  const {
    banners,
    loading,
    error,
    pagination,
    show,
    selectedBanner,
    showDeleteModal,
    formState,
    previewImage,
    onTableChange,
    handleUpdate,
    handleDelete,
    handleClose,
    handleCloseDeleteModal,
    handleSave,
    confirmDelete,
    handleFormChange,
    handleImageChange,
    handleFeatureToggle,
    handleTodayDealToggle,
    handleStatusToggle, // <-- Add this handler in the hook
    fetchBanners, // <-- Add this to refresh after add
  } = useBannerTable();

  const [showAddModal, setShowAddModal] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Debounce search
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Handler to refresh banners after add
  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchBanners();
  };

  const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

  // Filter banners by title
  const filteredBanners = React.useMemo(() => {
    if (!debouncedSearch) return banners;
    return banners.filter(b => b.title && b.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [banners, debouncedSearch]);

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
    },
    {
      title: 'Banner Image',
      dataIndex: 'image_url',
      key: 'image_url',
      render: (img) =>
        img ? (
          <img
            src={`${BASE_URL}${img}`}
            alt="Banner"
            style={{ width: 250, height: 100, objectFit: "contain" }}
          />
        ) : (
          <span>No Image</span>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val, record) => (
        <Switch
          checked={val === 1}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={(checked) => handleStatusToggle(record, checked)}
        />
      ),
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="d-flex align-items-center">
          <Button
            type="text"
            icon={<Pencil className="text-primary" style={{  fontSize: 18 }} />}
            onClick={() => handleUpdate(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            type="text"
            icon={<Trash style={{ color: '#ff4d4f', fontSize: 18 }} />}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
      width: 100,
    },
  ];

  return (
    <div className="mt-4 col-md-6">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Banners</h5>
        <Button type="primary" icon={<Plus />} onClick={() => setShowAddModal(true)}>
          Add New
        </Button>
      </div>
      <div className="mb-2">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />
      </div>
      <div className="p-2 bg-white">
        <Table
          columns={columns}
          dataSource={filteredBanners}
          loading={loading}
          pagination={pagination}
          onChange={onTableChange}
          rowKey={record => record.id || record._id}
          scroll={{ x: 'max-content' }}
          size="small" // Reduce row height
          rowClassName={() => 'custom-row-small'} // Custom class for row height
        />
      </div>
      {/* Add Banner Modal */}
      <Modal
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        title="Add New Banner"
        footer={null}
        centered
        width={600}
      >
        <AddBanner onSuccess={handleAddSuccess} onCancel={() => setShowAddModal(false)} />
      </Modal>
      {/* Update Modal */}
      <Modal
        open={show}
        onCancel={handleClose}
        title="Update Banner"
        footer={null}
        centered
      >
            {selectedBanner && (
          <Form layout="vertical">
            <Form.Item label="Banner Title">
              <Input
                name="title"
                value={formState.title}
                onChange={handleFormChange}
              />
            </Form.Item>
            <Form.Item label="Banner Image">
              <Dragger
                name="file"
                accept="image/*"
                multiple={false}
                showUploadList={false}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('You can only upload image files!');
                    return Upload.LIST_IGNORE;
                  }
                  handleImageChange(file); // Use the hook's handler
                  return false; // Prevent auto upload
                }}
              >
                <p className="ant-upload-drag-icon">
                  {/* <InboxOutlined style={{ fontSize: 32 }} /> */}
                </p>
                <p className="ant-upload-text">Click or drag image to this area to upload</p>
                <p className="ant-upload-hint">Only image files are allowed.</p>
                  {previewImage && (
                    <div className="mt-2">
                    <img src={previewImage} alt="Banner Preview" className="img-thumbnail" width="120" />
                    </div>
                  )}
              </Dragger>
            </Form.Item>
            <Form.Item label="Active">
              <Switch
                checked={formState.status === 1}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                onChange={checked => handleFormChange({ target: { name: 'status', value: checked ? 1 : 0 } })}
              />
            </Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button onClick={handleClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
              <Button type="primary" onClick={handleSave}>
              Save Changes
            </Button>
            </div>
          </Form>
        )}
        </Modal>
      {/* Delete Modal */}
      <Modal
        open={showDeleteModal}
        onCancel={handleCloseDeleteModal}
        title="Confirm Deletion"
        onOk={confirmDelete}
        okText="Yes, Delete"
        cancelText="Cancel"
        centered
      >
        Are you sure you want to delete this banner?
      </Modal>
    </div>
  );
};

export default AllBanners;
