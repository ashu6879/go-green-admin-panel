import { useState, useEffect } from 'react';
import { message } from 'antd';

// Placeholder vendor type data
const MOCK_VENDOR_TYPES = Array.from({ length: 230 }).map((_, i) => ({
  id: i + 1,
  name: `Type ${i + 1}`,
  icon: '', // Could be a URL or base64 string
  status: i % 2 === 0 ? 'active' : 'inactive',
}));

export default function useVendorType() {
  const [allVendorTypes, setAllVendorTypes] = useState([]);
  const [filteredVendorTypes, setFilteredVendorTypes] = useState([]);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [formValues, setFormValues] = useState({ name: '', icon: null });

  // Fetch all vendor types once
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAllVendorTypes(MOCK_VENDOR_TYPES);
      setFilteredVendorTypes(MOCK_VENDOR_TYPES);
      setLoading(false);
    }, 500);
  }, []);

  // Search handler (local filtering)
  const handleSearch = (val) => {
    const value = typeof val === 'string' ? val : search;
    const filtered = allVendorTypes.filter(vt =>
      vt.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredVendorTypes(filtered);
    setPagination(p => ({ ...p, current: 1 }));
  };

  // Pagination handler
  const handleTableChange = (pag) => {
    setPagination(pag);
  };

  // Add modal handlers
  const openAddModal = () => {
    setFormValues({ name: '', icon: null });
    setAddModalOpen(true);
  };
  const closeAddModal = () => {
    setAddModalOpen(false);
  };
  const handleAdd = () => {
    if (!formValues.name || !formValues.icon) {
      message.error('Name and icon are required');
      return;
    }
    const newType = {
      id: allVendorTypes.length + 1,
      name: formValues.name,
      icon: formValues.icon,
      status: 'active',
    };
    setAllVendorTypes([newType, ...allVendorTypes]);
    setFilteredVendorTypes([newType, ...filteredVendorTypes]);
    setAddModalOpen(false);
    setFormValues({ name: '', icon: null });
    message.success('Vendor type added');
  };

  // Edit modal handlers
  const openEditModal = (record) => {
    setEditRecord(record);
    setFormValues({ name: record.name, icon: record.icon, status: record.status });
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditRecord(null);
  };
  const handleEdit = () => {
    if (!formValues.name || !formValues.icon) {
      message.error('Name and icon are required');
      return;
    }
    const updated = allVendorTypes.map(vt =>
      vt.id === editRecord.id ? { ...vt, name: formValues.name, icon: formValues.icon } : vt
    );
    setAllVendorTypes(updated);
    setFilteredVendorTypes(updated);
    setEditModalOpen(false);
    setEditRecord(null);
    setFormValues({ name: '', icon: null });
    message.success('Vendor type updated');
  };

  // Status switch handler
  const handleStatusSwitch = (id) => {
    const updated = allVendorTypes.map(vt =>
      vt.id === id ? { ...vt, status: vt.status === 'active' ? 'inactive' : 'active' } : vt
    );
    setAllVendorTypes(updated);
    setFilteredVendorTypes(updated);
  };

  // Drag & drop icon upload
  const handleIconDrop = (file) => {
    // For demo, just use base64
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormValues(fv => ({ ...fv, icon: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // Table data for current page
  const pagedData = filteredVendorTypes.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  return {
    loading,
    search,
    setSearch,
    handleSearch,
    pagination,
    handleTableChange,
    pagedData,
    filteredVendorTypes,
    total: filteredVendorTypes.length,
    openAddModal,
    closeAddModal,
    addModalOpen,
    handleAdd,
    formValues,
    setFormValues,
    handleIconDrop,
    openEditModal,
    closeEditModal,
    editModalOpen,
    handleEdit,
    editRecord,
    handleStatusSwitch,
  };
}
