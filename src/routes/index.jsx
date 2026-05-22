import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

import HomePage from "../pages/public/HomePage";
import AboutPage from "../pages/public/AboutPage";
import PublicationsPage from "../pages/public/PublicationsPage";
import PublicationDetailPage from "../pages/public/PublicationDetailPage";
import CommissionsPage from "../pages/public/CommissionsPage";
import SchedulePage from "../pages/public/SchedulePage";
import GalleryPage from "../pages/public/GalleryPage";
import ContactPage from "../pages/public/ContactPage";

import LoginPage from "../pages/admin/LoginPage";
import DashboardPage from "../pages/admin/DashboardPage";
import ArticlesPage from "../pages/admin/ArticlesPage";
import CashflowPage from "../pages/admin/CashflowPage";
import IncomePage from "../pages/admin/IncomePage";
import ExpensePage from "../pages/admin/ExpensePage";
import ReportPage from "../pages/admin/ReportPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tentang-kami" element={<AboutPage />} />
        <Route path="/publikasi" element={<PublicationsPage />} />
        <Route path="/publikasi/:slug" element={<PublicationDetailPage />} />
        <Route path="/komisi" element={<CommissionsPage />} />
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
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="cashflow" element={<CashflowPage />} />
        <Route path="income" element={<IncomePage />} />
        <Route path="expense" element={<ExpensePage />} />
        <Route path="reports" element={<ReportPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}