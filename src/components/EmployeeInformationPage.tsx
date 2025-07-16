import React, { useState } from "react";

import { CustomButton } from "./ui/CustomButton";

import EditIcon from "@mui/icons-material/Edit";
import { IconButton, Typography } from "@mui/material";
import CustomTextInput from "./reuseable/CustomTextInput";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";

const Information = ({
  label,
  value,
  editMode,
}: // onChange,
// name,
{
  label: any;
  value: any;
  editMode: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {editMode ? (
        // <Input value={value} name={name} onChange={onChange} />
        <CustomTextInput field={{ value: value }} label={label} />
      ) : (
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{`${label}`}</span>
          <span className="text-base my-1">
            {value === null || value === "" ? "N/A" : value}
          </span>
        </div>
      )}
    </div>
  );
};

const EmployeeInformationPage = ({
  editMode = false,
  data,
}: {
  editMode?: boolean;
  data: any;
}) => {
  const [fields, setFields] = useState({});
  const [editSection, setEditSection] = useState({
    basic: false,
    contact: false,
    emergency: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  return (
    <div className=" my-6">
      <div>
        <div className="flex justify-between items-center">
          <Typography
            sx={{ fontSize: 20, fontWeight: 600, py: 2, color: "#2eacb3" }}
          >
            Basic Information
          </Typography>
          <div className="flex gap-2">
            {editSection.basic && (
              <IconButton onClick={() => {}}>
                <SaveIcon sx={{ color: "#000" }} />
              </IconButton>
            )}
            <IconButton
              onClick={() =>
                setEditSection((prev) => ({ ...prev, basic: !prev.basic }))
              }
            >
              {editSection.basic ? (
                <CancelIcon sx={{ color: "red" }} />
              ) : (
                <EditIcon sx={{ color: "#000" }} />
              )}
            </IconButton>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8 px-4 pl-10 ">
          <Information
            label={"Father Name"}
            value={data?.result?.basic[0].father_name}
            editMode={editSection.basic}
            onChange={handleChange}
            name="f_name"
          />
          <Information
            label={"Mother Name"}
            value={data?.result?.basic[0].mother_name}
            editMode={editSection.basic}
            onChange={handleChange}
            name="m_name"
          />
          <Information
            label={"Spouse"}
            value={data?.result?.basic[0].spouse}
            editMode={editSection.basic}
            onChange={handleChange}
            name="spouse"
          />
          <Information
            label={"PAN Number"}
            value={data?.result?.basic[0].pan}
            editMode={editSection.basic}
            onChange={handleChange}
            name="pan"
          />
          <Information
            label={"UAN Number"}
            value={data?.result?.basic[0].uan}
            editMode={editSection.basic}
            onChange={handleChange}
            name="uan"
          />
          <Information
            label={"ESI Number"}
            value={data?.result?.basic[0].esi}
            editMode={editSection.basic}
            onChange={handleChange}
            name="esi"
          />
          <Information
            label={"Date of joining"}
            value={data?.result?.basic[0].doj}
            editMode={editSection.basic}
            onChange={handleChange}
            name="joining"
          />
          <Information
            label={"Date of birth"}
            value={data?.result?.basic[0].dob}
            editMode={editSection.basic}
            onChange={handleChange}
            name="dob"
          />
          <Information
            label={"Office Mobile No."}
            value={data?.result?.basic[0].mobile}
            editMode={editSection.basic}
            onChange={handleChange}
            name="mobile"
          />
          <Information
            label={"Email ID"}
            value={data?.result?.basic[0].email}
            editMode={editSection.basic}
            onChange={handleChange}
            name="email"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <Typography
            sx={{ fontSize: 20, fontWeight: 600, py: 2, color: "#2eacb3" }}
          >
            Contact Information
          </Typography>
          <div className="flex gap-2">
            {editSection.contact && (
              <IconButton onClick={() => {}}>
                <SaveIcon sx={{ color: "#000" }} />
              </IconButton>
            )}
            <IconButton
              onClick={() =>
                setEditSection((prev) => ({ ...prev, contact: !prev.contact }))
              }
            >
              {editSection.contact ? (
                <CancelIcon sx={{ color: "red" }} />
              ) : (
                <EditIcon sx={{ color: "#000" }} />
              )}
            </IconButton>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8 px-4 pl-10 ">
          <Information
            label={"Current Address"}
            value={`${data?.result?.c_address[0]?.house_no || "N/A"}, ${
              data?.result?.c_address[0]?.village || "N/A"
            }, ${data?.result?.c_address[0]?.area || "N/A"}, ${
              data?.result?.c_address[0]?.city || "N/A"
            }, ${data?.result?.c_address[0]?.state || "N/A"}, ${
              data?.result?.c_address[0]?.pincode || "N/A"
            }`}
            editMode={editSection.contact}
            onChange={handleChange}
            name="location"
          />
          <Information
            label={"Permanent Address"}
            value={`${data?.result?.c_address[0]?.house_no || "N/A"}, ${
              data?.result?.c_address[0]?.village || "N/A"
            }, ${data?.result?.c_address[0]?.area || "N/A"}, ${
              data?.result?.c_address[0]?.city || "N/A"
            }, ${data?.result?.c_address[0]?.state || "N/A"}, ${
              data?.result?.c_address[0]?.pincode || "N/A"
            }`}
            editMode={editSection.contact}
            onChange={handleChange}
            name="location"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <Typography
            sx={{ fontSize: 20, fontWeight: 600, py: 2, color: "#2eacb3" }}
          >
            Emergency Contact
          </Typography>
          <div className="flex gap-2">
            {editSection.emergency && (
              <IconButton onClick={() => {}}>
                <SaveIcon sx={{ color: "#000" }} />
              </IconButton>
            )}
            <IconButton
              onClick={() =>
                setEditSection((prev) => ({
                  ...prev,
                  emergency: !prev.emergency,
                }))
              }
            >
              {editSection.emergency ? (
                <CancelIcon sx={{ color: "red" }} />
              ) : (
                <EditIcon sx={{ color: "#000" }} />
              )}
            </IconButton>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8 px-4 pl-10 ">
          <Information
            label={"Name"}
            value={data?.result?.e_contact[0]?.contact_name_a}
            editMode={editSection.emergency}
            onChange={handleChange}
            name="e_name"
          />
          <Information
            label={"Mobile Number"}
            value={data?.result?.e_contact[0]?.a_contact}
            editMode={editSection.emergency}
            onChange={handleChange}
            name="mobile_no"
          />
          <Information
            label={"Name"}
            value={data?.result?.e_contact[0]?.contact_name_b}
            editMode={editSection.emergency}
            onChange={handleChange}
            name="e_name"
          />
          <Information
            label={"Mobile Number"}
            value={data?.result?.e_contact[0]?.b_contact}
            editMode={editSection.emergency}
            onChange={handleChange}
            name="mobile_no"
          />
        </div>
      </div>

      {editMode && (
        <div className="w-full my-5 flex">
          <CustomButton
            className=" mx-auto px-12 cursor-pointer py-4 text-lg font-bold shadow-xl bg-gradient-to-r from-[#2eacb3] to-[#1e8a8f] hover:from-[#1e8a8f] hover:to-[#2eacb3] rounded-2xl transform hover:scale-102 transition-all duration-200 text-white"
            // onClick={() => setEditMode((prev) => !prev)}
          >
            Update information Approval
          </CustomButton>
        </div>
      )}
    </div>
  );
};

export default EmployeeInformationPage;
