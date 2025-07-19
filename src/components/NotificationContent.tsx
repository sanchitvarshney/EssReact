import { Card } from "@mui/material";
import type { FC } from "react";
import { Bell, Clock, CheckCircle } from "lucide-react";

type NotificationContentPropsType = {
  title: string;
  message: any;
  time: string;
  read?: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
};

const NotificationContent: FC<NotificationContentPropsType> = ({
  title,
  message,
  time,
  read = false,
  type = 'info'
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-50 to-emerald-50',
          border: 'border-green-200',
          icon: 'bg-green-100 text-green-600',
          dot: 'bg-green-500'
        };
      case 'warning':
        return {
          bg: 'from-amber-50 to-yellow-50',
          border: 'border-amber-200',
          icon: 'bg-amber-100 text-amber-600',
          dot: 'bg-amber-500'
        };
      case 'error':
        return {
          bg: 'from-red-50 to-pink-50',
          border: 'border-red-200',
          icon: 'bg-red-100 text-red-600',
          dot: 'bg-red-500'
        };
      default:
        return {
          bg: 'from-blue-50 to-cyan-50',
          border: 'border-blue-200',
          icon: 'bg-blue-100 text-blue-600',
          dot: 'bg-blue-500'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <Card
      elevation={0}
      sx={{ 
        borderRadius: "12px",
        transition: "all 0.2s ease",
        border: read ? '1px solid #e5e7eb' : '1px solid #d1d5db',
        backgroundColor: read ? '#ffffff' : '#fefefe',
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          borderColor: read ? '#d1d5db' : '#9ca3af',
        }
      }}
      className={`py-3 px-4 cursor-pointer relative ${read ? 'opacity-75' : ''}`}
    >
      {/* Unread indicator */}
      {!read && (
        <div className={`absolute top-4 left-2 w-2 h-2 rounded-full ${styles.dot}`} />
      )}
      
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${styles.icon}`}>
            {read ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h5 className={`text-sm font-semibold leading-tight mb-1 ${read ? 'text-gray-600' : 'text-gray-900'}`}>
                {title}
              </h5>
              <p className={`text-sm leading-relaxed line-clamp-2 ${read ? 'text-gray-500' : 'text-gray-700'}`}>
                {message}
              </p>
            </div>
            
            {/* Time */}
            <div className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span className="whitespace-nowrap">{time}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NotificationContent;
