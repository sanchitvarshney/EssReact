import { useRef, useState } from "react";
import { CustomButton } from "../components/ui/CustomButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useAuth } from "../contextapi/AuthContext";
import { btnstyle } from "../constants/themeConstant";
import { useToast } from "../hooks/useToast";
import { Avatar, CircularProgress, Tooltip } from "@mui/material";
import { Bold, Italic, ArrowUpAZ, ArrowDownAZ } from "lucide-react";

const hasMinimumWords = (text: string, minWords: number = 3): boolean => {
  const words = text.trim().split(/\s+/);
  return words.length >= minWords;
};

const MAX_CAPTION = 500;

export default function CreateNewPostPage({
  closeModal,
  onCreatePost,
}: {
  closeModal: any;
  onCreatePost: (payload: any) => Promise<{ success: boolean }>;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { name, imgUrl } = user as any;
  const [caption, setCaption] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const allowedFiles = files.filter(
      (file) => file.type === "image/jpeg" || file.name.toLowerCase().endsWith(".jpg")
    );
    if (allowedFiles.length === 0) {
      showToast("Only JPG or JPEG files are allowed.", "error");
      return;
    }
    if (imageFiles.length + allowedFiles.length > 2) {
      showToast("You can only upload up to 2 images.", "error");
      return;
    }
    setPreviewImages((prev) => [
      ...prev,
      ...allowedFiles.map((file) => URL.createObjectURL(file)),
    ]);
    setImageFiles((prev) => [...prev, ...allowedFiles]);
  };

  const validateFiles = (files: File[]) => {
    const maxSize = 5 * 1024 * 1024;
    const maxTotalSize = 8 * 1024 * 1024;
    let totalSize = 0;
    for (const file of files) {
      if (file.size > maxSize) {
        throw new Error(`File "${file.name}" is too large. Maximum size is 5MB.`);
      }
      totalSize += file.size;
    }
    if (totalSize > maxTotalSize) {
      throw new Error("Total file size exceeds 8MB limit.");
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        const maxSize = 800;
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
        } else {
          if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() }));
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.7
        );
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleCreatePost = async () => {
    if (!hasMinimumWords(caption)) {
      showToast("Caption must have at least 3 words", "error");
      return;
    }
    if (imageFiles.length > 0) {
      try { validateFiles(imageFiles); }
      catch (error: any) { showToast(error.message, "error"); return; }
    }
    setIsLoading(true);
    try {
      let processedFiles = imageFiles;
      if (imageFiles.length > 0) {
        processedFiles = await Promise.all(imageFiles.map(compressImage));
      }
      const base64Images = await Promise.all(processedFiles.map(fileToBase64));
      const result = await onCreatePost({ description: caption, image: base64Images });
      if (result.success) {
        setCaption("");
        setImageFiles([]);
        setPreviewImages([]);
        closeModal();
      }
    } catch (err: any) {
      showToast(
        err?.message?.msg || err?.message ||
          "We're Sorry, an unexpected error occurred.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const applyFormat = (formatType: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) return;
    const selectedText = caption.substring(start, end);
    let formatted = selectedText;
    switch (formatType) {
      case "bold": formatted = `**${selectedText}**`; break;
      case "italic": formatted = `*${selectedText}*`; break;
      case "uppercase": formatted = selectedText.toUpperCase(); break;
      case "lowercase": formatted = selectedText.toLowerCase(); break;
    }
    const newText = caption.substring(0, start) + formatted + caption.substring(end);
    setCaption(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formatted.length);
    }, 0);
  };

  const removeImage = (idx: number) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== idx));
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const isSubmitDisabled = imageFiles.length === 0 && caption.trim().length === 0;

  return (
    <div className="flex flex-col gap-5 py-5">
      {/* Author */}
      <div className="flex items-center gap-3">
        <Avatar
          src={imgUrl}
          sx={{ width: 42, height: 42, bgcolor: "#2eacb3", fontWeight: 700, pointerEvents: "none", userSelect: "none" }}
        >
          {name?.charAt(0)}
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-gray-800 leading-tight">{name}</p>
          <p className="text-xs text-gray-400 mt-0.5">Posting to everyone</p>
        </div>
      </div>

      {/* Caption */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Caption
          </label>
          <span
            className={`text-[11px] font-medium ${
              caption.length > MAX_CAPTION * 0.9 ? "text-red-500" : "text-gray-400"
            }`}
          >
            {caption.length}/{MAX_CAPTION}
          </span>
        </div>

        <textarea
          ref={textareaRef}
          value={caption}
          onChange={(e) => setCaption(e.target.value.slice(0, MAX_CAPTION))}
          rows={5}
          className="w-full px-3 py-3 border border-gray-200 rounded-xl resize-none text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2eacb3]/30 focus:border-[#2eacb3] transition-all duration-200 leading-relaxed"
          placeholder="Share something helpful, inspiring, or exciting with your team..."
        />

        {/* Formatting toolbar */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400 font-medium mr-1">Format:</span>
          {[
            { type: "bold", icon: <Bold size={13} />, label: "Bold" },
            { type: "italic", icon: <Italic size={13} />, label: "Italic" },
            { type: "uppercase", icon: <ArrowUpAZ size={13} />, label: "UPPERCASE" },
            { type: "lowercase", icon: <ArrowDownAZ size={13} />, label: "lowercase" },
          ].map(({ type, icon, label }) => (
            <Tooltip key={type} title={label} placement="top">
              <button
                onClick={() => applyFormat(type)}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#2eacb3] hover:text-[#2eacb3] hover:bg-[#f0fdfe] transition-all duration-150"
              >
                {icon}
              </button>
            </Tooltip>
          ))}
          <span className="text-[10px] text-gray-300 ml-1">Select text first</span>
        </div>
      </div>

      {/* Images */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Attach Images
          </label>
          <span className="text-[11px] text-gray-400">
            {imageFiles.length}/2 · JPG only · max 5MB each
          </span>
        </div>

        <div className="flex gap-3 flex-wrap">
          {previewImages.map((src, idx) => (
            <div
              key={idx}
              className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shadow-sm group"
            >
              <img
                src={src}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center"
              >
                <div className="bg-red-500 rounded-full p-1">
                  <DeleteIcon sx={{ fontSize: 14, color: "white" }} />
                </div>
              </button>
            </div>
          ))}

          {imageFiles.length < 2 && (
            <label className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:border-[#2eacb3] hover:text-[#2eacb3] hover:bg-[#f0fdfe] transition-all duration-200 gap-1">
              <AddPhotoAlternateIcon sx={{ fontSize: 22 }} />
              <span className="text-[10px] font-medium">Add photo</span>
              <input
                type="file"
                accept=".jpg,.jpeg"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-3 pt-1 border-t border-gray-100">
        <button
          onClick={closeModal}
          className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-150"
        >
          Cancel
        </button>
        <CustomButton
          className={btnstyle}
          onClick={handleCreatePost}
          disabled={isSubmitDisabled || isLoading}
        >
          {isLoading ? (
            <CircularProgress size={16} sx={{ color: "white" }} />
          ) : (
            "Post"
          )}
        </CustomButton>
      </div>
    </div>
  );
}
