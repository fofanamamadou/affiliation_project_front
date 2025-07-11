import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import InfluenceurLayout from './layouts/InfluenceurLayout';

// Components
import PrivateRoute from './components/PrivateRoute';
import RootRedirect from './components/RootRedirect';

// Pages
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import AffiliationForm from './pages/public/AffiliationForm';
import AdminDashboard from './pages/admin/AdminDashboard';
import InfluenceurList from './pages/admin/InfluenceurList';
import ProspectList from './pages/admin/ProspectList';
import InfluenceurDashboard from './pages/influenceur/InfluenceurDashboard';
import InfluenceurProspectList from './pages/influenceur/ProspectList';
import RemiseList from './pages/admin/RemiseList';
import RemiseStats from './pages/admin/RemiseStats';
import InfluenceurRemiseList from './pages/influenceur/RemiseList';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <Routes>
        {/* Routes publiques - pages autonomes */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="affiliation/:codeAffiliation" element={<AffiliationForm />} />

        {/* Routes Admin */}
        <Route path="/admin" element={<PrivateRoute userType="superuser" />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="influenceurs" element={<InfluenceurList />} />
            <Route path="prospects" element={<ProspectList />} />
            <Route path="remises" element={<RemiseList />} />
            <Route path="statistiques" element={<RemiseStats />} />
          </Route>
        </Route>

        {/* Routes Influenceur */}
        <Route path="/influenceur" element={<PrivateRoute userType="influenceur" />}>
          <Route element={<InfluenceurLayout />}>
            <Route index element={<InfluenceurDashboard />} />
            <Route path="prospects" element={<InfluenceurProspectList />} />
            <Route path="remises" element={<InfluenceurRemiseList />} />
          </Route>
        </Route>

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ConfigProvider>
  );
}

export default App; 