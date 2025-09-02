import { useRef, useState, } from "react";
import { CustomButton } from "../components/ui/CustomButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../contextapi/AuthContext";
import { btnstyle } from "../constants/themeConstant";
import { useToast } from "../hooks/useToast";

import { Bold, Italic, ArrowUpAZ, ArrowDownAZ } from "lucide-react";

import { CircularProgress } from "@mui/material";

const hasMinimumWords = (text: string, minWords: number = 3): boolean => {
  const words = text.trim().split(/\s+/); // split by any whitespace
  return words.length >= minWords;
};

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
  const textareaRef = useRef(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]); // for display
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState(false);


  const handleImageUpload = (e: any) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const allowedFiles = files.filter(
      (file: any) =>
        file.type === "image/jpeg" || file.name.toLowerCase().endsWith(".jpg")
    );

    if (allowedFiles.length === 0) {
      showToast("Only JPG or JPEG files are allowed.", "error");
      return;
    }

    if (imageFiles.length + allowedFiles.length > 2) {
      showToast("You can only upload up to 2 images.", "error");
      return;
    }

    setPreviewImages((prev: any) => [
      ...prev,
      ...allowedFiles.map((file: any) => URL.createObjectURL(file)),
    ]);
    setImageFiles((prev: any) => [...prev, ...allowedFiles]);
  };

  const validateFiles = (files: File[]) => {
    const maxSize = 5 * 1024 * 1024;
    const maxTotalSize = 8 * 1024 * 1024; // 8MB total

    let totalSize = 0;

    for (const file of files) {
      if (file.size > maxSize) {
        throw new Error(
          `File "${file.name}" is too large. Maximum size is 2MB.`
        );
      }
      totalSize += file.size;
    }

    if (totalSize > maxTotalSize) {
      throw new Error(
        `Total file size is too large. Maximum total size is 8MB.`
      );
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 800px width/height)
        const maxSize = 800;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.7
        ); // 70% quality
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

    // Validate files before sending
    if (imageFiles.length > 0) {
      try {
        validateFiles(imageFiles);
      } catch (error: any) {
        showToast(error.message, "error");
        return;
      }
    }

    setIsLoading(true);

    try {
      // Compress images if they exist
      let processedFiles = imageFiles;
      if (imageFiles.length > 0) {
     
        processedFiles = await Promise.all(imageFiles.map(compressImage));
      }
      const base64Images = await Promise.all(processedFiles.map(fileToBase64));

      const payload = {
        description: caption,
        image: base64Images,
      };
   
  
      const result = await onCreatePost(payload);

      if (result.success) {
        setCaption("");
        setImageFiles([]);
        setPreviewImages([]);
        closeModal();
      }
    } catch (err: any) {
      showToast(
        err?.message?.msg ||
          err?.message ||
          "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const applyFormat = (formatType: string) => {
    const textarea: any = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) return; // No text selected

    const selectedText = caption.substring(start, end);
    let formatted = selectedText;

    switch (formatType) {
      case "bold":
        formatted = `**${selectedText}**`;
        break;
      case "italic":
        formatted = `*${selectedText}*`;
        break;
      case "bolditalic":
        formatted = `***${selectedText}***`;
        break;
      case "uppercase":
        formatted = selectedText.toUpperCase();
        break;
      case "lowercase":
        formatted = selectedText.toLowerCase();
        break;
      default:
        break;
    }

    const newText =
      caption.substring(0, start) + formatted + caption.substring(end);
    setCaption(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formatted.length);
    }, 0);
  };

  return (
    <div className=" mx-auto p-2 bg-white  rounded-lg my-3 space-y-6">
      <div className="flex items-center gap-2">
        <img src={imgUrl} alt={name} className="w-10 h-10 rounded-full" />
        <div className="text-sm font-medium">
          <div className="flex items-center gap-1">
            <span>{name}</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <label className="text-sm font-semibold mb-1 block">Caption</label>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={4}
          className="w-full p-3 border rounded-lg resize-none"
          placeholder="Write your caption here..."
        />
        {/* Formatting Toolbar */}
        <div className="flex gap-2 mt-">
          <button
            onClick={() => applyFormat("bold")}
            className="p-2 border rounded hover:bg-gray-100"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => applyFormat("italic")}
            className="p-2 border rounded hover:bg-gray-100"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => applyFormat("uppercase")}
            className="p-2 border rounded hover:bg-gray-100"
            title="Uppercase"
          >
            <ArrowUpAZ size={16} />
          </button>
          <button
            onClick={() => applyFormat("lowercase")}
            className="p-2 border rounded hover:bg-gray-100"
            title="Lowercase"
          >
            <ArrowDownAZ size={16} />
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold block mb-1">Add Images</label>
        <div className="flex gap-4 flex-wrap">
          {previewImages.map((src, idx) => (
            <div key={idx} className="relative w-24 h-24">
              <img
                src={src}
                alt="preview"
                className="w-full h-full object-cover rounded-lg border"
              />

              <span
                onClick={() => {
                  setPreviewImages(previewImages.filter((_, i) => i !== idx));
                  setImageFiles(imageFiles.filter((_, i) => i !== idx));
                }}
                className="absolute top-1 right-1 bg-[#2eacb3] bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center items-center text-xs hover:bg-red-600"
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </span>
            </div>
          ))}

          <label className="w-24 h-24 border-dashed border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer text-gray-400">
            +
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="text-center">
        <CustomButton
          className={btnstyle}
          onClick={handleCreatePost}
          disabled={imageFiles.length === 0 && caption.length === 0}
        >
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: "white" }} />
          ) : (
            "Create"
          )}
        </CustomButton>
      </div>
    </div>
  );
}
