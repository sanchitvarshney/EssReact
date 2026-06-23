import DynamicIcon from "../reuseable/DynamicIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/CustomAccordion";
import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

import CustomToolTip from "../reuseable/CustomToolTip";

import type { MenuItem } from "../../types/dummytypes";
import { menu } from "../../dummydata/Menu";
import { Avatar, Box, Divider, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CustomDrawer from "../CustomDrawer";
import { useDrawerContext } from "../../contextapi/DrawerContextApi";
import { useAuth } from "../../contextapi/AuthContext";

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
                            "&:hover": { bgcolor: "#e0f7fa" },
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
                          className="w-full py-2 m-0 leading-none hover:no-underline cursor-pointer rounded-xl hover:bg-[#e0f7fa] transition-colors duration-150"
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
                          <AccordionContent className="mx-2 border-l-2 border-[#2eacb3]/40 pl-1">
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
                          bgcolor: isActive ? "#e0f7fa" : "transparent",
                          "&:hover": { bgcolor: "#e0f7fa" },
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
                          ? "bg-[#e0f7fa] text-[#0097a7]"
                          : "hover:bg-[#e0f7fa] hover:text-[#2eacb3] text-gray-700"
                      }`}
                      onClick={() => {
                        setAccordionValues({});
                        toggleDrawerClose();
                      }}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[#2eacb3]" />
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

const SideMenuBar: React.FC<CustomSideBarMenuProps> = () => {
  const { user } = useAuth();
  const { isExpended, setIsExpended, accordionValues, setAccordionValues } =
    useDrawerContext();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-full h-[calc(100vh-78px)] flex flex-row overflow-hidden">
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        {/* Sidebar container */}
        <div
          className={`${
            isExpended
              ? "w-[260px] min-w-[260px] max-w-[260px]"
              : "w-[60px] min-w-[60px]"
          } flex flex-col transition-all duration-500 ease-in-out overflow-hidden bg-white border-r border-gray-100`}
          style={{ boxShadow: "2px 0 12px rgba(0,0,0,0.05)" }}
        >
          {/* Profile section (expanded) */}
          {isExpended && (
            <>
              <div
                className="flex flex-col items-center px-4 pt-3 pb-5 min-w-0 transition-all duration-500 ease-in-out"
                style={{
                  background: "linear-gradient(160deg, #e0f7fa 0%, #f8fafc 100%)",
                }}
              >
                {/* Collapse button */}
                <div className="flex w-full justify-end mb-3">
                  <CustomToolTip title="Collapse" placement="right">
                    <IconButton
                      size="small"
                      onClick={() => setIsExpended(false)}
                      sx={{
                        color: "#64748b",
                        borderRadius: 1.5,
                        "&:hover": { bgcolor: "rgba(255,255,255,0.7)", color: "#2eacb3" },
                        transition: "all 0.2s",
                      }}
                    >
                      <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </CustomToolTip>
                </div>

                {/* Avatar */}
                <Avatar
                  //@ts-ignore
                  alt={user?.name}
                  //@ts-ignore
                  src={user?.imgUrl}
                  sx={{
                    width: 72,
                    height: 72,
                    backgroundColor: "#2eacb3",
                    border: "3px solid #fff",
                    boxShadow: "0 4px 16px rgba(46,172,179,0.25)",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                />

                {/* Name */}
                <h2 className="mt-3 text-[0.95rem] font-bold text-gray-800 truncate max-w-full text-center leading-snug">
                  {/* @ts-ignore */}
                  {user?.name}
                </h2>

                {/* Role */}
                {/* @ts-ignore */}
                {user?.role && (
                  <p className="text-[0.78rem] font-medium text-gray-500 truncate max-w-full text-center mt-0.5">
                    {/* @ts-ignore */}
                    {user?.role}
                  </p>
                )}

                {/* Department */}
                {/* @ts-ignore */}
                {user?.dept && (
                  <p className="text-[0.75rem] text-gray-400 truncate max-w-full text-center">
                    {/* @ts-ignore */}
                    {user?.dept}
                  </p>
                )}

                {/* Employee ID pill */}
                {/* @ts-ignore */}
                {user?.id && (
                  <span className="mt-2.5 text-[0.7rem] font-mono font-semibold text-[#2eacb3] bg-white border border-[#2eacb3]/30 px-3 py-0.5 rounded-full shadow-sm">
                    {/* @ts-ignore */}
                    {user?.id}
                  </span>
                )}
              </div>

              <Divider sx={{ borderColor: "#e0f7fa" }} />
            </>
          )}

          {/* Scrollable menu */}
          <div
            className={`flex-1 ${
              !isExpended ? "flex items-center justify-center" : ""
            } custom-scrollbar-for-menu overflow-y-auto overflow-x-hidden will-change-transform transition-all duration-400 ease-in-out`}
            style={{ paddingTop: 8, paddingBottom: 8 }}
          >
            <div className={`${isExpended ? "px-2" : "px-1"} w-full`}>
              {renderMenu(
                menu,
                true,
                isExpended,
                setIsExpended,
                accordionValues,
                setAccordionValues,
                navigate,
                0,
                "",
                location.pathname
              )}
            </div>
          </div>

          {/* Expand button (collapsed state) */}
          {!isExpended && (
            <div className="flex self-center mb-4">
              <CustomToolTip title="Expand" placement="right">
                <IconButton
                  onClick={() => setIsExpended(!isExpended)}
                  sx={{
                    bgcolor: "#e0f7fa",
                    color: "#2eacb3",
                    width: 34,
                    height: 34,
                    "&:hover": { bgcolor: "#b2ebf2" },
                    transition: "all 0.2s",
                    borderRadius: 2,
                  }}
                >
                  <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </CustomToolTip>
            </div>
          )}
        </div>
      </Box>

      {/* Main content area */}
      <div className="flex-1  overflow-y-auto overflow-x-hidden will-change-transform w-full">
        <Outlet />
      </div>
      <CustomDrawer />
    </div>
  );
};

export default SideMenuBar;
