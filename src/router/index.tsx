/* eslint-disable react-refresh/only-export-components */
// src/router/index.tsx
//
// Central route configuration for SEAPEDIA.
//
// LAZY LOADING: Every page is lazy-loaded with React.lazy().
// This means the browser only downloads the code for a page
// when the user actually navigates to it — not all at once.
// Result: much faster initial load time.

import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { GuestLayout, AuthLayout, DashboardLayout } from "@components/layouts";
import { AuthGuard } from "./guards/AuthGuard";
import { GuestGuard } from "./guards/GuestGuard";
import { RoleGuard } from "./guards/RoleGuard";
import { buyerNav } from "./navConfigs/buyerNav";
import { sellerNav } from "./navConfigs/sellerNav";
import { driverNav } from "./navConfigs/driverNav";
import { adminNav } from "./navConfigs/adminNav";
import { Spinner } from "@components/ui/Spinner/Spinner";

// ── LAZY PAGE IMPORTS ──────────────────────────────────────
// Public
const LandingPage = lazy(() => import("@pages/public/LandingPage"));
const ProductListPage = lazy(() => import("@pages/public/ProductListPage"));
const ProductDetailPage = lazy(() => import("@pages/public/ProductDetailPage"));
const PublicReviewsPage = lazy(() => import("@pages/public/PublicReviewsPage"));
const LoginPage = lazy(() => import("@pages/public/LoginPage"));
const RegisterPage = lazy(() => import("@pages/public/RegisterPage"));

// Auth / Role select
const RoleSelectionPage = lazy(
  () => import("@pages/private/RoleSelectionPage"),
);
const AccountPage = lazy(() => import("@pages/private/AccountPage"));

// Buyer
const BuyerDashboardPage = lazy(
  () => import("@pages/buyer/BuyerDashboardPage"),
);
const BuyerPlaceholder = lazy(() => import("@pages/buyer/BuyerPlaceholder"));

// Seller
const SellerDashboardPage = lazy(
  () => import("@pages/seller/SellerDashboardPage"),
);
const SellerPlaceholder = lazy(() => import("@pages/seller/SellerPlaceholder"));

// Driver
const DriverDashboardPage = lazy(
  () => import("@pages/driver/DriverDashboardPage"),
);
const DriverPlaceholder = lazy(() => import("@pages/driver/DriverPlaceholder"));

// Admin
const AdminDashboardPage = lazy(
  () => import("@pages/admin/AdminDashboardPage"),
);
const AdminPlaceholder = lazy(() => import("@pages/admin/AdminPlaceholder"));

