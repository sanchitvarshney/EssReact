import { Typography } from "@mui/material";
import { Input } from "../components/ui/input";
import { useState } from "react";
import Editor from "react-simple-wysiwyg";
import { CustomButton } from "../components/ui/CustomButton";

const CreateTicketPage = () => {
  const [html, setHtml] = useState("");
  const [files, setFiles] = useState<File[]>([]); // store all uploaded files

  const onChange = (e: any) => {
    setHtml(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded) return;

    const fileArray = Array.from(uploaded);
    setFiles((prev) => [...prev, ...fileArray]);
  };

  return (
    <div className="w-full p-4">
      <Typography variant="subtitle1" sx={{ fontSize: 18, fontWeight: 600 }}>
        Ticket Details
      </Typography>
      <Typography variant="subtitle2">Please Describe Your Issue</Typography>

      <div className="my-2">
        <span className="text-md font-semibold">Summary</span>
        <Input placeholder="Please enter Reason" className="w-100 mt-1" />
      </div>

      {/* Upload Any File */}
         <div className="my-4">
            <Input type="file" className="border-none w-50 bg-black text-white  "  multiple  onChange={handleFileUpload}/>
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                <Typography variant="subtitle2">Uploaded Files:</Typography>
                <ul className="list-disc ml-6">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

      {/* WYSIWYG Editor */}
      <Editor
        className="h-50 overflow-y-auto"
        value={html}
        onChange={onChange}
        placeholder="Describe Your Reason"
        
   
      />
      <div className="w-full flex justify-center items-center space-x-4 mt-5">
        <CustomButton  className="bg-[gray] text-white  ">Cancel</CustomButton>
         <CustomButton className="bg-[red] text-white ">Reset</CustomButton>
          <CustomButton className="bg-[#2eacb3] text-white ">Create Ticket</CustomButton>
      </div>
    </div>
  );
};

export default CreateTicketPage;
