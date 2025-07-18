import React, { useEffect, useState } from "react";

import { CustomButton } from "./ui/CustomButton";

import EditIcon from "@mui/icons-material/Edit";
import { IconButton, TextField, Typography } from "@mui/material";

import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";

const Information = ({
  label,
  value,
  editMode,
  changeValue,
  name,
}: // changeValue,
// name,
{
  label: any;
  value: any;
  editMode: boolean;
  changeValue?: any;
  name?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {editMode ? (
        <TextField
          fullWidth
          id="outlined-basic"
          label={label}
          name={name}
          variant="outlined"
          onChange={changeValue}
          value={value}
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              backgroundColor: "#f9fafb",

              transition: "all 0.2s",
              "& fieldset": {
                borderColor: "#000",
              },
              "&:hover fieldset": {
                borderColor: "#9ca3af",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#2eacb3",
              },
            },
            "& label.Mui-focused": {
              color: "#2eacb3",
            },
            "& label": {
              fontWeight: "bold",
            },
          }}
        />
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
  const [fields, setFields] = useState<any>({});
  const [editSection, setEditSection] = useState({
    basic: false,
    contact: false,
    emergency: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleUpdateInformation = () => {
    // if (editSection.basic) {
    //   const basic_payload = {
    //   }
    // } else if (editSection.contact) {
    // } else {
    // }
    // const payload = {
    //   other: {
    //     hobbies: "Reading, Hiking",
    //   },
    //   identification: {
    //     aadhaar_no: "123456789012",
    //     identity_mark: "Mole on left cheek",
    //   },
    //   family: {
    //     father: "John Doe",
    //     mother: "Jane Doe",
    //     anniversary_dt: "2000-06-15",
    //     spouse: "Mary Doe",
    //     child_count: 2,
    //   },
    //   benifits: {
    //     esi: "ESI1234567",
    //     uan: "UAN9876543210",
    //     pan: "ABCDE1234F",
    //   },
    //   contact: {
    //     permanent: {
    //       house_no: "12A",
    //       village: "Greenfield",
    //       area: "Hilltop",
    //       city: "Metropolis",
    //       pincode: "560001",
    //     },
    //     correspondence: {
    //       house_no: "34B",
    //       village: "Lakeside",
    //       area: "Sunset Avenue",
    //       city: "Metropolis",
    //       pincode: "560002",
    //     },
    //     emergency_a: {
    //       house_no: "78C",
    //       village: "Old Town",
    //       area: "Riverwalk",
    //       city: "Metropolis",
    //       pincode: "560003",
    //     },
    //     passport: {
    //       passport_no: "M1234567",
    //       passport_office: "Delhi",
    //       passport_issue_dt: "2015-05-20",
    //       passport_exp_dt: "2025-05-19",
    //     },
    //     emergency_c: {
    //       emer_cont_name: ["Alice", "Bob"],
    //       emer_cont_relation: ["Sister", "Friend"],
    //       emer_cont_mobile: ["9876543210", "8765432109"],
    //     },
    //   },
    // };
  };

  useEffect(() => {
    if (data?.result) {
      const valueData = {
        f_name: data?.result?.basic[0].father_name,
        m_name: data?.result?.basic[0].mother_name,
        spouse: data?.result?.basic[0].spouse,
        uan: data?.result?.basic[0].uan,
        esi: data?.result?.basic[0].esi,
        dob: data?.result?.basic[0].dob,
        joining: data?.result?.basic[0].doj,
        marital_status: data?.result?.basic[0].marital_status,
        religion: data?.result?.basic[0].religion,
        nationality: data?.result?.basic[0].nationality,
        email: data?.result?.basic[0].email,
        mobile: data?.result?.basic[0].mobile,
        address: data?.result?.basic[0].address,
        city: data?.result?.basic[0].city,
        state: data?.result?.basic[0].state,
        country: data?.result?.basic[0].country,
        pincode: data?.result?.basic[0].pincode,
        pan: data?.result?.basic[0].pan,

        c_house_no: data?.result?.c_address[0]?.house_no,
        c_village: data?.result?.c_address[0]?.village,
        c_area: data?.result?.c_address[0]?.area,
        c_city: data?.result?.c_address[0]?.city,
        c_state: data?.result?.c_address[0]?.state,
        c_pincode: data?.result?.c_address[0]?.pincode,
        p_house_no: data?.result?.c_address[0]?.house_no,
        p_village: data?.result?.c_address[0]?.village,
        p_area: data?.result?.c_address[0]?.area,
        p_city: data?.result?.c_address[0]?.city,
        p_state: data?.result?.c_address[0]?.state,
        p_pincode: data?.result?.c_address[0]?.pincode,
        e_name: data?.result?.e_contact[0]?.contact_name_a,
        e_mobile: data?.result?.e_contact[0]?.a_contact,
        b_name: data?.result?.e_contact[0]?.contact_name_b,
        b_mobile: data?.result?.e_contact[0]?.b_contact,
      };
      setFields(valueData);
    }
  }, [data?.result]);

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
              <IconButton onClick={handleUpdateInformation}>
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
            value={fields?.f_name}
            editMode={editSection.basic}
            changeValue={handleChange}
            name="f_name"
          />
          <Information
            label={"Mother Name"}
            value={fields?.m_name}
            editMode={editSection.basic}
            changeValue={handleChange}
            name="m_name"
          />
          <Information
            label={"Spouse"}
            value={fields?.spouse}
            editMode={editSection.basic}
            changeValue={handleChange}
            name="spouse"
          />
          <Information
            label={"PAN Number"}
            value={fields?.pan}
            editMode={editSection.basic}
            changeValue={handleChange}
            name="pan"
          />
          <Information
            label={"UAN Number"}
            value={fields?.uan}
            editMode={editSection.basic}
            changeValue={handleChange}
            name="uan"
          />
          <Information
            label={"ESI Number"}
            value={fields?.esi}
            editMode={editSection.basic}
            changeValue={handleChange}
            name="esi"
          />
          <Information
            label={"Date of joining"}
            value={fields?.joining}
            editMode={editSection.basic}
            changeValue={handleChange}
            name="joining"
          />
          <Information
            label={"Date of birth"}
            value={fields?.dob}
            editMode={editSection.basic}
            changeValue={handleChange}
            name="dob"
          />
          <Information
            label={"Office Mobile No."}
            value={fields?.mobile}
            editMode={editSection.basic}
            changeValue={handleChange}
            name="mobile"
          />
          <Information
            label={"Email ID"}
            value={fields?.email}
            editMode={editSection.basic}
            changeValue={handleChange}
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
        <Typography variant="body2" fontWeight={600} py={2} sx={{ ml: 2 }}>
          Current Address
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8 px-4 pl-10 ">
          <Information
            label={"House No."}
            value={`${fields?.c_house_no}`}
            editMode={editSection.contact}
            changeValue={handleChange}
            name="c_house_no"
          />
          <Information
            label={"Village"}
            value={`${fields?.c_village}`}
            editMode={editSection.contact}
            changeValue={handleChange}
            name="c_village"
          />
          <Information
            label={"Area"}
            value={`${fields?.c_area}`}
            editMode={editSection.contact}
            changeValue={handleChange}
            name="c_area"
          />
          <Information
            label={"City"}
            value={`${fields?.c_city}`}
            editMode={editSection.contact}
            changeValue={handleChange}
            name="c_city"
          />
          <Information
            label={"State"}
            value={`${fields?.c_state}`}
            editMode={editSection.contact}
            changeValue={handleChange}
            name="c_state"
          />
        </div>
        <Typography variant="body2" fontWeight={600} py={2} sx={{ ml: 2 }}>
          Permanent Address
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8 px-4 pl-10 ">
          <Information
            label={"House No."}
            value={`${fields?.p_house_no}`}
            editMode={editSection.contact}
            changeValue={handleChange}
            name="p_house_no"
          />
          <Information
            label={"Village"}
            value={`${fields?.p_village}`}
            editMode={editSection.contact}
            changeValue={handleChange}
            name="p_village"
          />
          <Information
            label={"Area"}
            value={`${fields?.p_area}`}
            editMode={editSection.contact}
            changeValue={handleChange}
            name="p_area"
          />
          <Information
            label={"City"}
            value={`${fields?.p_city}`}
            editMode={editSection.contact}
            changeValue={handleChange}
            name="p_city"
          />
          <Information
            label={"State"}
            value={`${fields?.p_state}`}
            editMode={editSection.contact}
            changeValue={handleChange}
            name="p_state"
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
            value={fields?.e_name}
            editMode={editSection.emergency}
            changeValue={handleChange}
            name="e_name"
          />
          <Information
            label={"Mobile Number"}
            value={fields?.e_mobile}
            editMode={editSection.emergency}
            changeValue={handleChange}
            name="e_mobile"
          />
          <Information
            label={"Name"}
            value={fields?.b_name}
            editMode={editSection.emergency}
            changeValue={handleChange}
            name="b_name"
          />
          <Information
            label={"Mobile Number"}
            value={fields?.b_mobile}
            editMode={editSection.emergency}
            changeValue={handleChange}
            name="b_mobile"
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
