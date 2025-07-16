import React, { useState, useEffect } from "react";
import { Card, Row, Col, Modal, Button as BsButton } from "react-bootstrap";
import { Form, Input, Select, Upload, Button, Space, message, Switch } from "antd";
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { getAllCategories, getAllSubCategoriesbyID, productfetchBrands, addProduct } from "../../services/apiService";
import useAddProductHook from "./hooks/useAddProductHook";
// import useAddProductHook from "./hooks/useAddProductHook";

const { Option } = Select;
const { Dragger } = Upload;

const ProductRegistration = () => {
  const [form] = Form.useForm();
  // Use the custom hook for all logic/state
  const {
    categories,
    brands,
    subCategories,
    vendors,
    selectedVendor,
    setSelectedVendor,
    handleVendorChange,
    showModal,
    setShowModal,
    loading,
    galleryImages,
    galleryPreviews,
    handleCategoryChange,
    handleGalleryDraggerChange,
    handleRemoveGalleryImage,
    galleryDraggerProps,
    handleFinish,
  } = useAddProductHook(form);

  // Add custom CSS for upload preview layout
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .ant-upload-list {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
        margin-top: 8px !important;
      }
      .ant-upload-list-item {
        width: auto !important;
        height: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        background: none !important;
      }
      .ant-upload-list-item-container {
        width: auto !important;
        height: auto !important;
      }
      .upload-preview-container .ant-upload-list {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getAllCategories();
      if (response.success) setCategories(response.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      const response = await productfetchBrands();
      if (response.success) setBrands(response.data);
    };
    fetchBrands();
  }, []);

  // Upload handlers
  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  // Custom validation for file uploads
  const validateFileUpload = (rule, value) => {
    console.log('Validating file upload:', value); // Debug log
    if (!value || value.length === 0) {
      return Promise.reject(new Error(rule.message));
    }
    // Check if files have originFileObj (actual files)
    const hasValidFiles = value.some(file => file.originFileObj || file.url);
    if (!hasValidFiles) {
      return Promise.reject(new Error(rule.message));
    }
    return Promise.resolve();
  };

  // Custom upload props for preview
  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: (info) => {
      console.log('Product image onChange:', info.fileList); // Debug log
      // Handle preview
      if (info.fileList) {
        info.fileList.forEach(file => {
          if (file.originFileObj && !file.url) {
            file.url = URL.createObjectURL(file.originFileObj);
          }
        });
      }
      // Update form field value
      form.setFieldsValue({ product_image: info.fileList });
      // Trigger form validation
      setTimeout(() => {
        form.validateFields(['product_image']);
      }, 100);
    },
    onPreview: (file) => {
      if (file.url) {
        window.open(file.url);
      }
    },
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
    itemRender: (originNode, file, fileList, actions) => {
      return (
        <div style={{ 
          display: 'inline-flex', 
          position: 'relative', 
          margin: '4px',
          flexShrink: 0
        }}>
          <img 
            src={file.url || file.thumbUrl} 
            alt={file.name}
            style={{ 
              width: 50, 
              height: 50, 
              objectFit: 'cover', 
              borderRadius: 4,
              border: '1px solid #d9d9d9',
              display: 'block'
            }}
          />
          <div 
            style={{
              position: 'absolute',
              top: -5,
              right: -5,
              background: '#ff4d4f',
              color: 'white',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '12px',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              zIndex: 1
            }}
            onClick={() => {
              actions.remove();
              // Update form field value after removal
              const currentFiles = form.getFieldValue('product_image') || [];
              const updatedFiles = currentFiles.filter(f => f.uid !== file.uid);
              form.setFieldsValue({ product_image: updatedFiles });
              // Trigger validation after removal
              setTimeout(() => {
                form.validateFields(['product_image']);
              }, 100);
            }}
          >
            ×
          </div>
        </div>
      );
    }
  };

  return (
    <div className="pt-4 d-flex justify-content-center">
      <div style={{ width: '100%', maxWidth: 700 }}>
        <Card className="borderless w-100">
          <Card.Body>
            <h4 className="mb-3 f-w-400 text-center">Add Product</h4>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              autoComplete="off"
            >
              <Row gutter={16}>
                <Col md={24} xs={24}>
                  <Form.Item
                    label="Vendor"
                    required
                  >
                    <Select
                      placeholder="Select Vendor"
                      value={selectedVendor}
                      onChange={handleVendorChange}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      onClear={() => handleVendorChange(null)}
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      style={{ width: '100%' }}
                    >
                      {vendors.map((vendor) => (
                        <Option key={vendor.id} value={vendor.id}>{vendor.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                    label="Brand Name"
                    name="product_brand"
                    rules={[{ required: true, message: "Please select a brand" }]}
                  >
                    <Select placeholder="Select Brand" showSearch optionFilterProp="children">
                      {brands.map((brand) => (
                        <Option key={brand.id} value={String(brand.id)}>{brand.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                    label="Product Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter product name" }]}
                  >
                    <Input placeholder="Product Name" />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Product Description"
                    name="description"
                    rules={[{ required: true, message: "Please enter product description" }]}
                  >
                    <Input.TextArea rows={3} placeholder="Product Description" />
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: "Please select a category" }]}
                  >
                    <Select
                      placeholder="Select Category"
                      showSearch
                      optionFilterProp="children"
                      onChange={handleCategoryChange}
                    >
                      {categories.map((cat) => (
                        <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                    label="Subcategory"
                    name="sub_category"
                    rules={[{ required: true, message: "Please select a subcategory" }]}
                  >
                    <Select placeholder="Select Subcategory" showSearch optionFilterProp="children">
                      {subCategories.map((sub) => (
                        <Option key={sub.id} value={sub.id}>{sub.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                    label="Product Image"
                    name="product_image"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ 
                      required: true, 
                      validator: validateFileUpload,
                      message: "Please upload a product image" 
                    }]}
                  >
                    <div style={{ width: '100%' }}>
                      <Dragger
                        name="product_image"
                        maxCount={1}
                        accept="image/*"
                        {...uploadProps}
                        style={{ 
                          width: '100%',
                          minHeight: 120,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <p className="ant-upload-drag-icon">
                          <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag image to upload</p>
                        <p className="ant-upload-hint">Max file size: 5MB</p>
                      </Dragger>
                      <div 
                        style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 8, 
                          marginTop: 8,
                          minHeight: 60
                        }}
                        className="upload-preview-container"
                      >
                        {/* Preview images will be rendered here */}
                      </div>
                    </div>
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                    label={`Gallery Images (${galleryImages.length}/5)`}
                    required
                  >
                    <Dragger {...galleryDraggerProps}>
                      <p className="ant-upload-drag-icon">
                        <UploadOutlined />
                      </p>
                      <p className="ant-upload-text">
                        {galleryImages.length >= 5
                          ? 'Maximum 5 images reached. Remove some images to add more.'
                          : 'Click or drag images to upload'}
                      </p>
                      <p className="ant-upload-hint">
                        {galleryImages.length >= 5
                          ? 'Remove images to enable upload'
                          : 'Max 5 images, 5MB each'}
                      </p>
                    </Dragger>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 60, marginTop: 8 }}>
                      {galleryPreviews.map((url, idx) => (
                        <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                          <img src={url} alt={`Gallery Preview ${idx + 1}`} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, border: '1px solid #d9d9d9' }} />
                          <Button
                            type="text"
                            style={{ position: 'absolute', top: -5, right: -5, background: '#ff4d4f', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px', border: '2px solid white', zIndex: 1, padding: 0 }}
                            onClick={() => handleRemoveGalleryImage(idx)}
                          >×</Button>
                        </div>
                      ))}
                    </div>
                    {galleryImages.length >= 5 && (
                      <div style={{ color: '#ff4d4f', fontSize: 12, marginTop: 4 }}>Maximum 5 images allowed.</div>
                    )}
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                    label="Product Price"
                    name="price"
                    rules={[{ required: true, message: "Please enter product price" }]}
                  >
                    <Input type="number" placeholder="Product Price" />
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                    label="Discount Price"
                    name="discount_price"
                    rules={[{ required: true, message: "Please enter discount price" }]}
                  >
                    <Input type="number" placeholder="Discount Price" />
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                    label="Unit"
                    name="unit"
                    rules={[{ required: true, message: "Please enter unit" }]}
                  >
                    <Input placeholder="Unit (e.g. kg, pcs)" />
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[{ required: true, message: "Please enter quantity" }]}
                  >
                    <Input type="number" placeholder="Quantity" />
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                    label="Fast Delivery Available"
                    name="fast_delivery_available"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Switch checkedChildren="Yes" unCheckedChildren="No" />
                  </Form.Item>
                </Col>
                <Col md={24} xs={24}>
                  <Form.List name="attributes">
                    {(fields, { add, remove }) => (
                      <>
                        <label>Additional Details (Attributes)</label>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item
                              {...restField}
                              name={[name, 'key']}
                              rules={[{ required: true, message: 'Key required' }]}
                            >
                              <Input placeholder="Key" />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'value']}
                              rules={[{ required: true, message: 'Value required' }]}
                            >
                              <Input placeholder="Value" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add Attribute
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Col>
                <Col md={24} className="text-center">
                  <Button type="primary" htmlType="submit" loading={loading} style={{ width: 200 }}>
                    Add Product
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </div>
      {/* Success Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Product Created Successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The Product has been added successfully!</p>
        </Modal.Body>
        <Modal.Footer>
          <BsButton variant="success" onClick={() => setShowModal(false)}>
            OK
          </BsButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductRegistration;
