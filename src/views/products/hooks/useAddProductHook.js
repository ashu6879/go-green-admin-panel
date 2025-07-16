import { useState, useEffect } from "react";
import { message } from "antd";
import { getAllCategories, getAllSubCategoriesbyID, productfetchBrands, addProduct, getAllVendors } from "../../../services/apiService";
// import { getAllCategories, getAllSubCategoriesbyID, productfetchBrands, addProduct } from "../../services/apiService";

export default function useAddProductHook(form) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // Gallery image state
  const [galleryImages, setGalleryImages] = useState([]); // File[]
  const [galleryPreviews, setGalleryPreviews] = useState([]); // string[]
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    getAllCategories().then((response) => {
      if (response.success) setCategories(response.data);
    });
    productfetchBrands().then((response) => {
      if (response.success) setBrands(response.data);
    });
    getAllVendors().then((response) => {
      if (response.success && Array.isArray(response.data)) {
        setVendors(response.data.map(v => ({ id: v.vendor_id, name: v.store_name })));
      }
    });
  }, []);

  // Fetch subcategories when category changes
  const handleCategoryChange = async (catId) => {
    form.setFieldsValue({ sub_category: undefined });
    if (catId) {
      const response = await getAllSubCategoriesbyID(catId);
      if (response.success) setSubCategories(response.data);
      else setSubCategories([]);
    } else {
      setSubCategories([]);
    }
  };

  // Gallery image handlers
  const handleGalleryDraggerChange = (info) => {
    let files = info.fileList.map(f => f.originFileObj).filter(Boolean);
    const current = galleryImages;
    const total = current.length + files.length;
    let allowedFiles = files;
    if (total > 5) {
      allowedFiles = files.slice(0, 5 - current.length);
    }
    const newPreviews = allowedFiles.map(file => URL.createObjectURL(file));
    setGalleryImages([...current, ...allowedFiles].slice(0, 5));
    setGalleryPreviews([...galleryPreviews, ...newPreviews].slice(0, 5));
  };
  const handleRemoveGalleryImage = (idx) => {
    const newImages = [...galleryImages];
    const newPreviews = [...galleryPreviews];
    newImages.splice(idx, 1);
    newPreviews.splice(idx, 1);
    setGalleryImages(newImages);
    setGalleryPreviews(newPreviews);
  };
  // Dragger props for gallery
  const galleryDraggerProps = {
    multiple: true,
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file) => {
      if (galleryImages.length >= 5) {
        message.warning('Maximum 5 images allowed.');
        return false;
      }
      return false; // Prevent auto upload
    },
    customRequest: () => {}, // Prevent upload
    onChange: handleGalleryDraggerChange,
    disabled: galleryImages.length >= 5,
    style: {
      opacity: galleryImages.length >= 5 ? 0.5 : 1,
      cursor: galleryImages.length >= 5 ? 'not-allowed' : 'pointer',
      minHeight: 120,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  const handleVendorChange = (value) => {
    setSelectedVendor(value);
  };

  // Form submit handler
  const handleFinish = async (values) => {
    setLoading(true);
    try {
      if (galleryImages.length === 0) {
        message.error("Please upload gallery images");
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("product_brand", values.product_brand);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("sub_category", values.sub_category);
      formData.append("price", values.price);
      formData.append("discount_price", values.discount_price);
      formData.append("unit", values.unit);
      formData.append("quantity", values.quantity);
      formData.append("fast_delivery_available", values.fast_delivery_available ? 1 : 0);
      if (selectedVendor) {
        console.log(selectedVendor);
        // return
        
        formData.append("vendor_id", selectedVendor);
      }
      // Product Image
      if (values.product_image && values.product_image[0]?.originFileObj) {
        formData.append("featuredImage", values.product_image[0].originFileObj);
      }
      // Gallery Images
      galleryImages.forEach((fileObj) => {
        if (fileObj) formData.append("galleryImages", fileObj);
      });
      // Attributes
      if (values.attributes) {
        formData.append("attributes", JSON.stringify(values.attributes));
      }
      const result = await addProduct(formData);
      if (result.success) {
        setShowModal(true);
        form.resetFields();
        setGalleryImages([]);
        setGalleryPreviews([]);
        // Do NOT clear selectedVendor
      } else {
        message.error("Failed to add product. Please try again.");
      }
    } catch (err) {
      message.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
} 