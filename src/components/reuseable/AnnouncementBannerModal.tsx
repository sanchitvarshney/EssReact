import { X } from "lucide-react";
import announcementBanner from "../../assets/announcement-banner.jpeg";

const DEFAULT_MESSAGE =
  "You will not be able to access the ESS Web Interface from 12-10-2026 onwards. Please continue using the ESS Mobile App on your Android device.";

interface AnnouncementBannerModalProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

// Dashboard-only pre-warning (see useAnnouncementBanner.ts) for the 12-10-2026 Web
// Access Block - closes on a backdrop click (or the X) same as any other dismissible
// popup; it reopens on its own later (next login / hourly poll), this isn't a
// one-time "never show again" dismiss.
const AnnouncementBannerModal: React.FC<AnnouncementBannerModalProps> = ({
  open,
  onClose,
  message = DEFAULT_MESSAGE,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative w-full" style={{ aspectRatio: "800 / 478" }}>
          <img
            src={announcementBanner}
            alt=""
            className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
            draggable={false}
          />
          <div className="absolute top-[10%] bottom-[10%] left-[60%] right-[4%] flex items-center">
            <p className="text-[#d61f1f] font-bold leading-snug text-[clamp(12px,2vw,18px)]">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBannerModal;
