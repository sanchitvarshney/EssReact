import React, { createContext, useContext, useState, type FC } from "react";

type DrawerContextType = {
  open: boolean;
  isExpended: boolean;
  setIsExpended: any;
  accordionValues: any;
  setAccordionValues: any;
  toggleDrawerOpen: () => void;
  toggleDrawerClose: () => void;
};
interface DrawerContextApiPropsType {
  children: React.ReactNode;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerContextApi: FC<DrawerContextApiPropsType> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [isExpended, setIsExpended] = useState<boolean>(true);
  const [accordionValues, setAccordionValues] = useState<{
    [key: string]: string;
  }>({});
  const toggleDrawerOpen = () => {
    setOpen(true);
    setIsExpended(true);
  };
  const toggleDrawerClose = () => {
    setOpen(false);
    setIsExpended(false);
  };

  return (
    <DrawerContext.Provider
      value={{
        open,
        isExpended,
        accordionValues,
        setAccordionValues,
        setIsExpended,
        toggleDrawerOpen,
        toggleDrawerClose,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawerContext must be used within a DrawerContextApi");
  }
  return context;
};
