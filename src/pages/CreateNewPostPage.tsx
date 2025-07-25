import { useState } from "react";
import { CustomButton } from "../components/ui/CustomButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../contextapi/AuthContext";
import { btnstyle } from "../constants/themeConstant";
import { useToast } from "../hooks/useToast";
import { useCreatePostMutation } from "../services/vibe";

import { CircularProgress } from "@mui/material";

const hasMinimumWords = (text: string, minWords: number = 3): boolean => {
  const words = text.trim().split(/\s+/); // split by any whitespace
  return words.length >= minWords;
};

export default function CreateNewPostPage({ closeModal }: { closeModal: any }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { name, imgUrl } = user as any;
  const [caption, setCaption] = useState("");

  const [previewImages, setPreviewImages] = useState<string[]>([]); // for display
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [createPost, { isLoading }] = useCreatePostMutation();

  const handleImageUpload = (e: any) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    setPreviewImages((prev: any) => [
      ...prev,
      ...files.map((file: any) => URL.createObjectURL(file)),
    ]);
    setImageFiles((prev: any) => [...prev, ...files]);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    console.log(file);
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
    if (imageFiles.length === 0) {
      showToast("Please add at least one image", "error");
      return;
    }
    //@ts-ignore
    const base64Images = await Promise.all(imageFiles.map(fileToBase64));

    const payload = {
      description: caption,
      image: base64Images,
    };

    createPost(payload)
      .then((res) => {
        showToast(res?.data?.message || "Post created successfully", "success");
        setCaption("");
        setImageFiles([]);
        setPreviewImages([]);
        closeModal();
      })
      .catch((err) => {
        showToast(
          err ||
            err?.message?.msg ||
            "We're Sorry An unexpected error has occured. Our technical staff has been automatically notified and will be looking into this with utmost urgency.",
          "error"
        );
      });
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

      <div>
        <label className="text-sm font-semibold mb-1 block">Caption</label>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={4}
          className="w-full p-3 border rounded-lg resize-none"
          placeholder="Write your caption here..."
        />
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
