import React, { useState, useEffect } from "react";
import { Card, Row, Col, Modal, Button as BsButton } from "react-bootstrap";
import { Form, Input, Select, Upload, Button, Space, message, Checkbox, Switch } from "antd";
import { PlusOutlined, MinusCircleOutlined, UploadOutlined, DollarOutlined } from "@ant-design/icons";
import { getAllCategories, getAllSubCategoriesbyID, productfetchBrands, addProduct, getProductById } from "../../../services/apiService";
// import useAddProductHook from "./hooks/useAddProductHook";
import ProductVariants from "../components/ProductVariants";
// import InputWithSuggestions from "./components/InputWithSuggestions";
import { unitOptions, quantityOptions } from "../components/options";
import Addons from "../components/Addons";
import { useParams } from "react-router-dom";
// import useUpdateProduct from "./hooks/useUpdateProduct";
import { formatPrice } from "../../../services/utils/gen_utility";
import "../../../assets/scss/pages/uploder_override.scss"
import useUpdateProduct from "./hooks/useUpdateProduct";
const { Option } = Select;
const { Dragger } = Upload;




const UpdateProduct = () => {                   
  const [form] = Form.useForm();



  const { id } = useParams(); // ✅ even better
 const [productdata, setProductdata] = useState(null);
     useEffect(() => {
      const fetchProduct = async () => {
        console.log("id",id)
        const response = await getProductById(id);
        console.log("response",response)
        if (response.success) {
          const product = response.product;
          setProductdata(product);     
          handleCategoryChange(product?.category_id,false);
        }
      };
      fetchProduct();
     },[id])




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
    // New for variants
    hasVariants,
    setHasVariants,
    hasAddOns,
    setHasAddOns,
    variants,
    addVariant,
    removeVariant,
    updateVariant,
    addAddOn,
    removeAddOn,
    updateAddOn,
    editingVariantIdx,
    newVariantDraft,
    setNewVariantDraft,
    startEditVariant,
    saveEditVariant,
    cancelEditVariant,
    saveNewVariant,
    addons,
    setAddons,
    editingAddonIdx,
    setEditingAddonIdx,
    newAddonDraft,
    setNewAddonDraft,
    startEditAddon,
    saveEditAddon,
    cancelEditAddon,
    saveNewAddon,
    removeAddon,
    updateAddon,
    productImage,
    handleImageChange,
    selectedUnit,
    setSelectedUnit,
    normFile,
    handleUnitChange, validateFileUpload,uploadProps,discountPercent, setDiscountPercent
  } = useUpdateProduct(form,productdata);

  // Add common unit options
  // Add common quantity options

  // Track selected unit for dynamic quantity suggestions

  // Track discount percent for preview and logic

 



  return (
    <div className="p2 d-flex justify-content-center">
      <div style={{ width: '100%', maxWidth: 700 }}>
        <Card className="borderless w-100">
          <Card.Body>
            <h4 className="mb-3 f-w-400 text-center">Update Product</h4>
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
                    name={"vendor"}
                    disabled
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
                    // rules={[{ required: true, message: "Please select a brand" }]}
                  >
                    <Select placeholder="Select Brand" showSearch optionFilterProp="children">
                      {brands.map((brand) => (
                        <Option key={brand.id} value={brand.id}>{brand.name}</Option>
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
                    // rules={[{ required: true, message: "Please select a subcategory" }]}
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
                    style={{marginBottom: 0}}

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
                        // multiple={false} // Allow only single file upload

                        fileList={productImage} // 👈 External fileList
                        onChange={handleImageChange}
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
                      {/* <div 
                        style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 8, 
                          marginTop: 8,
                          minHeight: 60
                        }}
                        className="upload-preview-container"
                      >
                      </div> */}
                    </div>
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                  style={{marginBottom: 0}}
                    label={`Gallery Images (${galleryImages.length}/5)`}
                    required
                  >
                    <Dragger
  {...galleryDraggerProps}
  fileList={galleryImages}
  onChange={handleGalleryDraggerChange}
>
                      <p className="ant-upload-drag-icon">
                        <UploadOutlined />
                      </p>
                      <p className="ant-upload-text">
                        {galleryImages.length >= 5
                          ? 'Maximum 5 images reached.'
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

               




               
              
                {/* Variants Section */}
                <Col md={24} xs={24}> 
                
                <div style={{ display: 'flex', alignItems: 'flex-start', padding: '8px 0' }}>
                            <Form.Item name="has_variants" valuePropName="checked" style={{ margin: 0, marginRight: 12 }}>
                              <Checkbox 
                                checked={hasVariants || hasAddOns}
                                onChange={(e) => {setHasVariants(e.target.checked); setHasAddOns(e.target.checked)}}
                              />
                            </Form.Item>
                            <div>
                              <div style={{ fontWeight: 500, marginBottom: 4 }}>is this product is rasturant product or having variants and addons? </div>
                              <div style={{ fontSize: 12, color: '#666' }}>If you want to add variants and addons for this product</div>
                            </div>
                          </div>
                            </Col>
                {hasVariants && (
                  <Col md={24} xs={24}>
                    <ProductVariants
                      variants={variants}
                      editingVariantIdx={editingVariantIdx}
                      newVariantDraft={newVariantDraft}
                      setNewVariantDraft={setNewVariantDraft}
                      startEditVariant={startEditVariant}
                      saveEditVariant={saveEditVariant}
                      cancelEditVariant={cancelEditVariant}
                      saveNewVariant={saveNewVariant}
                      removeVariant={removeVariant}
                      productPrice={form.getFieldValue('price')}
                      productDiscountPrice={form.getFieldValue('discount_price')}
                    />
                  </Col>
                )}
               
{hasAddOns && (
  <Col md={24} xs={24}>
    <Addons
      addons={addons}
      editingAddonIdx={editingAddonIdx}
      newAddonDraft={newAddonDraft}
      setNewAddonDraft={setNewAddonDraft}
      startEditAddon={startEditAddon}
      saveEditAddon={saveEditAddon}
      cancelEditAddon={cancelEditAddon}
      saveNewAddon={saveNewAddon}
      removeAddon={removeAddon}
    />
  </Col>
)}
{hasVariants && (
  <Col md={6} xs={24}>
    <Form.Item
      label="Is this product available"
      name="is_available"
      valuePropName="checked"
      initialValue={false}
    >
      <Switch
        checkedChildren="Yes"
        unCheckedChildren="No"
      />
    </Form.Item>
  </Col>
)}
                {/* Unit/Quantity fields */}
                {!hasVariants && (
                  <>
                     <Col md={6} xs={24}>
                  <Form.Item
                    label="Product Price"
                    name="price"
                    rules={[{ required: true, message: "Please enter product price" }]}
                  >
                    <Input 
                      type="number" 
                      placeholder="0.00"
                      prefix={<DollarOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                      onChange={e => {
                        const price = Number(e.target.value);
                        const discount = Number(form.getFieldValue('discount_price'));
                        form.setFieldsValue({ price: price });
                        if (discount && discount > price) {
                          form.setFieldsValue({ discount_price: price });
                        }
                        const percent = price && discount && discount <= price ? Math.round(((price - discount) / price) * 100) : 0;
                        setDiscountPercent(percent);
                      }} 
                    />
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                    label="Discount Price"
                    name="discount_price"
                    rules={[{ required: true, message: "Please enter discount price" }]}
                  >
                    <Input type="number" placeholder="Discount Price" onChange={e => {
                      const discount = Number(e.target.value);
                      const price = Number(form.getFieldValue('price'));
                      if (discount > price) {
                        form.setFieldsValue({ discount_price: price });
                        setDiscountPercent(0);
                        return;
                      }
                      form.setFieldsValue({ discount_price: discount });
                      const percent = price && discount && discount <= price ? Math.round(((price - discount) / price) * 100) : 0;
                      setDiscountPercent(percent);
                    }} />
                  </Form.Item>
                </Col>
                {/* Price Preview Section */}
                <Col md={12} xs={24}>
                  <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>Price Preview:</span>
                    {[1].map(idx => {
                      const price = Number(form.getFieldValue('price'));
                      const discount = Number(form.getFieldValue('discount_price'));
                      const percent = price && discount && discount <= price ? Math.round(((price - discount) / price) * 100) : 0;
                      return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ textDecoration: 'line-through', color: '#888' }}>
                            {price ? formatPrice(price) : '$0.00'}
                          </span>
                          <span style={{ color: '#52c41a', fontWeight: 600, fontSize: 16 }}>
                            {discount && discount <= price ? formatPrice(discount) : '$0.00'}
                          </span>
                          {percent > 0 && (
                            <span style={{ color: '#ff4d4f', fontSize: 12, background: '#fff2f0', padding: '2px 6px', borderRadius: 10 }}>
                              Save {percent}%
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Col>
                    <Col md={6} xs={24}>
                      <Form.Item
                        label="Unit"
                        name="unit"
                        rules={[{ required: true, message: "Please select a unit" }]}
                      >
                        <Select
                          showSearch
                          placeholder="Select a unit (e.g. kg, pcs)"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase()) ||
                            option.value.toLowerCase().includes(input.toLowerCase())
                          }
                          onChange={(value) => {
                            setSelectedUnit(value);
                            handleUnitChange(value);
                            form.setFieldsValue({ quantity: "" }); // Clear quantity when unit changes
                          }}
                          style={{ width: '100%' }}
                        >
                          {unitOptions.map((unit) => (
                            <Select.Option key={unit.value} value={unit.value}>
                              {unit.label} ({unit.value})
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col md={6} xs={24}>
                      <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[{ required: true, message: "Please enter quantity" }]}
                      >
                        <Input
                          type="number"
                          placeholder="0"
                          addonAfter={selectedUnit || ''}
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col md={6} xs={24}>
                  <Form.Item
                    label="Stock Quantity"
                    name="stock"
                    rules={[{ required: true, message: "Please enter stock quantity" }]}
                  >
                    <Input type="number" min={0} placeholder="Available stock" />
                  </Form.Item>
                </Col>
                  </>
                )}


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
                    Update Product
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
          <Modal.Title>Product Updated Successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The Product has been updated successfully!</p>
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

export default UpdateProduct;
