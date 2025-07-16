import Drawer from "@mui/material/Drawer";

import { useDrawerContext } from "../contextapi/DrawerContextApi";
import { renderMenu } from "./sidemenubar/SideMenuBar";
import { Avatar, Divider } from "@mui/material";

import { menu } from "../dummydata/Menu";
import { useAuth } from "../contextapi/AuthContext";

export default function CustomDrawer() {
  const {
    open,
    toggleDrawerClose,
    isExpended,
    accordionValues,
    setIsExpended,
    setAccordionValues,
  } = useDrawerContext();
  const { user } = useAuth();

  const DrawerList = (
    <div
      className={`w-[40vh] flex flex-col h-full transition-all duration-300 py-4 ease-in-out`}
    >
      {/* Fixed header section */}
      <div className="flex-shrink-0 flex flex-col items-center text-center py-1 gap-y-1 w-full">
        <Avatar
          //@ts-ignore
          alt={user?.name}
          //@ts-ignore
          src={user?.imgUrl}
          sx={{ width: 80, height: 80, backgroundColor: "#2eacb3",           pointerEvents: "none",
                      userSelect: "none", }}
        />
        <h2 className="mt-2 break-words max-w-full text-[1.3rem] font-semibold ">
          {/*@ts-ignore */}
          {user?.name}
        </h2>
        <h2 className=" break-words max-w-full text-[1rem] font-medium  ">
          {/* @ts-ignore */}
          {user?.role}
        </h2>
        <h2 className=" break-words max-w-full text-[1rem] font-medium ">
          {/* @ts-ignore */}
          {user?.dept}
        </h2>
        <p className=" break-words max-w-full text-[0.9rem] font-medium ">
          {/* @ts-ignore */}
          {user?.id}
        </p>
      </div>

      <Divider className="w-[90%] self-center flex-shrink-0" />

      {/* Scrollable menu section */}
      <div className="flex-1 custom-scrollbar-for-menu p-1 overflow-y-auto my-2 min-h-0">
        {renderMenu(
          menu,
          true,
          isExpended,
          setIsExpended,
          accordionValues,
          setAccordionValues
        )}
      </div>
    </div>
  );

  return (
    <Drawer open={open} onClose={toggleDrawerClose} sx={{ overflow: "hidden" }}>
      {DrawerList}
    </Drawer>
  );
}
