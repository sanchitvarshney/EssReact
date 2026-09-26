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

 