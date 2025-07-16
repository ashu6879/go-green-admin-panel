import React, { useState } from 'react'
import { Table, Input, Alert, Select, Button, Space, Tag } from 'antd';
import useOrder, { getOrderStatus } from './hooks/useOrder';
import useVendors from './hooks/useVendors';
import SingleOrder from './SingleOrder';

const Orders = () => {
  const {
    orders,
    total,
    page,
    limit,
    search,
    vendorId,
    loading,
    error,
    setPage,
    setLimit,
    setSearch,
    setVendorId,
  } = useOrder();
  const { vendors, loading: vendorsLoading } = useVendors();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: 'User',
      dataIndex: ['user', 'custom_id'],
      key: 'user',
      render: (_, record) => record.user?.custom_id || '-',
    },
    {
      title: 'Vendor',
      dataIndex: ['vendor', 'store_name'],
      key: 'vendor',
      render: (_, record) => record.vendor?.store_name || '-',
    },
    {
      title: 'Total Qty',
      dataIndex: 'total_quantity',
      key: 'total_quantity',
    },
    {
      title: 'Total Price',
      dataIndex: 'total_price',
      key: 'total_price',
    },
    {
      title: 'Payment',
      dataIndex: 'payment_method',
      key: 'payment_method',
    },
    {
      title: 'Status',
      dataIndex: 'order_status',
      key: 'order_status',
      render: (status) => {
        const s = getOrderStatus(status);
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => text ? new Date(text).toLocaleString() : '-',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => setSelectedOrder(record)}>
            View
          </Button>
        </Space>
      ),
    },
  ];

  if (selectedOrder) {
    return <SingleOrder order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div>
      <h2>Orders</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <Input.Search
          placeholder="Search orders"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onSearch={val => setSearch(val)}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          showSearch
          allowClear
          loading={vendorsLoading}
          placeholder="Filter by Vendor"
          value={vendorId || undefined}
          onChange={val => setVendorId(val || '')}
          style={{ width: 250 }}
          optionFilterProp="children"
        >
          {vendors.map(vendor => (
            <Select.Option key={vendor.custom_id} value={vendor.custom_id}>
              {vendor.store_name}
            </Select.Option>
          ))}
        </Select>
      </div>
      {error && <Alert type="error" message="Error loading orders" description={error.message || String(error)} showIcon style={{ marginBottom: 16 }} />}
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="order_id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          onChange: (page, pageSize) => {
            setPage(page);
            setLimit(pageSize);
          },
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
        }}
      />
    </div>
  );
}

export default Orders