import { X } from "lucide-react";
import announcementBanner from "../../assets/announcement-banner.jpeg";
import essAppQrCode from "../../assets/img/essDownload.png";

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

        <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6">
          <div className="relative w-full sm:w-[38%] shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-sky-50 to-sky-100" style={{ aspectRatio: "4 / 3" }}>
            <img
              src={announcementBanner}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-left select-none pointer-events-none"
              draggable={false}
            />
          </div>

          <div className="flex flex-col justify-center gap-4 py-1 sm:py-2 flex-1 min-w-0">
            <div>
              <span className="inline-block text-[11px] font-bold uppercase tracking-wide text-[#d61f1f] bg-red-50 px-2.5 py-1 rounded-full mb-2">
                Important Update
              </span>
              <p className="text-[#374151] font-medium leading-relaxed text-sm sm:text-base">
                {message}
              </p>
            </div>

            <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
              <img
                src={essAppQrCode}
                alt="ESS App QR Code"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain bg-white rounded-lg border border-gray-200 p-1 shrink-0"
                draggable={false}
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-gray-800">
                  Scan to download the ESS App
                </span>
                <span className="text-xs text-gray-500">
                  Available now on the Google Play Store
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBannerModal;
