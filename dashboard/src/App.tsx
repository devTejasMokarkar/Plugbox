import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Admin from "./pages/Admin";
import Vendor from "./pages/Vendor";
import Users from "./pages/Users";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ease-in-out`}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={
            <>
              <Header 
                title="Admin Dashboard" 
                subtitle="Manage charger availability and monitor charging points"
              />
              <main className="p-6">
                <Admin />
              </main>
            </>
          } />
          <Route path="/vendor" element={
            <>
              <Header 
                title="Vendor Dashboard" 
                subtitle="Choose a charging point and run Hold → Start → Stop using VPS APIs"
              />
              <main className="p-6">
                <Vendor />
              </main>
            </>
          } />
          <Route path="/users" element={
            <>
              <Header 
                title="Users Management" 
                subtitle="Manage registered users and their access to charging services"
              />
              <main className="p-6">
                <Users />
              </main>
            </>
          } />
          <Route path="*" element={<div className="p-6"><h1 className="text-2xl font-bold">404 - Page Not Found</h1></div>} />
        </Routes>
      </div>
    </div>
  );
}
