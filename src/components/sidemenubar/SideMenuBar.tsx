import DynamicIcon from "../reuseable/DynamicIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/CustomAccordion";
import React from "react";
import { Link } from "react-router-dom";

// import {  useAppSelector } from "../../hooks/useReduxHook";

// import CircularProgress from "@mui/material/CircularProgress";
// import { Box } from "@mui/material";
// import { Menu } from "@/features/menu/menuType";

import CustomToolTip from "../reuseable/CustomToolTip";

import type { MenuItem } from "../../types/dummytypes";
import { menu } from "../../dummydata/Menu";
import { Avatar, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const getTextSize = (level: number) => {
  switch (level) {
    case 0:
      return "text-[19px]";
    case 1:
      return "text-[18px]";
    case 2:
      return "text-[17px]";
    default:
      return "text-[16px]";
  }
};
const renderMenu = (
  menu: MenuItem[] | null,
  isNew: boolean,

  level: number = 0
) => {
  return (
    <Accordion type="single" collapsible>
      <ul className="flex flex-col gap-[20px]">
        {menu?.map((item: any, index: number) => {
          return (
            <li key={item.id || item.name + index}>
              {item?.children ? (
                <AccordionItem
                  value={`${index + item.title}`}
                  className="border-0 w-full transition-all duration-100"
                >
                  <div className="flex flex-col px-2">
                    <AccordionTrigger className="w-[100%] py-1   m-0 leading-none hover:no-underline rounded-md hover:bg-white">
                      <div className="w-full p-1 flex items-center cursor-pointer rounded-md gap-2">
                        {isNew && (
                          <DynamicIcon name={item.icon} size="medium" />
                        )}
                        <span className={` ${getTextSize(level)} font-[500]`}>
                          {item.title}
                        </span>
                      </div>
                    </AccordionTrigger>

                    {item.children && (
                      <AccordionContent className=" mx-4  border-l-2 border-black">
                        {renderMenu(
                          item.children,

                          false,

                          level + 1
                        )}
                      </AccordionContent>
                    )}
                  </div>
                </AccordionItem>
              ) : (
                <CustomToolTip title={item.name} placement="right">
                  <div
                    className={` flex items-center justify-between w-full px-2 rounded-md `}
                  >
                    <Link
                      to={item?.url}
                      className={`w-full rounded-md cursor-pointer flex items-center gap-[10px] pl-1 hover:bg-white p-[6px]
                      `}
                    >
                      {isNew && <DynamicIcon name={item.icon} size="medium" />}

                      <span className={`${getTextSize(level)} font-[500]`}>
                        {item.title}
                      </span>
                    </Link>
                  </div>
                </CustomToolTip>
              )}
            </li>
          );
        })}
      </ul>
    </Accordion>
  );
};

interface CustomSideBarMenuProps {
  children: React.ReactNode;
  //   item:any
}

const SideMenuBar: React.FC<CustomSideBarMenuProps> = ({ children }) => {
  // const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Sidebar container */}
      <div className="w-[40vh] flex flex-col overflow-y-auto h-[90vh]">
        {/* Profile section */}
        <div className="flex flex-col justify-center items-center p-2">
          <div className="flex ml-auto">
            <CustomToolTip title="Expand" placement="right">
              <div className="cursor-pointer rounded-md transition">
                <ArrowBackIcon />
              </div>
            </CustomToolTip>
          </div>
          <div className="flex flex-col items-center text-center px-5 py-2 gap-y-1 w-full ">
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/2.jpg"
              sx={{ width: 80, height: 80 }}
            />
            <h2 className="mt-2 break-words max-w-full text-[1.3rem] font-semibold ">Rahul Kumar</h2>
            <h2 className=" break-words max-w-full text-[1rem] font-medium  ">
              Assistant Manager
            </h2>
            <h2 className=" break-words max-w-full text-[1rem] font-medium ">Marketing</h2>
            <p className=" break-words max-w-full text-[0.9rem] font-medium ">EMP-1003</p>
            <p className=" break-words max-w-full text-[1rem] font-normal">rahul.mehra@company.com</p>
          </div>
        </div>
        <Divider className="w-[90%] self-center " />
        {/* Scrollable menu section */}
        <div className="flex-1  custom-scrollbar-for-menu p-1  mt-2">
          {renderMenu(menu, true)}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto w-full">{children}</div>
    </div>
  );
};

export default SideMenuBar;
