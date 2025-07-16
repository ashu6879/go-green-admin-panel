import React from 'react';
import { Modal, Button, Form, Card, Divider, Input, Select } from 'antd';
import { Upload } from 'antd';
const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const { Dragger } = Upload;

const ProductUpdateModal = ({
  open,
  onClose,
  onSave,
  formState,
  handleFormChange,
  handleImageChange,
  handleGalleryImagesChange,
  handleDeleteFeaturedImage,
  handleDeleteGalleryImage,
  previewImage,
  previewImages,
  categories,
  brands,
  subCategories,
  loading
}) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Update Product"
      centered
      width={window.innerWidth > 1200 ? 1000 : 700}
      zIndex={2000}
      bodyStyle={{ maxHeight: 600, minHeight: 400, overflowY: 'auto', paddingBottom: 70 }}
      style={{ top: 40 }}
      footer={[
        <Button key="cancel" onClick={onClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={onSave} loading={loading}>
          Save Changes
        </Button>
      ]}
    >
      {formState && (
        <Card bordered={false} style={{ boxShadow: '0 2px 8px #f0f1f2', borderRadius: 12, margin: 0 }}>
          <Form layout="vertical">
            <Divider orientation="left">Basic Info</Divider>
            <div className="row">
              <div className="col-md-6">
                <Form.Item label="Name">
                  <Input type="text" name="name" value={formState.name || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Subtitle">
                  <Input type="text" name="subtitle" value={formState.subtitle || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Category">
                  <Select
                    name="category_id"
                    value={formState.category_id || ''}
                    onChange={value => handleFormChange({ target: { name: 'category_id', value } })}
                  >
                    <Select.Option value="">-- Select Category --</Select.Option>
                    {categories.map((cat) => (
                      <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Product Brand">
                  <Select
                    name="brand_id"
                    value={formState.brand_id || ''}
                    onChange={value => handleFormChange({ target: { name: 'brand_id', value } })}
                  >
                    <Select.Option value="">-- Select Brand --</Select.Option>
                    {brands.map((brand) => (
                      <Select.Option key={brand.id} value={brand.id}>{brand.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Sub-Category">
                  <Select
                    name="sub_category"
                    value={formState.sub_category || ''}
                    onChange={value => handleFormChange({ target: { name: 'sub_category', value } })}
                  >
                    <Select.Option value="">-- Select Sub-Category --</Select.Option>
                    {subCategories.filter(sub => String(sub.category_id) === String(formState.category_id)).map((sub) => (
                      <Select.Option key={sub.id} value={sub.id}>{sub.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Price ($)">
                  <Input type="number" name="price" value={formState.price || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Product Size">
                  <Input type="number" name="size" value={formState.size || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Fast Delivery">
                  <Select
                    name="fast_delivery_available"
                    value={formState.fast_delivery_available || ''}
                    onChange={value => handleFormChange({ target: { name: 'fast_delivery_available', value } })}
                  >
                    <Select.Option value="1">Yes</Select.Option>
                    <Select.Option value="0">No</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Stock Quantity">
                  <Input type="number" name="stock" value={formState.stock || ''} onChange={handleFormChange} />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item label="Title">
                  <Input type="text" name="title" value={formState.title || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Key Feature Title">
                  <Input type="text" name="feature_title" value={formState.feature_title || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Description">
                  <Input.TextArea rows={2} name="description" value={formState.description || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Key feature Description">
                  <Input.TextArea rows={2} name="feature_description" value={formState.feature_description || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Manufacturer Details">
                  <Input.TextArea rows={2} name="manufacturer_details" value={formState.manufacturer_details || ''} onChange={handleFormChange} />
                </Form.Item>
                <Divider orientation="left">Product Images</Divider>
                <Form.Item label="Product Image">
                  <Dragger
                    name="file"
                    accept="image/*"
                    multiple={false}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleImageChange({ target: { files: [file] } });
                      return false;
                    }}
                  >
                    <p className="ant-upload-drag-icon">Drag & Drop or Click to Upload</p>
                    {previewImage || formState.featured_image ? (
                      <div className="mt-2 position-relative d-inline-block">
                        <img src={previewImage || BASE_URL+formState.featured_image} alt="Product Preview" className="img-thumbnail" width="80" height="80" />
                        <Button type="text" className="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle" style={{ fontSize: "10px", lineHeight: "1"}} onClick={handleDeleteFeaturedImage}>✖</Button>
                      </div>
                    ) : null}
                  </Dragger>
                </Form.Item>
                <Form.Item label="Gallery Images">
                  <Dragger
                    name="gallery"
                    accept="image/*"
                    multiple={true}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleGalleryImagesChange({ target: { files: [file] } });
                      return false;
                    }}
                  >
                    <p className="ant-upload-drag-icon">Drag & Drop or Click to Upload Gallery Images</p>
                    <div className="mt-2 d-flex flex-wrap">
                      {(formState.gallery_images || []).map((img, index) => {
                        let imageUrl = '';
                        // console.log(img);
                        
                        if (img instanceof File) {
                          imageUrl = previewImages[index];
                        } else if (typeof img === 'string') {
                          imageUrl = img;
                        } else if (img && img.image_path) {
                          imageUrl = BASE_URL+img.image_path;
                        }
                        return (
                          <div key={index} className="position-relative m-1">
                            <img src={imageUrl} alt={`Gallery Preview ${index + 1}`} className="img-thumbnail" width="80" height="80" />
                            <Button type="text" className="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle" style={{ fontSize: "10px", lineHeight: "1"}} onClick={() => handleDeleteGalleryImage(index)}>✖</Button>
                          </div>
                        );
                      })}
                    </div>
                  </Dragger>
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
      )}
    </Modal>
  );
};

export default ProductUpdateModal; 