import React from "react";
import AdminLayout from "../components/Layout/AdminLayout";
import CategoryManagement from "../components/Categories/CategoryManagement";

const CategoriesPage: React.FC = () => {
  return (
    <AdminLayout>
      <CategoryManagement />
    </AdminLayout>
  );
};

export default CategoriesPage;
