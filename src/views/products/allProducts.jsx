import React, { useState } from "react";
import { Pencil, Trash,Eye } from 'react-bootstrap-icons';
import { Modal, Button, Form, Card, Divider } from "antd";
import { Table, Select, Input, Row, Col, Switch, Button as AntButton, Drawer, Grid, Upload } from 'antd';
import { ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import useProductTable from './hooks/producthook';
import ProductPreview from './components/ProductPreview';
import FilterControls from './components/FilterControls';
import ProductUpdateModal from './components/ProductUpdateModal';
// import { Eye } from '@ant-design/icons';

const { useBreakpoint } = Grid;
const { Dragger } = Upload;

export const productTableColumns = (BASE_URL, handleUpdate, handleDelete, pagination, handleToggleFeatured, handleToggleTodayDeal, handlePreview) => [
  {
    title: '#',
    dataIndex: 'index',
    key: 'index',
    width: 50,
    render: (text, record, index) => (pagination.pageSize * (pagination.current - 1)) + index + 1,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    width: 220,
    render: (text, record) => (
      <div>
        <div style={{ fontWeight: 'bold' }}>{record.name}</div>
        {record.description && (
          <div style={{ fontSize: 12, color: '#888' }}>{record.description.length > 30 ? record.description.slice(0, 30) + '...' : record.description}</div>
        )}
      </div>
    ),
  },
  {
    title: 'Category Name',
    dataIndex: 'category_name',
    sorter: true,
    width: 140,
  },
  {
    title: 'Sub Category Name',
    dataIndex: 'sub_category_name',
    sorter: true,
    width: 140,
  },
  // {
  //   title: 'Manufacturer Details',
  //   dataIndex: 'manufacturer_details',
  //   width: 180,
  // },
  {
    title: 'Price',
    dataIndex: 'price',
    sorter: true,
    width: 100,
    render: (price, record) => {
      const hasDiscount = record.discount_percent > 0 && record.discounted_value && Number(record.discounted_value) < Number(price);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{
            color: '#52c41a',
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: 1
          }}>
            ₹{hasDiscount ? record.discounted_value : price}
          </span>
          {hasDiscount && (
            <span>
              <span style={{
                color: '#999',
                textDecoration: 'line-through',
                fontSize: '13px',
                marginTop: 2
              }}>
                ₹{price}
              </span>
              <span style={{
                color: '#ff4d4f',
                fontSize: '12px',
                fontWeight: 600,
                marginLeft: 6
              }}>
                ({record.discount_percent}% off)
              </span>
            </span>
          )}
        </div>
      );
    }
  },
  {
    title: 'Stock',
    dataIndex: 'stock',
    sorter: true,
    width: 100,
  },
  {
    title: 'Featured',
    dataIndex: 'is_featured',
    render: (val, record) => (
      <Switch checked={val === 1}  style={{ backgroundColor: val === 1 ? '#088B46' : undefined }} onChange={(checked) => handleToggleFeatured(record.id, checked ? 1 : 0)} />
    ),
    sorter: true,
    width: 100,
  },
  {
    title: 'Today Deal',
    dataIndex: 'is_today_deal',
    render: (val, record) => (
      <Switch checked={val === 1}  style={{ backgroundColor: val === 1 ? '#088B46' : undefined }} onChange={(checked) => handleToggleTodayDeal(record.id, checked ? 1 : 0)} />
    ),
    sorter: true,
    width: 110,
  },
  {
    title: 'Featured Image',
    dataIndex: 'featured_image',
    render: (img) => img ? <img src={`${BASE_URL}${img}`} alt="Product" width="50" height="50" /> : 'No Image',
    width: 110,
  },
  // {
  //   title: 'Gallery Image',
  //   dataIndex: 'gallery_images',
  //   render: (images) => images && images.length > 0 ? images.map((image, idx) => (
  //                       <img
  //                         key={idx}
  //                         src={`${BASE_URL}${image.image_path}`}
  //                         alt={`Gallery ${idx + 1}`}
  //                         width="50"
  //                         height="50"
  //                         style={{ marginRight: "5px" }}
  //                       />
  //   )) : <span>No Images</span>,
  // },
  {
    title: 'Action',
    key: 'action',
    width: 120,
    render: (_, record) => (
      <div className="d-flex align-items-center">
        <Button type="text" icon={<Eye style={{ color: '#52c41a', fontSize: 18 }} />} onClick={() => handlePreview(record)} style={{ marginRight: 8 }} />
        <Button type="text" icon={<Pencil className="text-primary" style={{ fontSize: 18 }} />} onClick={() => handleUpdate(record)} style={{ marginRight: 8 }} />
        <Button type="text" icon={<Trash style={{ color: '#ff4d4f', fontSize: 18 }} />} onClick={() => handleDelete(record)} />
      </div>
    ),
  },
];

