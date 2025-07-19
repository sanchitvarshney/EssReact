import { Typography, Button, Divider } from "@mui/material";
import { Bell, Trash2 } from "lucide-react";
import NotificationContent from "../NotificationContent";
import EmptyData from "../reuseable/EmptyData";

const NotificationDropDown = () => {
  // Mock data - in real app this would come from props or context
  const notifications: any = [];

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <div className="w-full  bg-white rounded-[8px] shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                Notifications
              </Typography>
              {unreadCount > 0 && (
                <Typography sx={{ fontSize: 12, opacity: 0.9 }}>
                  {unreadCount} unread
                </Typography>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="small"
              sx={{
                color: "#ffffff",
                fontSize: "12px",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              Mark all as read
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto custom-scrollbar-for-menu">
        {notifications.length > 0 ? (
          <div className="p-3 space-y-2">
            {notifications.map((notification: any, index: any) => (
              <div key={notification.id}>
                <NotificationContent
                  title={notification.title}
                  message={notification.message}
                  time={notification.time}
                  read={notification.read}
                  type={notification.type}
                />
                {index < notifications.length - 1 && (
                  <Divider className="my-2 opacity-30" />
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="p-8 flex items-center justify-center">
            <EmptyData width="w-30 " height="h-30" />
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-gray-100 p-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <Button
              size="small"
              sx={{
                color: "#6b7280",
                fontSize: "12px",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              Mark all as read
            </Button>
            <Button
              size="small"
              startIcon={<Trash2 className="w-3 h-3" />}
              sx={{
                color: "#ef4444",
                fontSize: "12px",
                "&:hover": { backgroundColor: "rgba(239,68,68,0.04)" },
              }}
            >
              Clear all
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropDown;
