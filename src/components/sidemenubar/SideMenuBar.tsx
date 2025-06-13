import DynamicIcon from "../reuseable/DynamicIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/CustomAccordion";
import React from "react";
import { Link } from "react-router-dom";

import CustomToolTip from "../reuseable/CustomToolTip";

import type { MenuItem } from "../../types/dummytypes";
import { menu } from "../../dummydata/Menu";
import { Avatar, Box, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CustomDrawer from "../CustomDrawer";
import { useDrawerContext } from "../../contextapi/DrawerContextApi";

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
  level: number = 0,
  path: string = ""
) => {
  const {toggleDrawerClose} = useDrawerContext()
  return (
    <Accordion
      type="single"
      collapsible
      value={accordionValues[path] || ""}
      onValueChange={(val) =>
        setAccordionValues({ ...accordionValues, [path]: val })
      }
    >
      <ul className="flex flex-col gap-[20px]">
        {menu?.map((item: any, index: number) => {
          const currentPath = `${path}/${item.title}-${index}`;
          return (
            <li key={item.id || item.name + index}>
              {item?.children ? (
                <AccordionItem
                  value={currentPath}
                  className="border-0 w-full transition-all duration-100"
                >
                  <div className="flex flex-col px-4">
                    {!isExpended ? (
                      <>
                        <CustomToolTip title={item?.title} placement="right">
                          <div
                            className="px-1 rounded-md cursor-pointer "
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
                          </div>
                        </CustomToolTip>
                      </>
                    ) : (
                      <>
                        <AccordionTrigger
                          className="w-[100%] py-1   m-0 leading-none hover:no-underline cursor-pointer rounded-md hover:bg-white"
                          onClick={() => {
                            setAccordionValues({
                              ...accordionValues,
                              [path]: currentPath,
                            });
                          }}
                        >
                          <div className="w-full px-1 flex items-center cursor-pointer rounded-md gap-2">
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
                          <AccordionContent className=" mx-4  border-l-2 border-black">
                            {renderMenu(
                              item.children,
                              false,
                              isExpended,
                              setIsExpended,

                              accordionValues,
                              setAccordionValues,
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
                  <CustomToolTip
                    title={isExpended ? "" : item?.title}
                    placement={"right"}
                  >
                    <Link
                      to={item?.path}
                      className={`w-full rounded-md cursor-pointer flex items-center gap-[10px] pl-1 ${
                        isExpended && "hover:bg-white"
                      } p-[2px]
                      `}
                      onClick={() => {
                        // setIsExpended(false);
                        setAccordionValues({});
                        toggleDrawerClose()
                      }}
                    >
                      {isNew && <DynamicIcon name={item.icon} size="medium" />}

                      {isExpended && (
                        <span className={`${getTextSize(level)} font-[500]`}>
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </CustomToolTip>
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

const SideMenuBar: React.FC<CustomSideBarMenuProps> = ({ children }) => {
  const {isExpended,setIsExpended,accordionValues,setAccordionValues} = useDrawerContext()
  // const navigate = useNavigate();


  return (
    <div className="w-full h-[calc(100vh-65px)] flex flex-row ">
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        {/* Sidebar container */}
        <div
          className={`${isExpended ? "w-[40vh]" : "w-[10vh]"} flex flex-col border-r-1`}
        >
          {/* Profile section */}
          {isExpended && (
            <>
              {" "}
              <div className="flex flex-col justify-center items-center px-2 py-1">
                <div className="flex ml-auto">
                  <CustomToolTip title="Expand" placement="right">
                    <div
                      className="cursor-pointer rounded-md transition"
                      onClick={() => setIsExpended(false)}
                    >
                      <ArrowBackIcon />
                    </div>
                  </CustomToolTip>
                </div>
                <div className="flex flex-col items-center text-center py-1 gap-y-1 w-full ">
                  <Avatar
                    alt="Remy Sharp"
                    src="/static/images/avatar/2.jpg"
                    sx={{ width: 80, height: 80 }}
                  />
                  <h2 className="mt-2 break-words max-w-full text-[1.3rem] font-semibold ">
                    Rahul Mehra
                  </h2>
                  <h2 className=" break-words max-w-full text-[1rem] font-medium  ">
                    Assistant Manager
                  </h2>
                  <h2 className=" break-words max-w-full text-[1rem] font-medium ">
                    Marketing
                  </h2>
                  <p className=" break-words max-w-full text-[0.9rem] font-medium ">
                    EMP-1003
                  </p>
                  <p className=" break-words max-w-full text-[1rem] font-normal">
                    rahul.mehra@company.com
                  </p>
                </div>
              </div>
              <Divider className="w-[90%] self-center " />{" "}
            </>
          )}
          {/* Scrollable menu section */}

          <div className="flex-1  custom-scrollbar-for-menu p-1 overflow-y-auto  my-2">
            {renderMenu(
              menu,
              true,
              isExpended,
              setIsExpended,
              accordionValues,
              setAccordionValues
            )}
          </div>

          {!isExpended && (
            <div className="flex self-center mb-4">
              <div>
                <CustomToolTip title="Expend" placement="right">
                  <div
                    onClick={() => {
                      setIsExpended(!isExpended);
                    }}
                    className={` cursor-pointer rounded-md transition`}
                  >
                    <ArrowForwardIcon />
                  </div>
                </CustomToolTip>
              </div>
            </div>
          )}
        </div>
      </Box>
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto w-full ">{children}</div>
      <CustomDrawer />
    </div>
  );
};

export default SideMenuBar;