const ProductList = () => {
  const {
    nameFilter, setNameFilter,
    categoryFilter, setCategoryFilter,
    subCategoryFilter, setSubCategoryFilter,
    isFeaturedFilter, setIsFeaturedFilter,
    isTodayDealFilter, setIsTodayDealFilter,
    data, loading, pagination, onTableChange, error,
    show, selectedUser, showDeleteModal, formState, categories, brands, subCategories, previewImage, previewImages,
    handleUpdate, handleDelete, handleClose, handleCloseDeleteModal, handleSave, confirmDelete, handleFormChange,
    handleImageChange, handleGalleryImagesChange, handleDeleteFeaturedImage, handleDeleteGalleryImage,
    handleToggleFeatured, handleToggleTodayDeal,
  } = useProductTable();

  const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  const screens = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Preview modal state
  const [previewProduct, setPreviewProduct] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = (product) => {
    setPreviewProduct(product);
    setShowPreview(true);
  };
  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewProduct(null);
  };

  const columns = productTableColumns(BASE_URL, handleUpdate, handleDelete, pagination, handleToggleFeatured, handleToggleTodayDeal, handlePreview);

  const handleResetFilters = () => {
    setNameFilter("");
    setCategoryFilter([]);
    setSubCategoryFilter([]);
    setIsFeaturedFilter(undefined);
    setIsTodayDealFilter(undefined);
  };

  return (
    <div className="mt-4 container-p0">
      <div className="mb-3 p-2 bg-white">
      {/* filters */}
        {screens.md ? (
          <FilterControls
            nameFilter={nameFilter}
            setNameFilter={setNameFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            subCategoryFilter={subCategoryFilter}
            setSubCategoryFilter={setSubCategoryFilter}
            isFeaturedFilter={isFeaturedFilter}
            setIsFeaturedFilter={setIsFeaturedFilter}
            isTodayDealFilter={isTodayDealFilter}
            setIsTodayDealFilter={setIsTodayDealFilter}
            categories={categories}
            subCategories={subCategories}
            handleResetFilters={handleResetFilters}
          />
        ) : (
          <>
            <AntButton icon={<FilterOutlined />} onClick={() => setDrawerOpen(true)}>
              Filter
            </AntButton>
            <Drawer
              title="Filters"
              placement="right"
              onClose={() => setDrawerOpen(false)}
              open={drawerOpen}
              width={320}
              zIndex={2000}
            >
              <FilterControls
                nameFilter={nameFilter}
                setNameFilter={setNameFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                subCategoryFilter={subCategoryFilter}
                setSubCategoryFilter={setSubCategoryFilter}
                isFeaturedFilter={isFeaturedFilter}
                setIsFeaturedFilter={setIsFeaturedFilter}
                isTodayDealFilter={isTodayDealFilter}
                setIsTodayDealFilter={setIsTodayDealFilter}
                categories={categories}
                subCategories={subCategories}
                handleResetFilters={handleResetFilters}
                vertical
              />
              <AntButton type="primary" block style={{ marginTop: 16 }} onClick={() => setDrawerOpen(false)}>
                Apply Filters
              </AntButton>
            </Drawer>
          </>
        )}
      </div>

      <div className="p-2 bg-white">
      {/* tabel */}
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={onTableChange}
          rowKey={record => record.id || record._id}
          scroll={{ x: 'max-content' }}
        />
        </div>
      {/* Update Modal */}
      <ProductUpdateModal
        open={show}
        onClose={handleClose}
        onSave={handleSave}
        formState={formState}
        handleFormChange={handleFormChange}
        handleImageChange={handleImageChange}
        handleGalleryImagesChange={handleGalleryImagesChange}
        handleDeleteFeaturedImage={handleDeleteFeaturedImage}
        handleDeleteGalleryImage={handleDeleteGalleryImage}
        previewImage={previewImage}
        previewImages={previewImages}
        categories={categories}
        brands={brands}
        subCategories={subCategories}
        loading={loading}
      />
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
        Are you sure you want to delete this product?
      </Modal>
      {/* Product Preview Modal */}
      <ProductPreview
        open={showPreview}
        onClose={handleClosePreview}
        product={previewProduct}
        BASE_URL={BASE_URL}
      />
    </div>
  );
};

export default ProductList;
