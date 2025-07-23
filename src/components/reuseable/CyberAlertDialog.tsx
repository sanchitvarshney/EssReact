import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ShieldCheck, Info, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface CyberAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const CyberAlertDialog: React.FC<CyberAlertDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  // Only allow closing via the confirm button
  const handleOpenChange = (nextOpen: boolean) => {
    // Prevent closing on outside click or Escape
    if (!nextOpen) {
      // Do nothing, block closing unless onConfirm is called
      return;
    }
    onOpenChange(nextOpen);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 bg-white p-8 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl",
            "max-h-[70vh] overflow-y-auto"
          )}
          // Prevent closing on Escape key
          onEscapeKeyDown={(e) => e.preventDefault()}
          // Prevent closing on pointer down outside
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-3 text-[#2eacb3]">
              <ShieldCheck className="h-8 w-8" />
              <h2 className="text-2xl font-bold">
                Important - Cyber Alert & Prevention
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#2eacb3]/10 to-transparent p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Info className="h-6 w-6 text-[#2eacb3]" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Cybersecurity Measures
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-[#2eacb3]" />
                    <span>
                      Avoid downloading unverified attachments or clicking on
                      unknown links. These can contain malware or lead to
                      phishing websites.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-[#2eacb3]" />
                    <span>
                      Use strong and unique passwords that include a mix of
                      upper and lower-case letters, numbers, and special
                      characters.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-[#2eacb3]" />
                    <span>
                      Regularly update your passwords and avoid reusing old
                      ones.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-[#2eacb3]" />
                    <span>
                      Enable multi-factor authentication (MFA) where possible
                      for extra security.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-[#2eacb3]" />
                    <span>
                      Report any suspicious activity to the IT department
                      immediately.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-[#2eacb3]/10 to-transparent p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Info className="h-6 w-6 text-[#2eacb3]" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Why Windows Updates are Important
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-[#2eacb3]" />
                    <span>
                      Security Patches: These updates address vulnerabilities
                      that hackers can exploit.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-[#2eacb3]" />
                    <span>
                      Performance Enhancements: Updates often include
                      optimizations for system speed and responsiveness.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-[#2eacb3]" />
                    <span>
                      Bug Fixes: Microsoft continually works to identify and fix
                      system issues.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 mr-2 mt-0.5 text-[#2eacb3]" />
                    <span>
                      New Features: Some updates introduce new functionalities
                      to expand your system's capabilities.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={onConfirm}
                className="bg-[#2eacb3] text-white px-6 py-2.5 rounded-lg hover:bg-[#279aa0] transition-colors font-semibold text-lg flex items-center space-x-2 group"
              >
                <span onClick={onConfirm} className="cursor-pointer">
                  I Read
                </span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default CyberAlertDialog;
