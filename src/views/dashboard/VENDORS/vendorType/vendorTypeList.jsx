import React, { useState } from 'react';
import { Table, Button, Input, Badge, Modal, Form, Upload, Switch, Space } from 'antd';
import { PlusOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import useVendorType from './hooks/useVendorType';

const VendorTypeList = () => {
  const [tablePagination, setTablePagination] = useState({ current: 1, pageSize: 10 });
  const {
    loading,
    search,
    setSearch,
    handleSearch,
    // pagination,
    // handleTableChange,
    pagedData,
    filteredVendorTypes,
    total,
    openAddModal,
    closeAddModal,
    addModalOpen,
    handleAdd,
    formValues,
    setFormValues,
    handleIconDrop,
    openEditModal,
    closeEditModal,
    editModalOpen,
    handleEdit,
    editRecord,
    handleStatusSwitch,
  } = useVendorType();

  // Calculate paged data for current page
  const pageData = filteredVendorTypes.slice(
    (tablePagination.current - 1) * tablePagination.pageSize,
    tablePagination.current * tablePagination.pageSize
  );

  const columns = [
    {
      title: 'Sr No.',
      key: 'srno',
      width: 70,
      render: (_, __, index) => {
        // Calculate serial number based on current page and page size
        return (tablePagination.current - 1) * tablePagination.pageSize + index + 1;
      },
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: icon => icon ? <img src={icon} alt="icon" style={{ width: 32, height: 32, objectFit: 'contain' }} /> : null,
      width: 60,
    },
    {
      title: 'Type Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <span className={`badge ${status === 'active' ? 'badge-light-success' : 'badge-light-danger'}`}
          style={{ fontSize: 13, fontWeight: 500 }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space>
          <Switch
            checked={record.status === 'active'}
            onChange={() => handleStatusSwitch(record.id)}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
          />
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} size="small">Edit</Button>
        </Space>
      ),
    },
  ];

  // Drag & drop props for icon upload
  const uploadProps = {
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: file => {
      handleIconDrop(file);
      return false;
    },
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Vendor Types</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>Add Vendor Type</Button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <Input
          placeholder="Search by type name"
          value={search}
          onChange={e => { setSearch(e.target.value); handleSearch(e.target.value); }}
          allowClear
          style={{ width: 240 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={pageData}
        rowKey="id"
        loading={loading}
        bordered
        size="middle"
        pagination={{
          ...tablePagination,
          total: filteredVendorTypes.length,
          showSizeChanger: true,
          pageSizeOptions: [ '10', '20', '50'],
        }}
        onChange={(pagination) => setTablePagination(pagination)}
      />
      {/* Add Modal */}
      <Modal
        open={addModalOpen}
        onCancel={closeAddModal}
        onOk={handleAdd}
        title="Add Vendor Type"
        okText="Add"
        zIndex={2000}
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item label="Type Name" required>
            <Input
              value={formValues.name}
              onChange={e => setFormValues(fv => ({ ...fv, name: e.target.value }))}
              placeholder="Enter type name"
            />
          </Form.Item>
          <Form.Item label="Icon" required>
            <Upload.Dragger {...uploadProps} style={{ padding: 8 }}>
              {formValues.icon ? (
                <img src={formValues.icon} alt="icon" style={{ width: 48, height: 48, objectFit: 'contain', margin: 8 }} />
              ) : (
                <>
                <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
                {/* <p>Click or drag image to upload</p> */}
                </>
              )}
                              <p>Click or drag image to upload</p>

            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onCancel={closeEditModal}
        onOk={handleEdit}
        title="Edit Vendor Type"
        okText="Update"
        zIndex={2000}
        destroyOnClose
      >
        <Form layout="vertical">
          <Form.Item label="Type Name" required>
            <Input
              value={formValues.name}
              onChange={e => setFormValues(fv => ({ ...fv, name: e.target.value }))}
              placeholder="Enter type name"
            />
          </Form.Item>
          <Form.Item label="Icon" required>
            <Upload.Dragger {...uploadProps} style={{ padding: 8 }}>
              {/* <p className="ant-upload-drag-icon" style={{ marginBottom: 8 }}>
                <UploadOutlined style={{ fontSize: 32 }} />
              </p> */}
              {formValues.icon ? (
                <img src={formValues.icon} alt="icon" style={{ width: 48, height: 48, objectFit: 'contain', margin: 8 }} />
              ) : (
                <p className="ant-upload-drag-icon" >
                <UploadOutlined style={{ fontSize: 48 }} />
              </p> 
              )}
              <p>Click or drag image to upload</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item label="Status" required>
            <Switch
              checked={formValues.status === 'active'}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              onChange={checked => setFormValues(fv => ({ ...fv, status: checked ? 'active' : 'inactive' }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorTypeList;
