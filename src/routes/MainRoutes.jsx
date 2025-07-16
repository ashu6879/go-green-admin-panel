import { lazy } from 'react';

import AdminLayout from 'layouts/AdminLayout';
import GuestLayout from 'layouts/GuestLayout';
import Orders from '../views/dashboard/ORDERS/Orders';
import VendorTypeList from '../views/dashboard/VENDORS/vendorType/vendorTypeList';
import VendorTable from '../views/dashboard/VENDORS/AllVendors/vendorTabel';

const DashboardSales = lazy(() => import('../views/dashboard/DashSales/index'));

const Typography = lazy(() => import('../views/ui-elements/basic/BasicTypography'));
const Color = lazy(() => import('../views/ui-elements/basic/BasicColor'));

const FeatherIcon = lazy(() => import('../views/ui-elements/icons/Feather'));
const FontAwesome = lazy(() => import('../views/ui-elements/icons/FontAwesome'));
const MaterialIcon = lazy(() => import('../views/ui-elements/icons/Material'));

const Login = lazy(() => import('../views/auth/login'));
const Register = lazy(() => import('../views/auth/register'));

const Sample = lazy(() => import('../views/sample'));
const AddUser = lazy(() => import('../views/users/addUser'));
const AllUser = lazy(() => import('../views/users/allUser'));
const AddProducts = lazy(() => import('../views/products/addProducts'));
const AllProducts = lazy(() => import('../views/products/allProducts'));
const ProductDiscount = lazy(() => import('../views/products/productDiscount'));
const AddCategory = lazy(() => import('../views/product-category/addCategory'));
const AllCategory = lazy(() => import('../views/product-category/allCategory'));
const AddSubCategory = lazy(() => import('../views/product-subCategory/addsubCategory'));
const AllSubCategory = lazy(() => import('../views/product-subCategory/allsubCategory'));
const AddProductBrand = lazy(() => import('../views/product-Brand/addbrands'));
const AllProductBrand = lazy(() => import('../views/product-Brand/allbrands'));
const Editcategorydata = lazy(() => import('../views/editCategory/editCategory'));
const AddAppBanner = lazy(() => import('../views/homeApp-banner/addappbanner'));
const AllAppBanner = lazy(() => import('../views/homeApp-banner/allappbanner'));
const Unverifiedusers = lazy(() => import('../views/users/unverifiedusers'));

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <AdminLayout />,
      children: [
        {
          path: '/dashboard',
          element: <DashboardSales />
        },
        {
          path: '/typography',
          element: <Typography />
        },
        {
          path: '/color',
          element: <Color />
        },
        {
          path: '/icons/Feather',
          element: <FeatherIcon />
        },
        {
          path: '/icons/font-awesome-5',
          element: <FontAwesome />
        },
        {
          path: '/icons/material',
          element: <MaterialIcon />
        },

        {
          path: '/sample-page',
          element: <Sample />
        },

        {
          path: '/add-users',
          element: <AddUser />
        },

        {
          path: '/all-users',
          element: <AllUser />
        },
        {
          path: '/all-unverified-vendors',
          element: <Unverifiedusers user={"vendors"} />
        },
        {
          path: '/all-unverified-rider',
          element: <Unverifiedusers user={"delivery_partners"}  />
        },

        {
          path: '/add-Products',
          element: <AddProducts />
        },

        {
          path: '/all-Products',
          element: <AllProducts />
        },

        {
          path: '/products-discount',
          element: <ProductDiscount />
        },

        {
          path: '/add-category',
          element: <AddCategory />
        },

        {
          path: '/all-category',
          element: <AllCategory />
        },

        {
          path: '/add-subcategory',
          element: <AddSubCategory />
        },

        {
          path: '/all-subcategory',
          element: <AllSubCategory />
        },

        {
          path: '/add-Product-Brand',
          element: <AddProductBrand />
        },

        {
          path: '/all-Product-Brands',
          element: <AllProductBrand />
        },
        
        {
          path: '/edit-category-data',
          element: <Editcategorydata />
        },
        {
          path: '/all-orders',
          element: <Orders />
        },

        // {
        //   path: '/add-banner',
        //   element: <AddAppBanner />
        // },
        {
          path: '/all-banner',
          element: <AllAppBanner />
        },
        
        {
          path: '/vendor-type',
          element: <VendorTypeList />
        },
        {
          path: '/vendors/all',
          element: <VendorTable />
        }
      ]
    },
    {
      path: '/',
      element: <GuestLayout />,
      children: [
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/register',
          element: <Register />
        }
      ]
    }
  ]
};

export default MainRoutes;
