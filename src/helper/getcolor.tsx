export const getStatusStyle = (title: string) => {
    const statusLower = title?.toLowerCase();

    switch (statusLower) {
      case "p":
        return {
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          // borderColor: "border-green-300",
        };
      case "a":
        return {
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-300",
        };
      // case "work from home":
      // case "hld":
      //   return {
      //     bgColor: "bg-blue-100",
      //     textColor: "text-blue-800",
      //     borderColor: "border-blue-300",
      //   };
    
      case "mis":
        return {
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-600",
          borderColor: "border-yellow-300",
        };
           case "hd":
        return {
          bgColor: "bg-teal-100",
          textColor: "text-teal-600",
          borderColor: "border-teal-300",
        };
      case "sl":
      case "el":
        return {
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
          borderColor: "border-orange-300",
        };
      case "srt":
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-300",
        };
      // case "el":
      // case "earned leave":
      //   return {
      //     bgColor: "bg-indigo-100",
      //     textColor: "text-indigo-800",
      //     borderColor: "border-indigo-300",
      //   };

      case "weekly off":
      case "off":
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-300",
        };
    
      case "wo":
        return {
          // bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-300",
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-900",
          borderColor: "border-gray-300",
        };
    }
  };


  export const getTitleStyle = (key: string) => {
    switch (key?.toLowerCase()) {
      case "p":
        return {
          bg: "#dcfce7",
          color: "#166534",
          label: "Present",
        };
  
      case "a":
        return {
          bg: "#fee2e2",
          color: "#991b1b",
          label: "Absent",
        };
  
      case "work from home":
      case "wfh":
        return {
          bg: "#f3f4f6",
          color: "#101828",
          label: key.toUpperCase(),
        };
  
      case "mis":
        return {
          bg: "#fef9c3",
          color: "#a16207",
          label: "Mispunch",
        };
  
      case "hd":
        return {
          bg: "#cbfbf1",
          color: "#0a9b8e",
          label: "Half Day",
        };
  
      case "sl":
      case "sick leave":
        return {
          bg: "#ffedd5",
          color: "#c2410c",
          label: "Sick Leave",
        };
  
      case "srt":
        return {
          bg: "#f3f4f6",
          color: "#101828",
          label: "Short",
        };
  
      case "el":
      case "earned leave":
        return {
          bg: "#ffedd5",
          color: "#c2410c",
          label: "Earned Leave",
        };
  
      case "weekly off":
      case "off":
      case "wo":
        return {
          bg: "#f3f4f6",
          color: "#101828",
          label: "Week Off",
        };
  
      case "od":
      case "on duty":
        return {
          bg: "#f3f4f6",
          color: "#101828",
          label: "On Duty",
        };
  
      case "hld":
        return {
          bg: "#f3f4f6",
          color: "#101828",
          label: "Holiday",
        };
  
      default:
        return {
          bg: "#f3f4f6",
          color: "#6b7280",
          label: key || "N/A",
        };
    }
  };

 