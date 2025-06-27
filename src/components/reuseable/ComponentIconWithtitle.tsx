import  { type FC } from "react";

type ComponentIconWithtitlePropsType = {
  icon: any;
  title: string;
  view:any
};

const ComponentIconWithtitle: FC<ComponentIconWithtitlePropsType> = ({ icon, title,view }) => {
  return (
    <div className="flex items-center gap-2 p-2  min-w-[140px] max-w-full cursor-pointer" onClick={view}>
      {icon}
      <span>5</span>
      <span  className="select-none">{title}</span>
    </div>
  );
};
export default ComponentIconWithtitle;
