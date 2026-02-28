import { useEffect, useState } from "react";
import { api } from "../api";
import StatCard from "../components/StatCard";

type UserInfo = {
  id: number;
  name: string;
  number: string;
  address: string;
  isOnline: boolean;
  createdAt: string;
};

export default function Admin() {
  const [savedUsers, setSavedUsers] = useState<UserInfo[]>([]);

  // Calculate dynamic statistics
  const activeUsers = savedUsers.filter(user => user.isOnline).length;
  const inactiveUsers = savedUsers.filter(user => !user.isOnline).length;

  // Load users from localStorage (same as Vendor Dashboard)
  function loadUsers() {
    try {
      const savedUsersData = localStorage.getItem('vendorUsers');
      if (savedUsersData) {
        const users = JSON.parse(savedUsersData);
        // Transform vendor user data to admin user format
        const transformedUsers = users.map((user: any, index: number) => ({
          id: parseInt(user.id) || index,
          name: user.name,
          number: user.number,
          address: user.address,
          isOnline: false, // Default to offline
          createdAt: user.timestamp || new Date().toISOString()
        }));
        setSavedUsers(transformedUsers);
      }
    } catch (e) {
      console.error('Error loading users:', e);
    }
  }

  // Toggle user online/offline status
  async function toggleUserStatus(index: number) {
    const updatedUsers = [...savedUsers];
    updatedUsers[index].isOnline = !updatedUsers[index].isOnline;
    setSavedUsers(updatedUsers);
    
    // Save to localStorage to persist status
    try {
      localStorage.setItem('vendorUsers', JSON.stringify(
        updatedUsers.map(user => ({
          id: user.id.toString(),
          name: user.name,
          number: user.number,
          address: user.address,
          timestamp: user.createdAt
        }))
      ));
    } catch (e) {
      console.error('Error saving user status:', e);
    }
  }

  useEffect(() => {
    loadUsers();
    // Also listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vendorUsers') {
        loadUsers();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Users" value={savedUsers.length} />
        <StatCard label="Active Users" value={activeUsers} tone="success" />
        <StatCard label="Inactive Users" value={inactiveUsers} tone="danger" />
      </div>

      {/* Registered Users Section */}
      <div className="dashboard-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Registered Users</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage registered users for charging services
          </p>
        </div>

        {savedUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Control</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {savedUsers.map((user, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">**** **** {user.number.slice(-4)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isOnline 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => toggleUserStatus(index)}
                        className={`px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
                          user.isOnline
                            ? 'bg-red-600 text-white hover:bg-red-700 border-red-600'
                            : 'bg-green-600 text-white hover:bg-green-700 border-green-600'
                        }`}
                      >
                        {user.isOnline ? 'Offline' : 'Online'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

