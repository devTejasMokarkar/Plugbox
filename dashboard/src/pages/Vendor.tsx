import { useEffect, useState } from "react";
import { api } from "../api";
import { 
  UserPlusIcon
} from '@heroicons/react/24/outline';

type Charger = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: string;
  lastSeen: string | null;
};

type User = {
  id: string;
  name: string;
  number: string;
  address: string;
  timestamp: string;
};

export default function Vendor() {
  const [error, setError] = useState<string>("");
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    address: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  async function loadChargers() {
    setError("");
    try {
      const res = await api.get<{ chargers: Charger[] }>("/chargers");
      const list = res.data.chargers || [];
      setChargers(list);
    } catch (e: unknown) {
      setError(readErr(e) ?? "Failed to load chargers");
      setChargers([]);
    }
  }

  // Load saved users from localStorage on component mount
  useEffect(() => {
    loadChargers();
    const savedUsers = localStorage.getItem('vendorUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.name || !formData.number || !formData.address) {
      setError('Please fill in all fields');
      return;
    }

    setFormSubmitting(true);
    setError('');

    try {
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name,
        number: formData.number,
        address: formData.address,
        timestamp: new Date().toLocaleString()
      };

      // Add to users array
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);

      // Save to localStorage
      localStorage.setItem('vendorUsers', JSON.stringify(updatedUsers));

      // Clear form
      setFormData({ name: '', number: '', address: '' });

    } catch (e) {
      setError('Failed to save user data');
    } finally {
      setFormSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-warning-50 border border-warning-200 text-warning-800 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-warning-600">⚠</span>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Registered Users */}
        <div className="dashboard-card p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Registered Users</h2>
            <p className="text-sm text-gray-500 mt-1">
              Total Users: <span className="font-semibold">{users.length}</span>
            </p>
          </div>

          <div className="space-y-3">
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users registered yet
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 hover:shadow-soft transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.timestamp}</div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Phone:</span>
                      <span>{user.number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Address:</span>
                      <span className="text-gray-700">{user.address}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: User Registration Form */}
        <div className="dashboard-card p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">User Registration</h2>
            <p className="text-sm text-gray-500 mt-1">
              Register new users and save data to text file
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter user's full name"
              />
            </div>

            <div>
              <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                placeholder="Enter complete address"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={formSubmitting}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <UserPlusIcon className="w-5 h-5" />
                {formSubmitting ? 'Registering...' : 'Register User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function readErr(e: unknown): string {
  // axios-ish error: prefer response body
  const error = e as { response?: { data?: unknown }; message?: string };
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (typeof data === "object" && data !== null && "error" in data) {
    return String((data as Record<string, unknown>).error);
  }
  return error?.message ?? "Unknown error";
}
