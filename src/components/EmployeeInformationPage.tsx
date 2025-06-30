import React, { useState } from "react";

import { CustomButton } from "./ui/CustomButton";
import { Input } from "./ui/input";

const Information = ({
  label,
  value,
  editMode,
  onChange,
  name,
}: {
  label: any;
  value: any;
  editMode: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-lg font-semibold">{label}</span>
      {editMode ? (
        <Input value={value} name={name} onChange={onChange} />
      ) : (
        <span className="text-base">{value}</span>
      )}
    </div>
  );
};

const EmployeeInformationPage = ({
  editMode = false,
}: {
  editMode?: boolean;
}) => {
  const [fields, setFields] = useState({
    dob: "14-july-2002",
    mobile: "9876548888",
    email: "info@test.in",
    location: "Noida,UP,India",
    joining: "24-02-2022",
    document: "Doc",
    blood: "B+",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  return (
    <div className=" my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8 px-4 pl-10 ">
        <Information
          label={"Date of birth"}
          value={fields.dob}
          editMode={editMode}
          onChange={handleChange}
          name="dob"
        />
        <Information
          label={"Office Mobile No."}
          value={fields.mobile}
          editMode={editMode}
          onChange={handleChange}
          name="mobile"
        />
        <Information
          label={"Email ID"}
          value={fields.email}
          editMode={editMode}
          onChange={handleChange}
          name="email"
        />
        <Information
          label={"Current Office Location"}
          value={fields.location}
          editMode={editMode}
          onChange={handleChange}
          name="location"
        />
        <Information
          label={"Date of joining"}
          value={fields.joining}
          editMode={editMode}
          onChange={handleChange}
          name="joining"
        />
        <Information
          label={"Document"}
          value={fields.document}
          editMode={editMode}
          onChange={handleChange}
          name="document"
        />
        <Information
          label={"Blood Group"}
          value={fields.blood}
          editMode={editMode}
          onChange={handleChange}
          name="blood"
        />
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
