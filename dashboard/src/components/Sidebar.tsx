import { Link, useLocation } from "react-router-dom";
import { 
  CogIcon,
  BoltIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface SidebarItemProps {
  to: string;
  label: string;
  icon: React.ComponentType<any>;
  active: boolean;
}

function SidebarItem({ to, label, icon: Icon, active }: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={`sidebar-item ${active ? 'active' : ''}`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}

interface SidebarProps {
  isOpen?: boolean;
}

export default function Sidebar({ isOpen = true }: SidebarProps) {
  const location = useLocation();
  
  const menuItems = [
    { to: "/admin", label: "Admin Dashboard", icon: ChartBarIcon },
    { to: "/vendor", label: "Vendor Dashboard", icon: BoltIcon },
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out`}>
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <BoltIcon className="w-6 h-6 text-white" />
          </div>
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">PlugBox</h1>
              <p className="text-xs text-gray-500">EV Charging Management</p>
            </div>
          )}
        </div>
      </div>

      <nav className="px-4 pb-6">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              active={location.pathname.startsWith(item.to)}
            />
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <SidebarItem
            to="/settings"
            label="Settings"
            icon={CogIcon}
            active={location.pathname.startsWith("/settings")}
          />
        </div>
      </nav>
    </div>
  );
}
