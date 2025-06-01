
import React from 'react';
import AdminLayout from '../components/Layout/AdminLayout';
import Dashboard from '../components/Dashboard/Dashboard';

const DashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <Dashboard />
    </AdminLayout>
  );
};

export default DashboardPage;
