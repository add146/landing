import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import DashboardLayout from './layouts/DashboardLayout';
import WebsitesList from './pages/dashboard/WebsitesList';
import PagesList from './pages/dashboard/PagesList';
import MediaLibrary from './pages/dashboard/MediaLibrary';
import Settings from './pages/dashboard/Settings';
import PageEditor from './pages/editor/PageEditor';
import VCardsList from './pages/dashboard/VCardsList';
import VCardBuilder from './pages/dashboard/VCardBuilder';
import PublicVCard from './pages/public/PublicVCard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Public vCard view */}
        <Route path="/card/:slug" element={<PublicVCard />} />

        {/* Protected dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<WebsitesList />} />
          <Route path="websites/:id/pages" element={<PagesList />} />
          <Route path="vcards" element={<VCardsList />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Page Editor */}
        <Route
          path="/editor/:pageId"
          element={
            <ProtectedRoute>
              <PageEditor />
            </ProtectedRoute>
          }
        />

        {/* vCard Builder */}
        <Route
          path="/dashboard/vcards/create"
          element={
            <ProtectedRoute>
              <VCardBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/vcards/:id/edit"
          element={
            <ProtectedRoute>
              <VCardBuilder />
            </ProtectedRoute>
          }
        />

        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 404 - Redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
