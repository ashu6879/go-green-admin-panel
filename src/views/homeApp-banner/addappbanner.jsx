import React, { useState } from "react";
import { Form, Input, Button, Switch, Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { addBanner } from "../../services/apiService";

const { Dragger } = Upload;

const AddBanner = ({ onSuccess, onCancel,fetchBanners }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFinish = async (values) => {
    if (!file) {
      message.error("Please upload a banner image.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("status", values.status ? 1 : 0);
    formData.append("banner_image", file);
    try {
      const result = await addBanner(formData);
      if (result.success) {

        setShowSuccess(true);
        form.resetFields();
        setPreviewImage(null);
        setFile(null);
        if (onSuccess) onSuccess();
      } else {
        message.error(result.error?.message || "Failed to add banner.");
      }
    } catch (err) {
      message.error("Failed to add banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file) => {
    setFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ status: true }}
      >
        <Form.Item
          label="Banner Title"
          name="title"
          rules={[{ required: true, message: "Please enter a banner title" }]}
        >
          <Input placeholder="Banner Title" />
        </Form.Item>
        <Form.Item label="Banner Image" required>
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
              handleImageChange(file);
              return false;
            }}
          >
            <p className="ant-upload-drag-icon">
              <PlusOutlined style={{ fontSize: 32 }} />
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
        <Form.Item label="Active" name="status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Banner
          </Button>
        </div>
      </Form>
      <Modal
        open={showSuccess}
        onCancel={() => setShowSuccess(false)}
        footer={null}
        centered
      >
        <div style={{ textAlign: 'center' }}>
          <h4>Banner Created Successfully</h4>
          <p>The banner has been added successfully!</p>
          <Button type="primary" onClick={() => { setShowSuccess(false); if (onSuccess) onSuccess(); }}>
            OK
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AddBanner;
