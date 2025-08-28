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
      return "text-[16px]";
    case 1:
      return "text-[15px]";
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
      <ul className="flex flex-col gap-[10px] w-full">
        {menu?.map((item: any, index: number) => {
          const currentPath = `${path}/${item.title}-${index}`;
          return (
            <li key={item.id || item.name + index} className="w-full">
              {item?.children ? (
                <AccordionItem
                  value={currentPath}
                  className={`border-0 w-full transition-all duration-100`}
                >
                  <div className={`flex flex-col w-full ${isExpended ? 'px-2' : 'px-0'}`}>
                    {!isExpended ? (
                      <>
                        <CustomToolTip title={item?.title} placement="right">
                          <IconButton
                            className="w-full px-0 my-1.5 rounded-md cursor-pointer transition-all duration-600 ease-in-out hover:bg-gray-500/20 flex justify-center items-center"
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
                          className="w-full py-2 m-0 leading-none hover:no-underline cursor-pointer rounded-md hover:bg-gray-500/20 hover:rounded-[20px]"
                          onClick={() => {
                            setAccordionValues({
                              ...accordionValues,
                              [path]: currentPath,
                            });
                          }}
                        >
                          <div className="w-full px-2 flex items-center cursor-pointer rounded-md gap-2 min-w-0">
                            {isNew && (
                              <DynamicIcon name={item.icon} size="medium" />
                            )}
                            <span
                              className={`${getTextSize(level)} font-[500] truncate`}
                            >
                              {item.title}
                            </span>
                          </div>
                        </AccordionTrigger>

                        {item.children && (
                          <AccordionContent className="mx-2 border-l-2 border-black">
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
                  className={`flex items-center justify-between w-full ${isExpended ? 'px-2' : 'px-0'} rounded-md`}
                >
                  {!isExpended ? (
                    <CustomToolTip
                      title={isExpended ? "" : item?.title}
                      placement={"right"}
                    >
                      <IconButton
                        className={`w-full rounded-md cursor-pointer p-0 flex items-center justify-center hover:bg-gray-500/20 hover:rounded-[20px]`}
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
                            className={`${getTextSize(level)} font-[500] ml-2 truncate`}
                          >
                            {item.title}
                          </span>
                        )}
                      </IconButton>
                    </CustomToolTip>
                  ) : (
                    <Link
                      to={item?.path}
                      className={`w-full rounded-md cursor-pointer p-2 flex items-center gap-[10px] min-w-0 ${
                        isExpended &&
                        " hover:bg-gray-500/20 hover:rounded-[20px]"
                      } 
                      `}
                      onClick={() => {
                        setAccordionValues({});
                        toggleDrawerClose();
                      }}
                    >
                      {isNew && <DynamicIcon name={item.icon} size="medium" />}

                      {isExpended && (
                        <span className={`${getTextSize(level)} font-[500] truncate`}>
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
    <div className="w-full h-[calc(100vh-90px)] flex flex-row overflow-hidden">
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        {/* Sidebar container */}
        <div
          className={`${
            isExpended ? "w-[280px] min-w-[280px] max-w-[320px]" : "w-[60px] min-w-[60px]"
          } flex flex-col transition-all shadow-md z-999 shadow-[#2eacb3] duration-500 ease-in-out overflow-hidden`}
        >
          {/* Profile section */}
          {isExpended && (
            <>
              {" "}
              <div className="flex flex-col justify-center items-center px-2 py-1 transition-all duration-500 ease-in-out min-w-0">
                <div className="flex ml-auto mt-1">
                  <CustomToolTip title="Collapse" placement="right">
                    <IconButton
                      className="cursor-pointer rounded-md transition-all duration-300 ease-in-out hover:bg-gray-100"
                      onClick={() => setIsExpended(false)}
                    >
                      <ArrowBackIcon />
                    </IconButton>
                  </CustomToolTip>
                </div>
                <div className="flex flex-col items-center text-center py-1 gap-y-1 w-full min-w-0">
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
                  <h2 className="mt-2 break-words max-w-full text-[1.3rem] font-semibold truncate">
                    {/*@ts-ignore */}
                    {user?.name}
                  </h2>
                  <h2 className="break-words max-w-full text-[0.92rem] font-medium truncate">
                    {/* @ts-ignore */}
                    {user?.role}
                  </h2>
                  <h2 className="break-words max-w-full text-[0.90rem] font-medium truncate">
                    {/* @ts-ignore */}
                    {user?.dept}
                  </h2>
                  <p className="break-words max-w-full text-[0.9rem] font-medium truncate">
                    {/* @ts-ignore */}
                    {user?.id}
                  </p>
                </div>
              </div>
              <Divider className="w-[90%] self-center" />{" "}
            </>
          )}
          {/* Scrollable menu section */}

          <div
            className={`flex-1 ${
              !isExpended && "flex items-center justify-center"
            } custom-scrollbar-for-menu overflow-y-auto overflow-x-hidden will-change-transform my-2 transition-all duration-400 ease-in-out`}
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
                <CustomToolTip title="Expand" placement="right">
                  <IconButton
                    onClick={() => {
                      setIsExpended(!isExpended);
                    }}
                    className={`cursor-pointer rounded-md transition-all duration-500 ease-in-out`}
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden will-change-transform w-full">
        <Outlet />
      </div>
      <CustomDrawer />
    </div>
  );
};

export default SideMenuBar;
