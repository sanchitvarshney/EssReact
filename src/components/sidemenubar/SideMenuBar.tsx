import DynamicIcon from "../reuseable/DynamicIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/CustomAccordion";
import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import CustomToolTip from "../reuseable/CustomToolTip";

import type { MenuItem } from "../../types/dummytypes";
import { menu } from "../../dummydata/Menu";
import { Avatar, Box, Divider, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CustomDrawer from "../CustomDrawer";
import { useDrawerContext } from "../../contextapi/DrawerContextApi";
import { useAuth } from "../../contextapi/AuthContext";

const getTextSize = (level: number) => {
  switch (level) {
    case 0:
      return "text-[18px]";
    case 1:
      return "text-[17px]";
    case 2:
      return "text-[17px]";
    default:
      return "text-[16px]";
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
  path: string = ""
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
      <ul className="flex flex-col gap-[10px]">
        {menu?.map((item: any, index: number) => {
          const currentPath = `${path}/${item.title}-${index}`;
          return (
            <li key={item.id || item.name + index}>
              {item?.children ? (
                <AccordionItem
                  value={currentPath}
                  className={`border-0  w-full transition-all duration-100`}
                >
                  <div className={`flex flex-col px-4 `}>
                    {!isExpended ? (
                      <>
                        <CustomToolTip title={item?.title} placement="right">
                          <IconButton
                            className=" px-1 my-1.5 rounded-md cursor-pointer transition-all duration-600 ease-in-out hover:bg-gray-500"
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
                            <DynamicIcon
                              name={item.icon}
                              size="medium"
                              // isExpended={isExpanded}
                            />
                          </IconButton>
                        </CustomToolTip>
                      </>
                    ) : (
                      <>
                        <AccordionTrigger
                          className="w-[100%] py-2  m-0 leading-none hover:no-underline cursor-pointer rounded-md hover:bg-[#cccccc] hover:rounded-[20px]"
                          onClick={() => {
                            setAccordionValues({
                              ...accordionValues,
                              [path]: currentPath,
                            });
                          }}
                        >
                          <div className="w-full px-1 flex items-center cursor-pointer  rounded-md gap-2">
                            {isNew && (
                              <DynamicIcon name={item.icon} size="medium" />
                            )}
                            <span
                              className={` ${getTextSize(level)} font-[500]`}
                            >
                              {item.title}
                            </span>
                          </div>
                        </AccordionTrigger>

                        {item.children && (
                          <AccordionContent className=" mx-4   border-l-2 border-black">
                            {renderMenu(
                              item.children,
                              false,
                              isExpended,
                              setIsExpended,

                              accordionValues,
                              setAccordionValues,
                              navigate,
                              level + 1,

                              currentPath
                            )}
                          </AccordionContent>
                        )}
                      </>
                    )}
                  </div>
                </AccordionItem>
              ) : (
                <div
                  className={` flex items-center justify-between w-full px-4 rounded-md `}
                >
                  {!isExpended ? (
                    <CustomToolTip
                      title={isExpended ? "" : item?.title}
                      placement={"right"}
                    >
                      <IconButton
                        // to={item?.path}
                        className={`w-full rounded-md cursor-pointer p-2 flex items-center gap-[10px] pl-1 
                        
                          hover:bg-[#cccccc] hover:rounded-[20px]
                        
                      `}
                        onClick={() => {
                          navigate(item?.path);
                          setAccordionValues({});
                          toggleDrawerClose();
                        }}
                      >
                        {isNew && (
                          <DynamicIcon name={item.icon} size="medium" />
                        )}

                        {isExpended && (
                          <span
                            className={`${getTextSize(level)} font-[500] ml-2 `}
                          >
                            {item.title}
                          </span>
                        )}
                      </IconButton>
                    </CustomToolTip>
                  ) : (
                    <Link
                      to={item?.path}
                      className={`w-full rounded-md cursor-pointer p-2 flex items-center gap-[10px]  ${
                        isExpended && " hover:bg-[#cccccc] hover:rounded-[20px]"
                      } 
                      `}
                      onClick={() => {
                        setAccordionValues({});
                        toggleDrawerClose();
                      }}
                    >
                      {isNew && <DynamicIcon name={item.icon} size="medium" />}

                      {isExpended && (
                        <span className={`${getTextSize(level)} font-[500]  `}>
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
  //   item:any
}

const SideMenuBar: React.FC<CustomSideBarMenuProps> = () => {
  const { user } = useAuth();
  const { isExpended, setIsExpended, accordionValues, setAccordionValues } =
    useDrawerContext();
  const navigate = useNavigate();

  return (
    <div className="w-full h-[calc(100vh-90px)] flex flex-row ">
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        {/* Sidebar container */}
        <div
          className={`${
            isExpended ? "w-[40vh] " : "w-[10vh] "
          } flex flex-col  transition-all shadow-md  z-999 shadow-[#2eacb3]  duration-500 ease-in-out`}
        >
          {/* Profile section */}
          {isExpended && (
            <>
              {" "}
              <div className="flex flex-col justify-center items-center px-2 py-1 transition-all duration-500 ease-in-out">
                <div className="flex ml-auto">
                  <CustomToolTip title="Expand" placement="right">
                    <div
                      className="cursor-pointer rounded-md transition-all duration-300 ease-in-out hover:bg-gray-100"
                      onClick={() => setIsExpended(false)}
                    >
                      <ArrowBackIcon />
                    </div>
                  </CustomToolTip>
                </div>
                <div className="flex flex-col items-center text-center py-1 gap-y-1 w-full ">
                  <Avatar
                    //@ts-ignore
                    alt={user?.name}
                    //@ts-ignore
                    src={user?.imgUrl}
                    sx={{
                      width: 80,
                      height: 80,
                      backgroundColor: "#2eacb3",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  />
                  <h2 className="mt-2 break-words max-w-full text-[1.3rem] font-semibold ">
                    {/*@ts-ignore */}
                    {user?.name}
                  </h2>
                  <h2 className=" break-words max-w-full text-[0.92rem] font-medium  ">
                    {/* @ts-ignore */}
                    {user?.role}
                  </h2>
                  <h2 className=" break-words max-w-full text-[0.90rem] font-medium ">
                    {/* @ts-ignore */}
                    {user?.dept}
                  </h2>
                  <p className=" break-words max-w-full text-[0.9rem] font-medium ">
                    {/* @ts-ignore */}
                    {user?.id}
                  </p>
                </div>
              </div>
              <Divider className="w-[90%] self-center " />{" "}
            </>
          )}
          {/* Scrollable menu section */}

          <div
            className={`flex-1 ${
              !isExpended && "flex items-center"
            } custom-scrollbar-for-menu  overflow-y-auto   will-change-transform my-2 transition-all duration-400 ease-in-out`}
          >
            {renderMenu(
              menu,
              true,
              isExpended,
              setIsExpended,
              accordionValues,
              setAccordionValues,
              navigate
            )}
          </div>

          {!isExpended && (
            <div className="flex self-center mb-4">
              <div>
                <CustomToolTip title="Expend" placement="right">
                  <IconButton
                    onClick={() => {
                      setIsExpended(!isExpended);
                    }}
                    className={` cursor-pointer rounded-md transition-all duration-500 ease-in-out `}
                  >
                    <ArrowForwardIcon sx={{ color: "#000" }} />
                  </IconButton>
                </CustomToolTip>
              </div>
            </div>
          )}
        </div>
      </Box>
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto  will-change-transform w-full ">
        <Outlet />
      </div>
      <CustomDrawer />
    </div>
  );
};

export default SideMenuBar;
