import { useState, useEffect, useCallback } from 'react';
import { getAllCategories, deletecategory, updateCategory, updateCategoryStatus } from '../../services/apiService';

export default function useCatagoryHook() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [sorter, setSorter] = useState({ field: 'sr', order: 'ascend' });
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Fetch categories
  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCategories();
      let categories = response.success ? response.data || response : [];
      categories = categories.map((cat, idx) => ({ ...cat, sr: idx + 1 }));
      // Sorting
      if (params.sorter && params.sorter.field && params.sorter.order) {
        const { field, order } = params.sorter;
        categories = [...categories].sort((a, b) => {
          if (order === 'ascend') return a[field] > b[field] ? 1 : -1;
          return a[field] < b[field] ? 1 : -1;
        });
      }
      // Pagination
      const total = categories.length;
      const { current, pageSize } = params.pagination || pagination;
      const paged = categories.slice((current - 1) * pageSize, current * pageSize);
      setData(paged);
      setPagination(prev => ({ ...prev, current, pageSize, total }));
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []); // <-- no dependencies

  useEffect(() => {
    fetchData({ pagination, sorter });
  }, [ ]); // <-- only these dependencies

  const onTableChange = (newPagination, filters, newSorter) => {
    setPagination(prev => ({ ...prev, current: newPagination.current, pageSize: newPagination.pageSize }));
    setSorter(newSorter);
  };

  // Toggle active status
  const handleToggleActive = async (categoryId, isActive) => {
    setLoading(true);
    try {
      // You should implement toggleCategoryActive in your apiService
      
      const res= await updateCategoryStatus(categoryId, isActive);
      console.log(res);
      // For now, just simulate
   
      setData(prev => prev.map(cat => cat.id === res?.data?.category?.id ? { ...cat, status: res?.data?.category?.status } : cat));
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  // Edit modal
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setPreviewImage(category.category_logo ? `${import.meta.env.VITE_IMAGE_BASE_URL}${category.category_logo}` : "");
    setEditModal(true);
  };
  const closeEditModal = () => {
    setEditModal(false);
    setSelectedCategory(null);
    setPreviewImage("");
  };

  // Save edit
  const handleSave = async (formValues) => {
    setFormLoading(true);
    try {
      // Merge form values with selectedCategory to get the logo file if changed
      const updatedCategory = {
        ...selectedCategory,
        ...formValues,
        // If a new image was uploaded, it will be in selectedCategory.category_logo
        category_logo: selectedCategory.category_logo,
      };
      const result = await updateCategory(updatedCategory);
      if (result.success && result.data) {
        setData(prev => prev.map(cat => cat.id === result.data.id ? { ...cat, ...result.data } : cat));
        closeEditModal();
        setPreviewImage("");
      } else {
        setError(result.error || 'Failed to update category');
      }
    } catch (err) {
      setError('Failed to update category');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete modal
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedCategory(null);
  };
  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await deletecategory(selectedCategory.id);
      setData(prev => prev.filter(cat => cat.id !== selectedCategory.id));
      closeDeleteModal();
    } catch (err) {
      setError('Failed to delete category');
    } finally {
      setFormLoading(false);
    }
  };

  // Image change for edit modal
  const handleImageChange = (file) => {
    setPreviewImage(URL.createObjectURL(file));
    setSelectedCategory(prev => ({ ...prev, category_logo: file }));
  };

  return {
    data,
    loading,
    error,
    pagination,
    sorter,
    onTableChange,
    handleToggleActive,
    editModal,
    openEditModal,
    closeEditModal,
    selectedCategory,
    previewImage,
    handleImageChange,
    handleSave,
    formLoading,
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  };
}
