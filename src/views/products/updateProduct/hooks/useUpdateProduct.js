import { useState, useEffect } from "react";
import { message } from "antd";
import { getAllCategories, getAllSubCategoriesbyID, productfetchBrands, addProduct, getAllVendors, updateProduct, saveOrUpdateDiscount } from "../../../../services/apiService";
import { normalizeAttributes } from "../../../../services/utils/gen_utility";
import axios from "axios";
// import { getAllCategories, getAllSubCategoriesbyID, productfetchBrands, addProduct } from "../../services/apiService";

export default function useUpdateProduct(form,data) {
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
  const [hasVariants, setHasVariants] = useState(false);
  const [hasAddOns, setHasAddOns] = useState(false);  
  const [variants, setVariants] = useState([]); // [{type, value, price, discount_price}]
  const [editingVariantIdx, setEditingVariantIdx] = useState(null); // null or index
  const [newVariantDraft, setNewVariantDraft] = useState({ type: '', value: '', price: '', discount_price: '' });
  const [addons, setAddons] = useState([]); // [{name, price}]
  const [editingAddonIdx, setEditingAddonIdx] = useState(null); // null or index
  const [newAddonDraft, setNewAddonDraft] = useState({ name: '', price: '' });
  const [selectedUnit, setSelectedUnit] = useState();

  const [productImage, setProductImage] = useState([]);

 useEffect(() => {
  if(data){
    // setHasVariants(product.variants.length > 0);
          // setHasAddOns(product.addons.length > 0);
          // setVariants(product.variants);
          // setAddons(product.addons);




          const {attributes,extraAttributes} = normalizeAttributes(data?.attributes);
          // console.log("has  Variants",data?.variants?.length > 0);
          // console.log("hasAddOns",data?.addons?.length > 0);
          // console.log("extraAttributes",extraAttributes)
          setHasVariants(data?.variants?.length > 0);
          setHasAddOns(data?.addons?.length > 0);
          setVariants(data?.variants);
          setAddons(data?.addons);
          // setattributes(data?.attributes);
          form.setFieldsValue({
            has_variants: data?.variants?.length > 0 || data?.addons?.length > 0, // or false based on your data
            attributes: attributes,
            stock:data?.stock,
            unit:extraAttributes?.unit,
            quantity:extraAttributes?.quantity,
            is_available:extraAttributes?.is_available,
            // price:extraAttributes?.price,
            discount_price:data?.discounted_value,
          });
          setSelectedUnit(extraAttributes?.unit);

          if(data?.featured_image){
            const defaultFileList = [
              {
                uid: '-1',
                name: 'featured-image.jpg',
                status: 'done',
                url: data.featured_image,
              },
            ];
            setProductImage(defaultFileList);
          }

          
          setGalleryImages(data?.gallery_images);
          setGalleryPreviews(data?.gallery_images.map(img => img.image_path));
  }
 },[data])




  useEffect(() => {      
    getAllCategories().then((response) => {
      if (response.success) setCategories(response.data);
    });
    productfetchBrands().then((response) => {
      if (response.success) setBrands(response.data);
    });
    getAllVendors(true).then((response) => {
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
    // console.log("galleryImages",[...current, ...allowedFiles])
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



  const handleImageChange = ({ fileList }) => {
    setProductImage(fileList);
  };

  const handleVendorChange = (value) => {
    setSelectedVendor(value);
  };

  // Handler for toggling variants
  const handleHasVariantsChange = (checked) => {
    setHasVariants(checked);
    if (!checked) {
      // setVariants([]); // Clear variants if unchecked
    }
  };
  // Handler for toggling add-ons
  const handleHasAddOnsChange = (checked) => {
    setHasAddOns(checked);
    if (!checked) {
      // setAddons([]); // Clear add-ons if unchecked
    }
  };
  // Handlers for variants
  const addVariant = () => {
    setVariants([...variants, { type: '', value: '', price: '', discount_price: '' }]);
  };
  const removeVariant = (idx) => {
    const newVariants = [...variants];
    newVariants.splice(idx, 1);
    setVariants(newVariants);
  };
  const updateVariant = (idx, field, value) => {
    const newVariants = [...variants];
    newVariants[idx][field] = value;
    setVariants(newVariants);
  };

  // Start editing an existing variant
  const startEditVariant = (idx) => {
    setEditingVariantIdx(idx);
    setNewVariantDraft({ ...variants[idx] });
  };
  // Save edited variant
  const saveEditVariant = () => {
    if (editingVariantIdx !== null) {
      const newVariants = [...variants];
      newVariants[editingVariantIdx] = { ...newVariantDraft };
      setVariants(newVariants);
      setEditingVariantIdx(null);
      setNewVariantDraft({ type: '', value: '', price: '', discount_price: '' });
    }
  };
  // Cancel editing
  const cancelEditVariant = () => {
    setEditingVariantIdx(null);
    setNewVariantDraft({ type: '', value: '', price: '', discount_price: '' });
  };
  // Add new variant
  const saveNewVariant = (formValues) => {
    const price = formValues.price || '';
    const discount_price = formValues.discount_price || '';
    setVariants([...variants, { 
      type: formValues.type || '',
      value: formValues.value || '',
      price: price,
      discount_price: discount_price
    }]);
    setNewVariantDraft({ type: '', value: '', price: '', discount_price: '' });
  };

  // Add-ons handlers
  const startEditAddon = (idx) => {
    setEditingAddonIdx(idx);
    setNewAddonDraft({ ...addons[idx] });
  };
  const saveEditAddon = () => {
    if (editingAddonIdx !== null) {
      const newAddons = [...addons];
      newAddons[editingAddonIdx] = { ...newAddonDraft };
      setAddons(newAddons);
      setEditingAddonIdx(null);
      setNewAddonDraft({ name: '', price: '' });
    }
  };
  const cancelEditAddon = () => {
    setEditingAddonIdx(null);
    setNewAddonDraft({ name: '', price: '' });
  };
  const saveNewAddon = () => {
    setAddons([...addons, { ...newAddonDraft }]);
    setNewAddonDraft({ name: '', price: '' });
  };
  const removeAddon = (idx) => {
    const newAddons = [...addons];
    newAddons.splice(idx, 1);
    setAddons(newAddons);
  };
  const updateAddon = (idx, field, value) => {
    const newAddons = [...addons];
    newAddons[idx][field] = value;
    setAddons(newAddons);
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

      // Console log all product data before API call
      const productData = {
        formValues: values,
        variants: variants.map(variant => ({
          ...variant,
          discount_percentage: variant.price && variant.discount_price && variant.discount_price <= variant.price 
            ? Math.round(((variant.price - variant.discount_price) / variant.price) * 100) 
            : 0
        })),
        addons: addons,
        hasVariants: hasVariants,
        hasAddOns: hasAddOns,
        galleryImages: galleryImages.map(img => img.name || 'File'),
        selectedVendor: selectedVendor,
        galleryImagesCount: galleryImages.length,
        product_discount_percentage: values.price && values.discount_price && values.discount_price <= values.price
          ? Math.round(((values.price - values.discount_price) / values.price) * 100)
          : 0
      };
      
      // console.log('=== PRODUCT DATA BEFORE API CALL ===');
      // console.log('Complete Product Object:', productData);
      // console.log('Form Values:', values);
      // console.log('Product Discount Percentage:', productData.product_discount_percentage + '%');
      // console.log('Variants with Discount %:', productData.variants);
      // console.log('Add-ons:', addons);
      // console.log('Has Variants:', hasVariants);
      // console.log('Has Add-ons:', hasAddOns);
      // console.log('Gallery Images Count:', galleryImages.length);
      // console.log('Selected Vendor:', selectedVendor);
      // console.log('=====================================');

      const formData = new FormData();
      formData.append("id", data.id);
      if (values.product_brand ) formData.append("product_brand", values.product_brand);
      if (values.name) formData.append("name", values.name);
      if (values.description) formData.append("description", values.description);
      if (values.category) formData.append("category", values.category);
      if (values.sub_category) formData.append("sub_category", values.sub_category);
    
      //  if (productData.product_discount_percentage) formData.append("discount_percentage", productData.product_discount_percentage); 
     
    
    if (!hasVariants) {
        if (values.unit) formData.append("unit", values.unit);
        if (values.quantity !== undefined && values.quantity !== null && values.quantity !== "") formData.append("quantity", values.quantity);
        if (values.price !== undefined && values.price !== null && values.price !== "") formData.append("price", values.price);

      } else {
        formData.append("is_available", values.is_available ? 1 : 0);
        
        formData.append("price", 0);
 

      }


     
      formData.append("fast_delivery_available", values.fast_delivery_available ? 1 : 0);
      // if (selectedVendor) {
      //   // formData.append("vendor_id", selectedVendor);
      // }
      // Product Image
      if (values.product_image && values.product_image[0]?.originFileObj) {
        
        formData.append("featuredImage", values.product_image[0].originFileObj);
      }
      // Gallery Images
      console.log(galleryImages);
      galleryImages.forEach((fileObj) => {
        if (fileObj instanceof File) {
          formData.append("galleryImages", fileObj);
        } else {
          formData.append("existingGalleryImages", fileObj.image_path); // or fileObj.name based on your structure
        }
      });
      // Attributes
      const extraAttributes = [
        {key: "unit", value: values?.unit},
        {key: "quantity", value: values?.quantity},
      ]
      // if (values.attributes) {
        formData.append("attributes", JSON.stringify([...values.attributes,...extraAttributes]));      // }
      // Variants
      if (hasVariants && variants.length > 0) {
        formData.append("variants", JSON.stringify(variants.map(variant => ({
          ...variant,
          discount_percentage: variant.price && variant.discount_price && variant.discount_price <= variant.price 
            ? Math.round(((variant.price - variant.discount_price) / variant.price) * 100) 
            : 0
        }))));
      }else{
        formData.append("variants", JSON.stringify([]));
      }
      // Add-ons
      if (addons.length > 0 && hasAddOns) {
        formData.append("addons", JSON.stringify(addons));
      }else{
        formData.append("addons", JSON.stringify([]));
      }
      // const result = await addProduct(formData);
     
      const result = await updateProduct(formData);

      if (result.success) {

       await saveOrUpdateDiscount({
        product_id: data.id,
        discount_percent: productData?.product_discount_percentage
       })
        console.log(result);

        setShowModal(true);
        // form.resetFields();
        // setGalleryImages([]);
        // setGalleryPreviews([]);
        // setVariants([]);
        // setAddons([]);
        // setHasVariants(false);
        // setHasAddOns(false);
      } else {
        message.error("Failed to add product. Please try again.");
      }
    } catch (err) {
      console.log(err);
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
    // New for variants
    hasVariants,
    setHasVariants: handleHasVariantsChange,
    hasAddOns,
    setHasAddOns: handleHasAddOnsChange,
    variants,
    addVariant,
    removeVariant,
    updateVariant,
    editingVariantIdx,
    setEditingVariantIdx,
    newVariantDraft,
    setNewVariantDraft,
    startEditVariant,
    saveEditVariant,
    cancelEditVariant,
    saveNewVariant,
    // Add-ons
    addons,
    setVariants,
    setAddons,
    selectedUnit, setSelectedUnit,
    editingAddonIdx,
    setEditingAddonIdx,
    saveNewAddon,
    newAddonDraft,
    setNewAddonDraft,
    startEditAddon,
    saveEditAddon,
    cancelEditAddon,
    removeAddon,
    updateAddon,
    productImage, handleImageChange,
  };
} 