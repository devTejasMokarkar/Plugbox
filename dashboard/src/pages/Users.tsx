import { useEffect, useState } from "react";
import { usersApi } from "../api";
import StatusPill from "../components/StatusPill";

type User = {
  id: number;
  name: string;
  number: string;
  address: string;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
};

type FormData = {
  name: string;
  number: string;
  address: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    number: "",
    address: "",
  });

  // Load users from database
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getAll();
      setUsers(response.data.users);
      setError(null);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Create new user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usersApi.create(formData);
      setFormData({ name: "", number: "", address: "" });
      setShowAddForm(false);
      loadUsers();
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user");
    }
  };

  // Update user
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    try {
      await usersApi.update(editingUser.id, {
        ...formData,
        isOnline: editingUser.isOnline,
      });
      setEditingUser(null);
      setFormData({ name: "", number: "", address: "" });
      loadUsers();
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user");
    }
  };

  // Toggle user status
  const handleToggleStatus = async (user: User) => {
    try {
      await usersApi.updateStatus(user.id, !user.isOnline);
      loadUsers();
    } catch (err) {
      console.error("Error updating user status:", err);
      setError("Failed to update user status");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await usersApi.delete(userId);
      loadUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    }
  };

  // Start editing user
  const startEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      number: user.number,
      address: user.address,
    });
  };

  // Cancel form
  const cancelForm = () => {
    setShowAddForm(false);
    setEditingUser(null);
    setFormData({ name: "", number: "", address: "" });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const activeUsers = users.filter(user => user.isOnline).length;
  const inactiveUsers = users.filter(user => !user.isOnline).length;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="dashboard-card p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
        </div>
        <div className="dashboard-card p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          <p className="text-2xl font-bold text-green-600 mt-1">{activeUsers}</p>
        </div>
        <div className="dashboard-card p-6">
          <h3 className="text-sm font-medium text-gray-500">Inactive Users</h3>
          <p className="text-2xl font-bold text-red-600 mt-1">{inactiveUsers}</p>
        </div>
      </div>

      {/* Users Section */}
      <div className="dashboard-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Users Management</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage registered users for charging services
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add User
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Add/Edit User Form */}
        {(showAddForm || editingUser) && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-md font-medium text-gray-900 mb-4">
              {editingUser ? "Edit User" : "Add New User"}
            </h3>
            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingUser ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No users registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      **** **** {user.number.slice(-4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusPill status={user.isOnline ? "online" : "offline"} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`px-3 py-1 border border-gray-300 rounded text-xs font-medium transition-colors ${
                            user.isOnline
                              ? "bg-red-600 text-white hover:bg-red-700 border-red-600"
                              : "bg-green-600 text-white hover:bg-green-700 border-green-600"
                          }`}
                        >
                          {user.isOnline ? "Offline" : "Online"}
                        </button>
                        <button
                          onClick={() => startEditUser(user)}
                          className="px-3 py-1 border border-blue-300 text-blue-700 rounded text-xs font-medium hover:bg-blue-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-3 py-1 border border-red-300 text-red-700 rounded text-xs font-medium hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
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
