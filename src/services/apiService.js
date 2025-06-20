import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");
const config = {
    headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",  // ✅ Use JSON instead of multipart/form-data
    },
};
const configwithform = {
    headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data", // ✅ Ensure correct content type
    },
};

// ✅ Axios instance for cleaner API calls
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Fetch all categories
export const getAllCategories = async () => {
  try {
      const response = await apiClient.post("/category/fetch-categories", {
          is_web: true
      }, config);

      return { success: true, data: response.data.categories || [] };
  } catch (error) {
      console.error("Failed to fetch categories:", error);
      return { success: false, error: error.response?.data || "Something went wrong" };
  }
};
export const getAllSubCategoriesbyID = async (catID) => {
    try {
        const response = await apiClient.post("/subcategory/subcategoriesbycatID", { catID }, config);
        return { success: true, data: response.data.subcategories || [] };
    } catch (error) {
        console.error("Failed to fetch subcategories:", error);
        return { success: false, error: error.response?.data || "Something went wrong" };
    }
};
export const getAllSubCategories = async (catID) => {
    try {
      const response = await apiClient.post("/subcategory/fetch-subcategories", {
        is_web: true
    }, config);
        return { success: true, data: response.data.subcategories || [] };
    } catch (error) {
        console.error("Failed to fetch subcategories:", error);
        return { success: false, error: error.response?.data || "Something went wrong" };
    }
};
export const getAllProducts = async () => {
    try {
        const response = await apiClient.post("/products/getproducts", {},config);

        return { success: true, data: response.data?.products || [] };
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return { success: false, error: error.response?.data || "Something went wrong" };
    }
};


// ✅ Add a new product brand
export const addProductBrand = async (formData) => {
    try {

        const response = await apiClient.post("/productbrands/product-brands", formData, configwithform);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Failed to add product brand:", error);
        return { success: false, error: error.response?.data || "Failed to add product brand" };
    }
};

// update category divs
export const saveproductCategories = async (category, index) => {
    try {

        const payload = { category, index };  // ✅ Send both values inside an object

        const response = await apiClient.put("/dynamiccat/save-categories", payload, config);
        return response.data;
    } catch (error) {
        console.error("Failed to update category", error);
        throw error;  // ✅ Throw error to handle it in `handleSaveCategory`
    }
};

// fetch product brands
export const productfetchBrands = async () => {
    try {
        const response = await apiClient.get("/productbrands/allproduct-brands",configwithform);
        console.log("brands",response.data.productBrands)
        return { success: true, data: response.data.productBrands || [] };
    } catch (err) {
        setError("Failed to fetch brands.");
      }
};

export const getShowSelectedCategory = async (index) => {
    try {
        const response = await apiClient.post("/dynamiccat/showselectedcategory", { index },config);
        return { success: true, data: response.data.products };
    } catch (error) {
        console.error("Failed to fetch selected category:", error);
        return { success: false, error: error.response?.data || "Something went wrong" };
    }
};

export const addBanner = async (formData) => {
    try {
        const response = await apiClient.post("/banners/app-banners", formData, configwithform);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Failed to add banner:", error);
        return { success: false, error: error?.response?.data || "Failed to add banner" };
    }
};

export const addCategory = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/category/categories`, formData, configwithform);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};

export const getAllBanners = async () => {
    try {
        const response = await apiClient.get("/banners/app-banners",config);
        return { success: true, data: response.data.banners};
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return { success: false, error: error.response?.data || "Something went wrong" };
    }
};

export const deleteBanner = async (bannerId) => {
  
    try {
      if (!bannerId) throw new Error("Banner ID is required");
  
        await axios.delete(`${API_URL}/banners/app-banners`, {
        ...config,
        data: { id: bannerId }, // ✅ Proper way to pass data in DELETE request
      });
      return { success: true };
    } catch (error) {
      console.error("Error deleting banner:", error);
      return { success: false, message: error.response?.data?.message || "Failed to delete banner" };
    }
  };

  export const deletecategory = async (categoryID) => {
    console.log("id",categoryID)
    try {
      if (!categoryID) throw new Error("Category ID is required");
  
        await axios.delete(`${API_URL}/category/categories`, {
        ...config,
        data: { id: categoryID }, // ✅ Proper way to pass data in DELETE request
      });
      return { success: true };
    } catch (error) {
      console.error("Error deleting banner:", error);
      return { success: false, message: error.response?.data?.message || "Failed to delete banner" };
    }
  };

  export const updateBanner = async (selectedBanner) => {
    try {
      const formData = new FormData();
      formData.append("id", selectedBanner.id);
      formData.append("title", selectedBanner.title);
      formData.append("status", selectedBanner.status);
  
      if (selectedBanner.image_url instanceof File) {
        formData.append("banner_image", selectedBanner.image_url);
      }
  
      const response = await axios.put(`${API_URL}/banners/app-banners`, formData, configwithform);
  
      return { success: true, data: response.data.banner };
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      throw err;
    }
  };
  export const getAllUnverifiedUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users/unverifiedUsers`, config); // ✅ Pass directly
        return { success: true, vendors: response.data.vendors, delivery_partners: response.data.delivery_partners };
    } catch (error) {
        console.error("Error fetching unverified vendors:", error);
        return { success: false, data: [] };
    }
};

export const verifyUser = async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/users//verify-user`, 
        { id },
        config
      );
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Verification failed:", error);
      return { success: false };
    }
};

export const getAllDiscounts = async () => {
    try {
        const response = await apiClient.get("/productdiscount/get-discounts", config); // remove empty object; only config needed
        return response.data;
    } catch (error) {
        console.error("❌ Failed to fetch discounts:", error);
        return { success: false, error: error.response?.data || "Something went wrong" };
    }
};


export const saveOrUpdateDiscount = async (selected) => {
    try {
  
      const formData = new FormData();
      Object.entries(selected).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      const url = selected.id
        ? `${API_URL}/productdiscount/update-discount`
        : `${API_URL}/productdiscount/add-discount`;
  
      const method = selected.id ? "put" : "post";
  
      const res = await axios[method](url, formData, config);
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data || err.message,
      };
    }
  };
  
  
//   Delete a product discount
export const deleteDiscount = async (discount_id) => {
    try {
      const token = localStorage.getItem("token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { discount_id }, // 👈 send id in request body
      };
  
      await axios.delete(`${API_URL}/productdiscount/delete-discount`, config);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };