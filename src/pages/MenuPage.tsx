import React from "react";
import AdminLayout from "../components/Layout/AdminLayout";
import MenuManagement from "../components/Menu/MenuManagement";

const MenuPage: React.FC = () => {
  return (
    <AdminLayout>
      <MenuManagement />
    </AdminLayout>
  );
};

export default MenuPage;