// Errors
const NotFoundPage = lazy(() => import("@pages/errors/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("@pages/errors/UnauthorizedPage"));

// Full-screen loading fallback while lazy chunks load
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

// Wrapper so every lazy page gets a Suspense boundary
const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

// ── ROUTER ─────────────────────────────────────────────────
export const router = createBrowserRouter([
  // ── PUBLIC ROUTES ────────────────────────────────────────
  {
    element: <GuestLayout />,
    children: [
      {
        index: true,
        element: (
          <S>
            <LandingPage />
          </S>
        ),
      },
      {
        path: "products",
        element: (
          <S>
            <ProductListPage />
          </S>
        ),
      },
      {
        path: "products/:id",
        element: (
          <S>
            <ProductDetailPage />
          </S>
        ),
      },
      {
        path: "reviews",
        element: (
          <S>
            <PublicReviewsPage />
          </S>
        ),
      },
    ],
  },

  // ── AUTH PAGES (redirect away if already logged in) ──────
  {
    element: <GuestGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: (
              <S>
                <LoginPage />
              </S>
            ),
          },
          {
            path: "register",
            element: (
              <S>
                <RegisterPage />
              </S>
            ),
          },
        ],
      },
    ],
  },

  // ── ROLE SELECTION (needs auth, but no active role yet) ──
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "role-select",
            element: (
              <S>
                <RoleSelectionPage />
              </S>
            ),
          },
        ],
      },
    ],
  },

  // ── BUYER DASHBOARD ──────────────────────────────────────
  {
    element: <RoleGuard role="BUYER" />,
    children: [
      {
        path: "buyer",
        element: <DashboardLayout sidebarItems={buyerNav} roleColor="teal" />,
        children: [
          {
            index: true,
            element: (
              <S>
                <BuyerDashboardPage />
              </S>
            ),
          },
          {
            path: "wallet",
            element: (
              <S>
                <BuyerPlaceholder title="Dompet" />
              </S>
            ),
          },
          {
            path: "wallet/topup",
            element: (
              <S>
                <BuyerPlaceholder title="Top Up Saldo" />
              </S>
            ),
          },
          {
            path: "addresses",
            element: (
              <S>
                <BuyerPlaceholder title="Alamat Pengiriman" />
              </S>
            ),
          },
          {
            path: "cart",
            element: (
              <S>
                <BuyerPlaceholder title="Keranjang" />
              </S>
            ),
          },
          {
            path: "checkout",
            element: (
              <S>
                <BuyerPlaceholder title="Checkout" />
              </S>
            ),
          },
          {
            path: "orders",
            element: (
              <S>
                <BuyerPlaceholder title="Pesanan Saya" />
              </S>
            ),
          },
          {
            path: "orders/:id",
            element: (
              <S>
                <BuyerPlaceholder title="Detail Pesanan" />
              </S>
            ),
          },
          {
            path: "account",
            element: (
              <S>
                <AccountPage />
              </S>
            ),
          },
        ],
      },
    ],
  },

  // ── SELLER DASHBOARD ─────────────────────────────────────
  {
    element: <RoleGuard role="SELLER" />,
    children: [
      {
        path: "seller",
        element: <DashboardLayout sidebarItems={sellerNav} roleColor="amber" />,
        children: [
          {
            index: true,
            element: (
              <S>
                <SellerDashboardPage />
              </S>
            ),
          },
          {
            path: "store",
            element: (
              <S>
                <SellerPlaceholder title="Toko Saya" />
              </S>
            ),
          },
          {
            path: "store/create",
            element: (
              <S>
                <SellerPlaceholder title="Buat Toko" />
              </S>
            ),
          },
          {
            path: "products",
            element: (
              <S>
                <SellerPlaceholder title="Produk Saya" />
              </S>
            ),
          },
          {
            path: "products/create",
            element: (
              <S>
                <SellerPlaceholder title="Tambah Produk" />
              </S>
            ),
          },
          {
            path: "products/:id/edit",
            element: (
              <S>
                <SellerPlaceholder title="Edit Produk" />
              </S>
            ),
          },
          {
            path: "orders",
            element: (
              <S>
                <SellerPlaceholder title="Pesanan Masuk" />
              </S>
            ),
          },
          {
            path: "orders/:id",
            element: (
              <S>
                <SellerPlaceholder title="Detail Pesanan" />
              </S>
            ),
          },
          {
            path: "income",
            element: (
              <S>
                <SellerPlaceholder title="Laporan Pendapatan" />
              </S>
            ),
          },
          {
            path: "account",
            element: (
              <S>
                <AccountPage />
              </S>
            ),
          },
        ],
      },
    ],
  },

  // ── DRIVER DASHBOARD ─────────────────────────────────────
  {
    element: <RoleGuard role="DRIVER" />,
    children: [
      {
        path: "driver",
        element: <DashboardLayout sidebarItems={driverNav} roleColor="blue" />,
        children: [
          {
            index: true,
            element: (
              <S>
                <DriverDashboardPage />
              </S>
            ),
          },
          {
            path: "jobs",
            element: (
              <S>
                <DriverPlaceholder title="Cari Pekerjaan" />
              </S>
            ),
          },
          {
            path: "jobs/:id",
            element: (
              <S>
                <DriverPlaceholder title="Detail Job" />
              </S>
            ),
          },
          {
            path: "active",
            element: (
              <S>
                <DriverPlaceholder title="Job Aktif" />
              </S>
            ),
          },
          {
            path: "history",
            element: (
              <S>
                <DriverPlaceholder title="Riwayat Job" />
              </S>
            ),
          },
          {
            path: "earnings",
            element: (
              <S>
                <DriverPlaceholder title="Penghasilan" />
              </S>
            ),
          },
          {
            path: "account",
            element: (
              <S>
                <AccountPage />
              </S>
            ),
          },
        ],
      },
    ],
  },

  // ── ADMIN DASHBOARD ──────────────────────────────────────
  {
    element: <RoleGuard role="ADMIN" />,
    children: [
      {
        path: "admin",
        element: <DashboardLayout sidebarItems={adminNav} roleColor="purple" />,
        children: [
          {
            index: true,
            element: (
              <S>
                <AdminDashboardPage />
              </S>
            ),
          },
          {
            path: "users",
            element: (
              <S>
                <AdminPlaceholder title="Users" />
              </S>
            ),
          },
          {
            path: "stores",
            element: (
              <S>
                <AdminPlaceholder title="Toko" />
              </S>
            ),
          },
          {
            path: "products",
            element: (
              <S>
                <AdminPlaceholder title="Produk" />
              </S>
            ),
          },
          {
            path: "orders",
            element: (
              <S>
                <AdminPlaceholder title="Pesanan" />
              </S>
            ),
          },
          {
            path: "deliveries",
            element: (
              <S>
                <AdminPlaceholder title="Pengiriman" />
              </S>
            ),
          },
          {
            path: "overdue",
            element: (
              <S>
                <AdminPlaceholder title="Overdue" />
              </S>
            ),
          },
          {
            path: "vouchers",
            element: (
              <S>
                <AdminPlaceholder title="Voucher" />
              </S>
            ),
          },
          {
            path: "promos",
            element: (
              <S>
                <AdminPlaceholder title="Promo" />
              </S>
            ),
          },
        ],
      },
    ],
  },

  // ── ERROR PAGES ──────────────────────────────────────────
  {
    path: "unauthorized",
    element: (
      <S>
        <UnauthorizedPage />
      </S>
    ),
  },
  {
    path: "*",
    element: (
      <S>
        <NotFoundPage />
      </S>
    ),
  },
]);
