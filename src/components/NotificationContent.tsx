import { Card } from "@mui/material";
import type { FC } from "react";

type NotificationContentPropsType = {
  title: string;
  message: any;
  time: string;
};
const NotificationContent: FC<NotificationContentPropsType> = ({
  title,
  message,
  time,
}) => {
  return (
    <Card
      elevation={0}
      sx={{ borderRadius: 0 }}
      className="py-2 px-4 showdow-none bg-red-700 flex items-start gap-4 my-2 border-b-1 border-gray-600/40 rounded-none justify-between"
    >
      <div>
        {" "}
        <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h5>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {message}
        </p>
      </div>

      <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
        {time}
      </span>
    </Card>
  );
};

export default NotificationContent;
