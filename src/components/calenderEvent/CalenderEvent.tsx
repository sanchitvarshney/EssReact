import { helperFun } from "../../helper/helpermethod";

const CalenderEvent = ({ event }: { event: any }) => {
  const getStatusStyle = (title: string) => {
    const statusLower = title.toLowerCase();

    switch (statusLower) {
      case "present":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-300",
          
        };
      case "absent":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-300",
          
        };
      case "work from home":
      case "wfh":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-300",
          
        };
      case "cl":
      case "casual leave":
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-300",
          
        };
      case "sl":
      case "sick leave":
        return {
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
          borderColor: "border-orange-300",
          
        };
      case "shots":
        return {
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
          borderColor: "border-purple-300",
          
        };
      case "el":
      case "earned leave":
        return {
          bgColor: "bg-indigo-100",
          textColor: "text-indigo-800",
          borderColor: "border-indigo-300",
          
        };

      case "weekly off":
      case "off":
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-300",
        
        };
      default:
        return {
          // bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-300",
          
        };
    }
  };

  const statusStyle = getStatusStyle(event.title);

  return (
    <div
      className={`flex flex-col p-2 w-full overflow-auto`}
    >
      
      <div
        className={`flex items-center justify-center  p-1 ${statusStyle.bgColor} ${statusStyle.textColor} border ${statusStyle.borderColor}`}
      >
       
        <span className="text-xs font-semibold uppercase">{event.title}</span>
      </div>

 {event.start && event.end && ( 
  <div className="  flex flex-col">
        <span className="text-sm text-gray-600 break-all">
          {helperFun.formatTimeRange(event.start, event.end)}
        </span>
           <span className="text-sm text-gray-600 break-all">
          {event.status}
        </span>
        </div>
      )}
</div>
     

  );
};

export default CalenderEvent;
