import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ConfirmationModalProps {
  open: boolean;
  onClose: (confirmed: boolean) => void;
  title: string;

  children: React.ReactNode;
}

const CustomModal: React.FC<ConfirmationModalProps> = ({
  open = true,
  onClose,
  title,

  children,
}) => {
  return (
 <Dialog
  open={open}
  
  onOpenChange={(isOpen: boolean) => !isOpen && onClose(false)}
>
  <DialogContent
    onInteractOutside={(e: any) => e.preventDefault()}
    className="bg-white  h-[80vh] flex flex-col"
  >
    <DialogHeader>
      <DialogTitle className="text-black">{title}</DialogTitle>
    </DialogHeader>

    <div className="mt-2 overflow-auto flex-1">{children}</div>
  </DialogContent>
</Dialog>

  );
};

export default CustomModal;
