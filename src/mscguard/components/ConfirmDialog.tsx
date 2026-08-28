import Modal from "./Modal";
import { PrimaryButton, SecondaryButton } from "./FormControls";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel} widthClass="max-w-sm">
      <p className="text-sm text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end gap-2">
        <SecondaryButton onClick={onCancel} disabled={busy}>
          Cancel
        </SecondaryButton>
        <PrimaryButton
          onClick={onConfirm}
          disabled={busy}
          className={destructive ? "bg-red-600 hover:bg-red-500" : ""}
        >
          {busy ? "Please wait…" : confirmLabel}
        </PrimaryButton>
      </div>
    </Modal>
  );
}
