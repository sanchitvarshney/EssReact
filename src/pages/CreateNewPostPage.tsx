import { useState } from "react";
import { CustomButton } from "../components/ui/CustomButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CreateNewPostPage() {
  const [caption, setCaption] = useState("");

  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: any) => {
    const files = Array.from(e.target.files);
    setImages([
      ...images,
      ...files.map((file: any) => URL.createObjectURL(file)),
    ]);
  };

  return (
    <div className=" mx-auto p-2 bg-white  rounded-lg my-3 space-y-6">
      <div className="flex items-center gap-2">
        <img
          src="https://i.pravatar.cc/40?img=12"
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="text-sm font-medium">
          <div className="flex items-center gap-1">
            <span>Hanna Donin</span>
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
          {images.map((src, idx) => (
            <div key={idx} className="relative w-24 h-24">
              <img
                src={src}
                alt="preview"
                className="w-full h-full object-cover rounded-lg border"
              />

              <span
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
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

      <div className="text-right">
        <CustomButton className=" bg-[#2eacb3] text-white cursor-pointer">
          Post
        </CustomButton>
      </div>
    </div>
  );
}
