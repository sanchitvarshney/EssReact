export const getStatusStyle = (title: string) => {
    const statusLower = title.toLowerCase();

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
      case "work from home":
      case "wfh":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-300",
        };
      case "mis":
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
      case "p/sl":
      case "sick leave":
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
          // bgColor: "bg-red-100",
          textColor: "text-gray-900",
          borderColor: "border-gray-300",
        };
    }
  };

 