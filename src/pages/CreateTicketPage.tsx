import { Typography, Paper, IconButton } from "@mui/material";
import { Input } from "../components/ui/input";
import { useState } from "react";
import Editor from "react-simple-wysiwyg";
import { CustomButton } from "../components/ui/CustomButton";
import { useNavigate } from "react-router-dom";
import {
  ArrowBack,
  CloudUpload,
  Description,
  Close,
  Support,
  Refresh,
} from "@mui/icons-material";
import CustomTextInput from "../components/reuseable/CustomTextInput";
import { btnstyle } from "../constants/themeConstant";

const CreateTicketPage = () => {
  const navigation = useNavigate();
  const [html, setHtml] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const onChange = (e: any) => {
    setHtml(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("call");
    const uploaded = e.target.files;
    if (!uploaded) return;

    const fileArray = Array.from(uploaded);
    setFiles((prev) => [...prev, ...fileArray]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setHtml("");
    setFiles([]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  return (
    <div className="min-h-screen bg-[#fff] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-1">
          <div className="flex items-center gap-3 mb-2">
            <div>
              <Typography
                variant="h4"
                className="font-bold text-gray-800 mb-1"
                sx={{ fontSize: "2rem", fontWeight: 700 }}
              >
                Create Support Ticket
              </Typography>
              <Typography
                variant="body1"
                className="text-gray-600"
                sx={{ fontSize: "1.1rem" }}
              >
                Describe your issue and we'll help you resolve it
              </Typography>
            </div>
          </div>
        </div>

        <Paper elevation={0} className="p-2 bg-white rounded-2xl ">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Description className="text-blue-600" />
              <Typography variant="h6" className="font-semibold text-gray-800">
                Ticket Summary
              </Typography>
            </div>
            {/* <Input
              placeholder="Brief description of your issue..."
              className="w-70 sm:w-1/2 p-4 text-lg border-2 border-gray-200 rounded-md focus:border-[#2eacb3] focus:ring-2 focus:ring-[#2eacb3] transition-all duration-200"
            /> */}
            <div className="w-100">
              <CustomTextInput field={undefined} label={"Enter Ticket Summary"} />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <CloudUpload className="text-green-600" />
              <Typography variant="h6" className="font-semibold text-gray-800">
                Attachments
              </Typography>
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#2eacb3] transition-colors duration-200 relative"
            >
              <CloudUpload className="text-[#2eacb3] text-4xl mb-3 mx-auto" />

              <Typography variant="body1" className="text-gray-600 mb-4">
                Upload files here, or click below to browse
              </Typography>

              <Input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                onChange={handleFileUpload}
              />

              <label
                htmlFor="file-upload"
                className={btnstyle}
                style={{padding:"4px 8px ", marginTop:"10px"}}
              >
                Choose Files
              </label>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="mt-4">
                <Typography
                  variant="subtitle1"
                  className="font-semibold text-gray-700 mb-3"
                >
                  Uploaded Files ({files.length})
                </Typography>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <Description className="text-blue-500" />
                        <div>
                          <Typography
                            variant="body2"
                            className="font-medium text-gray-800"
                          >
                            {file.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-gray-500"
                          >
                            {(file.size / 1024).toFixed(1)} KB
                          </Typography>
                        </div>
                      </div>
                      <IconButton
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:bg-red-50"
                        size="small"
                      >
                        <Close />
                      </IconButton>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Support className="text-purple-600" />
              <Typography variant="h6" className="font-semibold text-gray-800">
                Detailed Description
              </Typography>
            </div>
            <div className="border-2 w-full border-gray-200 rounded-xl overflow-hidden">
              <Editor
                className="min-h-[200px] w-full p-4 focus:ring-none"
                value={html}
                onChange={onChange}
                placeholder="Please provide a detailed description of your issue, including any steps to reproduce, error messages, or additional context that might help us assist you better..."
              />
            </div>
          </div>

          <div className="w-full flex flex-col  justify-center items-center sm:flex-row gap-4 pt-4 ">
            <CustomButton
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 cursor-pointer "
              onClick={() => navigation("/support-portal")}
            >
              <ArrowBack className="text-sm" />
              Back
            </CustomButton>
            <CustomButton
              className="bg-red-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 cursor-pointer "
              onClick={handleReset}
            >
              <Refresh className="text-sm" />
              Reset
            </CustomButton>
            <CustomButton className={btnstyle}>
              <Support className="text-sm" />
              Create Ticket
            </CustomButton>
          </div>
        </Paper>
      </div>
    </div>
  );
};

export default CreateTicketPage;
