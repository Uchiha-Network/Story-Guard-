 import { Clock, Shield, Search, AlertCircle } from 'lucide-react';

interface Activity {
  id: string;
  type: 'scan' | 'register' | 'violation' | 'dispute';
  message: string;
  time: string;
}

export default function RecentActivity() {
  const activities: Activity[] = [
    {
      id: '1', 
      type: 'violation',
      message: 'New violation detected on Instagram',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'scan',
      message: 'Completed scan of 250 social media profiles',
      time: '5 hours ago',
    },
    {
      id: '3',
      type: 'register',
      message: 'Registered 5 new images on Story Protocol',
      time: '1 day ago',
    },
    {
      id: '4',
      type: 'dispute',
      message: 'Dispute filed for sunset-beach.jpg',
      time: '2 days ago',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'violation':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'scan':
        return <Search className="h-5 w-5 text-blue-500" />;
      case 'register':
        return <Shield className="h-5 w-5 text-green-500" />;
      case 'dispute':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
            <div className="mt-1">{getIcon(activity.type)}</div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">{activity.message}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-purple-600 hover:text-purple-800 text-sm font-semibold">
        View All Activity →
      </button>
    </div>
  );
}