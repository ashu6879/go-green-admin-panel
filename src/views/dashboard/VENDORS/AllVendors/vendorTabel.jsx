import React from 'react';
import { Table, Input, Space, Avatar, Button } from 'antd';
import useVendors from './hooks/useVendors';

export default function VendorTable() {
  const {
    vendors,
    loading,
    search,
    page,
    pageSize,
    total,
    onSearch,
    onPageChange,
  } = useVendors();

  const columns = [
    {
      title: 'Image',
      dataIndex: 'storeImage',
      key: 'storeImage',
      render: (img) => <Avatar src={img} alt="store" />,
      width: 70,
    },
    {
      title: 'Store Name',
      dataIndex: 'storeName',
      key: 'storeName',
    },
    {
      title: 'Phone',
      dataIndex: 'Phone',
      key: 'Phone',
    },
    {
      title: 'Email',
      dataIndex: 'Email',
      key: 'Email',
    },
    {
      title: 'Address',
      dataIndex: 'Address',
      key: 'Address',
    },
    {
      title: 'Store ID',
      dataIndex: 'storeid',
      key: 'storeid',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button size="small" type="link">Edit</Button>
          <Button size="small" type="link" danger>Delete</Button>
        </Space>
      ),
      width: 120,
    },
  ];

  return (
    <div className='mt-4'>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search Store Name"
          value={search.storeName}
          onChange={e => onSearch('storeName', e.target.value)}
          allowClear
          style={{ width: 180 }}
        />
        <Input
          placeholder="Search Store ID"
          value={search.storeid}
          onChange={e => onSearch('storeid', e.target.value)}
          allowClear
          style={{ width: 180 }}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={vendors}
        loading={loading}
        rowKey="storeid"
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: onPageChange,
        }}
        scroll={{ x: 'max-content', y: 400 }} // Enable both horizontal and vertical scroll
        // bordered
      />
    </div>
  );
}
