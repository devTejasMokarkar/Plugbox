import { 
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface StatCardProps {
  label: string;
  value: number;
  tone?: "success" | "danger" | "primary";
  icon?: React.ComponentType<any>;
}

export default function StatCard({ label, value, tone = "primary", icon: Icon }: StatCardProps) {
  const getIcon = () => {
    if (Icon) return <Icon className="w-6 h-6" />;
    
    switch (tone) {
      case "success":
        return <CheckCircleIcon className="w-6 h-6" />;
      case "danger":
        return <XCircleIcon className="w-6 h-6" />;
      default:
        return <ChartBarIcon className="w-6 h-6" />;
    }
  };

  const getIconColor = () => {
    switch (tone) {
      case "success":
        return "text-success-600 bg-success-100";
      case "danger":
        return "text-danger-600 bg-danger-100";
      default:
        return "text-primary-600 bg-primary-100";
    }
  };

  const getValueColor = () => {
    switch (tone) {
      case "success":
        return "text-success-600";
      case "danger":
        return "text-danger-600";
      default:
        return "text-primary-600";
    }
  };

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${getValueColor()}`}>
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${getIconColor()}`}>
          {getIcon()}
        </div>
      </div>
    </div>
  );
}
