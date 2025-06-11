const CalenderEvent = ({ event }: { event: any }) => {
 
  const getStatusStyle = (status: string) => {
    const statusLower = status.toLowerCase();

    switch (statusLower) {
      case "present":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-300",
          icon: "✓",
        };
      case "absent":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-300",
          icon: "✗",
        };
      case "work from home":
      case "wfh":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-300",
          icon: "🏠",
        };
      case "cl":
      case "casual leave":
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-300",
          icon: "📅",
        };
      case "sl":
      case "sick leave":
        return {
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
          borderColor: "border-orange-300",
          icon: "🏥",
        };
      case "shots":
        return {
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
          borderColor: "border-purple-300",
          icon: "💉",
        };
      case "el":
      case "earned leave":
        return {
          bgColor: "bg-indigo-100",
          textColor: "text-indigo-800",
          borderColor: "border-indigo-300",
          icon: "🎯",
        };
      
      case "weekly off":
      case "off":
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-300",
          icon: "🌅",
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-300",
          icon: "📋",
        };
    }
  };

  const statusStyle = getStatusStyle(event.status);

  return (
    <div
      className={`flex flex-col w-full h-full justify-center p-2 rounded-md border ${statusStyle.bgColor} ${statusStyle.borderColor}`}
    >
      {/* Status Badge - Most Prominent */}
      <div
        className={`flex items-center justify-center mb-1 px-2 py-1 rounded-full ${statusStyle.bgColor} ${statusStyle.textColor} border ${statusStyle.borderColor}`}
      >
        <span className="text-xs mr-1">{statusStyle.icon}</span>
        <span className="text-xs font-semibold uppercase">{event.status}</span>
      </div>

      {/* Title */}
      <span className="font-bold text-sm text-gray-900 mb-1">
        {event.title}
      </span>

      {/* Additional Info if available */}
      {event.time && (
        <span className="text-xs text-gray-600">{event.time}</span>
      )}
      {event.description && (
        <span className="text-xs text-gray-600 truncate">
          {event.description}
        </span>
      )}
    </div>
  );
};

export default CalenderEvent;
