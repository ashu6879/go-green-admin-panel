import { useState, useEffect, useCallback } from 'react';
import { getAllCategories, getAllSubCategories, updateSubCategory, deleteSubCategory } from '../../services/apiService';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
const token = localStorage.getItem('token');

export default function useSubcategoryHook() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [sorter, setSorter] = useState({ field: 'name', order: 'ascend' });
  const [search, setSearch] = useState('');
  const [parentFilter, setParentFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch categories and subcategories
  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, subcatRes] = await Promise.all([
        getAllCategories(),
        getAllSubCategories(),
      ]);
      let subcategories = subcatRes.success ? subcatRes.data || [] : [];
      let cats = catRes.success ? catRes.data || [] : [];
      // Add parent category name to subcategories
      subcategories = subcategories.map((sub) => ({
        ...sub,
        category_name: cats.find((c) => c.id === sub.category_id)?.name || 'N/A',
      }));
      // Search filter
      if (search) {
        subcategories = subcategories.filter(
          (sub) =>
            sub.name.toLowerCase().includes(search.toLowerCase()) ||
            sub.description?.toLowerCase().includes(search.toLowerCase())
        );
      }
      // Parent category filter
      if (parentFilter) {
        subcategories = subcategories.filter((sub) => String(sub.category_id) === String(parentFilter));
      }
      // Sorting
      if (params.sorter && params.sorter.field && params.sorter.order) {
        const { field, order } = params.sorter;
        subcategories = [...subcategories].sort((a, b) => {
          if (order === 'ascend') return a[field] > b[field] ? 1 : -1;
          return a[field] < b[field] ? 1 : -1;
        });
      }
      // Pagination
      const total = subcategories.length;
      const { current, pageSize } = params.pagination || pagination;
      const paged = subcategories.slice((current - 1) * pageSize, current * pageSize);
      setData(paged);
      setPagination((prev) => ({ ...prev, current, pageSize, total }));
      setCategories(cats);
    } catch (err) {
      setError(err.message || 'Failed to fetch subcategories');
    } finally {
      setLoading(false);
    }
  }, [search, parentFilter]);

  useEffect(() => {
    fetchData({ pagination, sorter });
    // eslint-disable-next-line
  }, []);
  // }, [search, parentFilter, pagination.current, pagination.pageSize, sorter]);

  const onTableChange = (newPagination, filters, newSorter) => {
    setPagination((prev) => ({ ...prev, current: newPagination.current, pageSize: newPagination.pageSize }));
    setSorter(newSorter);
  };

  // Toggle active status
  const handleToggleActive = async (subcategoryId, isActive) => {
    setStatusLoading(prev => ({ ...prev, [subcategoryId]: true }));
    try {
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'multipart/form-data',
        },
      };
      const formData = new FormData();
      formData.append('id', subcategoryId);
      formData.append('status', isActive ? 1 : 0);
      const result = await updateSubCategory(formData);

      // await axios.put(`${API_URL}/subcategory/subcategories`, formData, config);
      setData((prev) => prev.map((sub) => (sub.id === subcategoryId ? { ...sub, status: isActive ? 1 : 0 } : sub)));
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setStatusLoading(prev => ({ ...prev, [subcategoryId]: false }));
    }
  };

  // Edit modal
  const openEditModal = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setPreviewImage(subcategory.subcategory_logo ? `${IMAGE_BASE_URL}${subcategory.subcategory_logo}` : "");
    setEditModal(true);
  };
  const closeEditModal = () => {
    setEditModal(false);
    setSelectedSubcategory(null);
    setPreviewImage("");
  };

  // Delete modal
  const openDeleteModal = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedSubcategory(null);
  };

  // Image change for edit modal
  const handleImageChange = (file) => {
    setPreviewImage(URL.createObjectURL(file));
    setSelectedSubcategory((prev) => ({ ...prev, subcategory_logo: file }));
  };

  // Edit save
  const handleEditSave = async (values, fileObj) => {
    setFormLoading(true);
    try {
      if (selectedSubcategory) {
        const formData = new FormData();
        formData.append("id", selectedSubcategory.id);
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("category_id", values.category_id);
        formData.append("status", values.status ? 1 : 0);
        if (fileObj instanceof File) {
          formData.append("subcategory_logo", fileObj);
        } else if (selectedSubcategory.subcategory_logo) {
          formData.append("existing_category_logo", selectedSubcategory.subcategory_logo);
        }
        const result = await updateSubCategory(formData);
        if (result.success && result.data) {
          setData((prev) =>
            prev.map((cat) =>
              cat.id === selectedSubcategory.id ? result.data : cat
            )
          );
        }
        closeEditModal();
      }
    } catch (err) {
      setError("Failed to update subcategory.");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      if (selectedSubcategory) {
        const result = await deleteSubCategory(selectedSubcategory.id);
        if (result.success) {
          setData((prev) => prev.filter((sub) => sub.id !== selectedSubcategory.id));
          closeDeleteModal();
        } else {
          setError(result.error || "Failed to delete subcategory. Please try again.");
        }
      }
    } catch (err) {
      setError("Failed to delete subcategory. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    pagination,
    sorter,
    search,
    setSearch,
    parentFilter,
    setParentFilter,
    categories,
    onTableChange,
    handleToggleActive,
    editModal,
    openEditModal,
    closeEditModal,
    selectedSubcategory,
    previewImage,
    handleImageChange,
    formLoading,
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleEditSave,
    handleDelete,
    statusLoading,
    deleteLoading,
    // Add more handlers as needed
  };
} 