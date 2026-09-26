import DynamicIcon from "../reuseable/DynamicIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/CustomAccordion";
import React from "react";
import { Link, Outlet } from "react-router-dom";

import CustomToolTip from "../reuseable/CustomToolTip";

import type { MenuItem } from "../../types/dummytypes";
import { IconButton } from "@mui/material";
import CustomDrawer from "../CustomDrawer";
import { useDrawerContext } from "../../contextapi/DrawerContextApi";

const getTextSize = (level: number) => {
  switch (level) {
    case 0: return "text-[14px]";
    case 1: return "text-[13px]";
    default: return "text-[14px]";
  }
};

export const renderMenu = (
  menu: MenuItem[] | null,
  isNew: boolean,
  isExpended: boolean,
  setIsExpended: any,
  accordionValues: any,
  setAccordionValues: (value: { [key: string]: string }) => void,
  navigate?: any,
  level: number = 0,
  path: string = "",
  activePath?: string
) => {
  const { toggleDrawerClose } = useDrawerContext();
  return (
    <Accordion
      type="single"
      collapsible
      value={accordionValues[path] || ""}
      onValueChange={(val) =>
        setAccordionValues({ ...accordionValues, [path]: val })
      }
    >
      <ul className="flex flex-col gap-1.5 w-full">
        {menu?.map((item: any, index: number) => {
          const currentPath = `${path}/${item.title}-${index}`;
          const isActive = Boolean(
            activePath && item?.path && item.path && activePath === item.path
          );

          return (
            <li key={item.id || item.name + index} className="w-full">
              {item?.children ? (
                <AccordionItem
                  value={currentPath}
                  className="border-0 w-full transition-all duration-100"
                >
                  <div className={`flex flex-col w-full ${isExpended ? "px-2" : "px-0"}`}>
                    {!isExpended ? (
                      <CustomToolTip title={item?.title} placement="right">
                        <IconButton
                          className="w-full px-0 my-1 rounded-xl cursor-pointer transition-all duration-200 flex justify-center items-center"
                          sx={{
                            "&:hover": { bgcolor: "#e0f6f6" },
                            borderRadius: 2,
                          }}
                          onClick={() => {
                            if (!isExpended) {
                              setIsExpended(true);
                              setAccordionValues({
                                ...accordionValues,
                                [path]: currentPath,
                              });
                            }
                          }}
                        >
                          <DynamicIcon name={item.icon} size="medium" />
                        </IconButton>
                      </CustomToolTip>
                    ) : (
                      <>
                        <AccordionTrigger
                          className="w-full py-2 m-0 leading-none hover:no-underline cursor-pointer rounded-xl hover:bg-[#e0f6f6] transition-colors duration-150"
                          onClick={() => {
                            setAccordionValues({
                              ...accordionValues,
                              [path]: currentPath,
                            });
                          }}
                        >
                          <div className="w-full px-2 flex items-center cursor-pointer gap-2.5 min-w-0">
                            {isNew && <DynamicIcon name={item.icon} size="medium" />}
                            <span className={`${getTextSize(level)} font-medium truncate text-gray-700`}>
                              {item.title}
                            </span>
                          </div>
                        </AccordionTrigger>

                        {item.children && (
                          <AccordionContent className="mx-2 border-l-2 border-[#00a0a0]/40 pl-1">
                            {renderMenu(
                              item.children,
                              false,
                              isExpended,
                              setIsExpended,
                              accordionValues,
                              setAccordionValues,
                              navigate,
                              level + 1,
                              currentPath,
                              activePath
                            )}
                          </AccordionContent>
                        )}
                      </>
                    )}
                  </div>
                </AccordionItem>
              ) : (
                <div
                  className={`flex items-center justify-between w-full ${isExpended ? "px-2" : "px-0"} rounded-xl`}
                >
                  {!isExpended ? (
                    <CustomToolTip
                      title={isExpended ? "" : item?.title}
                      placement="right"
                    >
                      <IconButton
                        className="w-full rounded-xl cursor-pointer p-0 flex items-center justify-center"
                        sx={{
                          bgcolor: isActive ? "#e0f6f6" : "transparent",
                          "&:hover": { bgcolor: "#e0f6f6" },
                          borderRadius: 2,
                          py: 0.75,
                        }}
                        onClick={() => {
                          navigate(item?.path);
                          setAccordionValues({});
                          toggleDrawerClose();
                        }}
                      >
                        {isNew && <DynamicIcon name={item.icon} size="medium" />}
                        {isExpended && (
                          <span className={`${getTextSize(level)} font-medium ml-2 truncate`}>
                            {item.title}
                          </span>
                        )}
                      </IconButton>
                    </CustomToolTip>
                  ) : (
                    <Link
                      to={item?.path}
                      className={`relative w-full rounded-xl cursor-pointer py-2 px-2.5 flex items-center gap-2.5 min-w-0 transition-colors duration-150 ${
                        isActive
                          ? "bg-[#e0f6f6] text-[#007f86]"
                          : "hover:bg-[#e0f6f6] hover:text-[#00a0a0] text-gray-700"
                      }`}
                      onClick={() => {
                        setAccordionValues({});
                        toggleDrawerClose();
                      }}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[#00a0a0]" />
                      )}
                      {isNew && <DynamicIcon name={item.icon} size="medium" />}
                      {isExpended && (
                        <span className={`${getTextSize(level)} ${isActive ? "font-semibold" : "font-medium"} truncate`}>
                          {item.title}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Accordion>
  );
};

interface CustomSideBarMenuProps {
  children?: React.ReactNode;
}

// The persistent desktop navigation now lives in DashboardRail (mounted by MainLayout);
// this wrapper only renders the routed page plus the mobile drawer (which reuses renderMenu).
const SideMenuBar: React.FC<CustomSideBarMenuProps> = () => (
  <>
    <div className="w-full h-full">
      <Outlet />
    </div>
    <CustomDrawer />
  </>
);

export default SideMenuBar;
