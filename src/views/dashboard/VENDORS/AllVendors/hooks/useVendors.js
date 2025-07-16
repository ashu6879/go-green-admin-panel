import { useState, useEffect } from 'react';

// Dummy data for vendors
const dummyVendors = Array.from({ length: 50 }, (_, i) => ({
  storeImage: `https://i.pravatar.cc/40?img=${i+1}`,
  storeName: `Store ${i+1}`,
  Phone: `123-456-78${i%10}${i}`,
  Email: `store${i+1}@example.com`,
  Address: `Address ${i+1}, City, Country`,
  storeid: `ID${1000 + i}`,
}));

export default function useVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState({ storeName: '', storeid: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filtered = dummyVendors;
      if (search.storeName) {
        filtered = filtered.filter(v => v.storeName.toLowerCase().includes(search.storeName.toLowerCase()));
      }
      if (search.storeid) {
        filtered = filtered.filter(v => v.storeid.toLowerCase().includes(search.storeid.toLowerCase()));
      }
      setTotal(filtered.length);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      setVendors(filtered.slice(start, end));
      setLoading(false);
    }, 400);
  }, [search, page, pageSize]);

  const onSearch = (field, value) => {
    setSearch(prev => ({ ...prev, [field]: value }));
    setPage(1); // Reset to first page on search
  };

  const onPageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  return {
    vendors,
    loading,
    error,
    search,
    page,
    pageSize,
    total,
    onSearch,
    onPageChange,
  };
}
