import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import HomePage from "../pages/public/HomePage";
import AboutPage from "../pages/public/AboutPage";
import PublicationsPage from "../pages/public/PublicationsPage";
import PublicationDetailPage from "../pages/public/PublicationDetailPage";
import CommissionsPage from "../pages/public/CommissionsPage";
import CommissionDetailPage from "../pages/public/CommissionDetailPage";
import SchedulePage from "../pages/public/SchedulePage";
import GalleryPage from "../pages/public/GalleryPage";
import ContactPage from "../pages/public/ContactPage";

import LoginPage from "../pages/admin/LoginPage";
import AdminContentPage from "../pages/admin/AdminContentPage";
import DashboardPage from "../pages/admin/DashboardPage";
import ArticlesPage from "../pages/admin/ArticlesPage";
import CashflowPage from "../pages/admin/CashflowPage";
import IncomePage from "../pages/admin/IncomePage";
import ExpensePage from "../pages/admin/ExpensePage";
import ReportPage from "../pages/admin/ReportPage";
import FamilyListPage from "../pages/admin/jemaat/FamilyListPage";
import FamilyDetailPage from "../pages/admin/jemaat/FamilyDetailPage";
import FamilyKkjPreviewPage from "../pages/admin/jemaat/FamilyKkjPreviewPage";
import IndividualListPage from "../pages/admin/jemaat/IndividualListPage";
import IndependentIndividualsPage from "../pages/admin/jemaat/IndependentIndividualsPage";
import { accessGroups } from "../data/adminAccess";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tentang-kami" element={<AboutPage />} />
        <Route path="/publikasi" element={<PublicationsPage />} />
        <Route path="/publikasi/:slug" element={<PublicationDetailPage />} />
        <Route path="/komisi" element={<CommissionsPage />} />
        <Route path="/komisi/:slug" element={<CommissionDetailPage />} />
        <Route path="/jadwal-ibadah" element={<SchedulePage />} />
        <Route path="/galeri" element={<GalleryPage />} />
        <Route path="/kontak" element={<ContactPage />} />
      </Route>

      <Route path="/admin/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route
          path="articles"
          element={
            <RoleRoute allowedRoles={accessGroups.content}>
              <ArticlesPage />
            </RoleRoute>
          }
        />
        <Route
          path="content/:section"
          element={
            <RoleRoute allowedRoles={accessGroups.content}>
              <AdminContentPage />
            </RoleRoute>
          }
        />
        <Route
          path="content/:section/:itemSlug"
          element={
            <RoleRoute allowedRoles={accessGroups.content}>
              <AdminContentPage />
            </RoleRoute>
          }
        />
        <Route
          path="cashflow"
          element={
            <RoleRoute allowedRoles={accessGroups.finance}>
              <CashflowPage />
            </RoleRoute>
          }
        />
        <Route
          path="income"
          element={
            <RoleRoute allowedRoles={accessGroups.finance}>
              <IncomePage />
            </RoleRoute>
          }
        />
        <Route
          path="expense"
          element={
            <RoleRoute allowedRoles={accessGroups.finance}>
              <ExpensePage />
            </RoleRoute>
          }
        />
        <Route
          path="reports"
          element={
            <RoleRoute allowedRoles={accessGroups.finance}>
              <ReportPage />
            </RoleRoute>
          }
        />
        <Route
          path="jemaat"
          element={
            <RoleRoute allowedRoles={accessGroups.jemaat}>
              <Outlet />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="keluarga" replace />} />
          <Route path="keluarga" element={<FamilyListPage />} />
          <Route path="keluarga/:familyId" element={<FamilyDetailPage />} />
          <Route path="keluarga/:familyId/kkj" element={<FamilyKkjPreviewPage />} />
          <Route path="individu" element={<IndividualListPage />} />
          <Route path="individu-mandiri" element={<IndependentIndividualsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
