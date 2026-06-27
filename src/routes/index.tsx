import { createBrowserRouter, Navigate } from "react-router-dom";
import { RequireAuth, RequireRole } from "./guards";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import {
  LandingPage,
  ProductListPage,
  ProductDetailPage,
} from "@/features/catalog";
import { LoginPage, RegisterPage, RoleSelectionPage } from "@/features/auth";
import {
  BuyerDashboard,
  CartPage,
  CheckoutPage,
  BuyerOrdersPage,
  BuyerOrderDetailPage,
  WalletPage,
  AddressesPage,
  ProfilePage,
} from "@/features/buyer";
import {
  SellerDashboard,
  SellerProductsPage,
  SellerOrdersPage,
  SellerOrderDetailPage,
  StorePage,
  AnalyticsPage,
} from "@/features/seller";
import {
  DriverDashboard,
  AvailableJobsPage,
  DriverHistoryPage,
  DriverEarningsPage,
} from "@/features/driver";
import {
  AdminDashboard,
  AdminUsersPage,
  AdminStoresPage,
  AdminOrdersPage,
  AdminDeliveryJobsPage,
  AdminVouchersPage,
  AdminPromosPage,
  AdminSystemPage,
} from "@/features/admin";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  // ── Public ──
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/products", element: <ProductListPage basePath="/products" /> },
      {
        path: "/products/:id",
        element: <ProductDetailPage basePath="/products" />,
      },
    ],
  },

  // ── Auth ──
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
  { path: "/role-selection", element: <RoleSelectionPage /> },

  // ── Protected ──
  {
    element: <RequireAuth />,
    children: [
      // Buyer
      {
        element: <RequireRole role="BUYER" />,
        children: [
          {
            path: "/buyer",
            element: <DashboardLayout role="BUYER" />,
            children: [
              {
                index: true,
                element: <Navigate to="/buyer/dashboard" replace />,
              },
              { path: "dashboard", element: <BuyerDashboard /> },
              {
                path: "products",
                element: <ProductListPage basePath="/buyer/products" />,
              },
              {
                path: "products/:id",
                element: <ProductDetailPage basePath="/buyer/products" />,
              },
              { path: "cart", element: <CartPage /> },
              { path: "checkout", element: <CheckoutPage /> },
              { path: "orders", element: <BuyerOrdersPage /> },
              { path: "orders/:id", element: <BuyerOrderDetailPage /> },
              { path: "wallet", element: <WalletPage /> },
              { path: "addresses", element: <AddressesPage /> },
              { path: "profile", element: <ProfilePage /> },
            ],
          },
        ],
      },

      // Seller
      {
        element: <RequireRole role="SELLER" />,
        children: [
          {
            path: "/seller",
            element: <DashboardLayout role="SELLER" />,
            children: [
              {
                index: true,
                element: <Navigate to="/seller/dashboard" replace />,
              },
              { path: "dashboard", element: <SellerDashboard /> },
              { path: "products", element: <SellerProductsPage /> },
              { path: "orders", element: <SellerOrdersPage /> },
              { path: "orders/:id", element: <SellerOrderDetailPage /> },
              { path: "store", element: <StorePage /> },
              { path: "analytics", element: <AnalyticsPage /> },
            ],
          },
        ],
      },

      // Driver
      {
        element: <RequireRole role="DRIVER" />,
        children: [
          {
            path: "/driver",
            element: <DashboardLayout role="DRIVER" />,
            children: [
              {
                index: true,
                element: <Navigate to="/driver/dashboard" replace />,
              },
              { path: "dashboard", element: <DriverDashboard /> },
              { path: "jobs", element: <AvailableJobsPage /> },
              { path: "history", element: <DriverHistoryPage /> },
              { path: "earnings", element: <DriverEarningsPage /> },
            ],
          },
        ],
      },

      // Admin
      {
        element: <RequireRole role="ADMIN" />,
        children: [
          {
            path: "/admin",
            element: <DashboardLayout role="ADMIN" />,
            children: [
              {
                index: true,
                element: <Navigate to="/admin/dashboard" replace />,
              },
              { path: "dashboard", element: <AdminDashboard /> },
              { path: "users", element: <AdminUsersPage /> },
              { path: "stores", element: <AdminStoresPage /> },
              { path: "orders", element: <AdminOrdersPage /> },
              { path: "delivery-jobs", element: <AdminDeliveryJobsPage /> },
              { path: "vouchers", element: <AdminVouchersPage /> },
              { path: "promos", element: <AdminPromosPage /> },
              { path: "system", element: <AdminSystemPage /> },
            ],
          },
        ],
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
