import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import BadgeIcon from "@mui/icons-material/Badge";
import HomeIcon from "@mui/icons-material/Home";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { IconButton, TextField } from "@mui/material";

/* ── Single field display / edit ── */
const Information = ({
  label,
  value,
  editMode,
  changeValue,
  name,
}: {
  label: any;
  value: any;
  editMode: boolean;
  changeValue?: any;
  name?: string;
}) => {
  if (editMode) {
    return (
      <TextField
        fullWidth
        id={name}
        label={label}
        name={name}
        variant="outlined"
        onChange={changeValue}
        value={value}
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            backgroundColor: "#f9fafb",
            transition: "all 0.2s",
            "& fieldset": { borderColor: "#e2e8f0" },
            "&:hover fieldset": { borderColor: "#2eacb3" },
            "&.Mui-focused fieldset": { borderColor: "#2eacb3" },
          },
          "& label.Mui-focused": { color: "#2eacb3" },
          "& label": { fontSize: 13 },
        }}
      />
    );
  }

  const isEmpty = value === null || value === "" || value === "--";
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      <span className={`text-sm font-medium ${isEmpty ? "text-gray-300" : "text-gray-800"}`}>
        {isEmpty ? "—" : value}
      </span>
    </div>
  );
};

/* ── Section header ── */
const SectionHeader = ({
  icon,
  title,
  editMode,
  onToggleEdit,
  onSave,
  disabled = true,
}: {
  icon: React.ReactNode;
  title: string;
  editMode: boolean;
  onToggleEdit: () => void;
  onSave?: () => void;
  disabled?: boolean;
}) => (
  <div className="flex justify-between items-center px-5 py-3.5 border-b border-gray-50">
    <div className="flex items-center gap-2">
      <div className="w-1 h-5 rounded-full bg-[#2eacb3]" />
      {icon}
      <span className="text-sm font-bold text-gray-800">{title}</span>
    </div>
    <div className="flex gap-1">
      {editMode && (
        <IconButton size="small" onClick={onSave}>
          <SaveIcon sx={{ fontSize: 18, color: "#2eacb3" }} />
        </IconButton>
      )}
      <IconButton size="small" onClick={onToggleEdit} disabled={disabled}>
        {editMode ? (
          <CancelIcon sx={{ fontSize: 18, color: "#ef4444" }} />
        ) : (
          <EditIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
        )}
      </IconButton>
    </div>
  </div>
);

/* ── Sub-section label (Current / Permanent Address) ── */
const SubLabel = ({ label }: { label: string }) => (
  <div className="col-span-full flex items-center gap-2 pt-1 pb-0">
    <div className="w-2 h-2 rounded-full bg-[#2eacb3]/50" />
    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{label}</span>
    <div className="flex-1 h-px bg-gray-100" />
  </div>
);

/* ── Main component ── */
const EmployeeInformationPage = ({ data }: { editMode?: boolean; data: any }) => {
  const [fields, setFields] = useState<any>({});
  const [editSection, setEditSection] = useState({
    basic: false,
    contact: false,
    emergency: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields({ ...fields, [e.target.name]: e.target.value });

  const handleUpdateInformation = () => {};

  useEffect(() => {
    if (data?.result) {
      setFields({
        f_name: data.result.basic[0].father_name,
        m_name: data.result.basic[0].mother_name,
        spouse: data.result.basic[0].spouse,
        uan: data.result.basic[0].uan,
        esi: data.result.basic[0].esi,
        dob: data.result.basic[0].dob,
        joining: data.result.basic[0].doj,
        marital_status: data.result.basic[0].marital_status,
        religion: data.result.basic[0].religion,
        nationality: data.result.basic[0].nationality,
        email: data.result.basic[0].email,
        mobile: data.result.basic[0].mobile,
        address: data.result.basic[0].address,
        city: data.result.basic[0].city,
        state: data.result.basic[0].state,
        country: data.result.basic[0].country,
        pincode: data.result.basic[0].pincode,
        pan: data.result.basic[0].pan,

        c_house_no: data.result.c_address[0]?.house_no,
        c_village: data.result.c_address[0]?.village,
        c_area: data.result.c_address[0]?.area,
        c_city: data.result.c_address[0]?.city,
        c_state: data.result.c_address[0]?.state,
        c_pincode: data.result.c_address[0]?.pincode,

        p_house_no: data.result.p_address[0]?.house_no,
        p_village: data.result.p_address[0]?.village,
        p_area: data.result.p_address[0]?.area,
        p_city: data.result.p_address[0]?.city,
        p_state: data.result.p_address[0]?.state,
        p_pincode: data.result.p_address[0]?.pincode,

        e_name: data.result.e_contact[0]?.contact_name_a,
        e_mobile: data.result.e_contact[0]?.a_contact,
        b_name: data.result.e_contact[0]?.contact_name_b,
        b_mobile: data.result.e_contact[0]?.b_contact,
      });
    }
  }, [data?.result]);

  return (
    <div className="py-4 flex flex-col gap-4">

      {/* ── Basic Information ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionHeader
          icon={<BadgeIcon sx={{ fontSize: 16, color: "#2eacb3" }} />}
          title="Basic Information"
          editMode={editSection.basic}
          onToggleEdit={() => setEditSection((p) => ({ ...p, basic: !p.basic }))}
          onSave={handleUpdateInformation}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 p-5">
          {[
            { label: "Father Name", name: "f_name" },
            { label: "Mother Name", name: "m_name" },
            { label: "Spouse", name: "spouse" },
            { label: "PAN Number", name: "pan" },
            { label: "UAN Number", name: "uan" },
            { label: "ESI Number", name: "esi" },
            { label: "Date of Joining", name: "joining" },
            { label: "Date of Birth", name: "dob" },
            { label: "Office Mobile No.", name: "mobile" },
            { label: "Email ID", name: "email" },
          ].map(({ label, name }) => (
            <Information
              key={name}
              label={label}
              value={fields?.[name] || "--"}
              editMode={editSection.basic}
              changeValue={handleChange}
              name={name}
            />
          ))}
        </div>
      </div>

      {/* ── Contact Information ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionHeader
          icon={<HomeIcon sx={{ fontSize: 16, color: "#2eacb3" }} />}
          title="Contact Information"
          editMode={editSection.contact}
          onToggleEdit={() => setEditSection((p) => ({ ...p, contact: !p.contact }))}
          onSave={() => {}}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 p-5">
          <SubLabel label="Current Address" />
          {[
            { label: "House No.", name: "c_house_no" },
            { label: "Village", name: "c_village" },
            { label: "Area", name: "c_area" },
            { label: "City", name: "c_city" },
            { label: "State", name: "c_state" },
          ].map(({ label, name }) => (
            <Information
              key={name}
              label={label}
              value={fields?.[name] || "--"}
              editMode={editSection.contact}
              changeValue={handleChange}
              name={name}
            />
          ))}

          <SubLabel label="Permanent Address" />
          {[
            { label: "House No.", name: "p_house_no" },
            { label: "Village", name: "p_village" },
            { label: "Area", name: "p_area" },
            { label: "City", name: "p_city" },
            { label: "State", name: "p_state" },
          ].map(({ label, name }) => (
            <Information
              key={name}
              label={label}
              value={fields?.[name] || "--"}
              editMode={editSection.contact}
              changeValue={handleChange}
              name={name}
            />
          ))}
        </div>
      </div>

      {/* ── Emergency Contact ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SectionHeader
          icon={<LocalPhoneIcon sx={{ fontSize: 16, color: "#2eacb3" }} />}
          title="Emergency Contact"
          editMode={editSection.emergency}
          onToggleEdit={() => setEditSection((p) => ({ ...p, emergency: !p.emergency }))}
          onSave={() => {}}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 p-5">
          {[
            { label: "Contact A — Name", name: "e_name" },
            { label: "Contact A — Mobile", name: "e_mobile" },
            { label: "Contact B — Name", name: "b_name" },
            { label: "Contact B — Mobile", name: "b_mobile" },
          ].map(({ label, name }) => (
            <Information
              key={name}
              label={label}
              value={fields?.[name] || "--"}
              editMode={editSection.emergency}
              changeValue={handleChange}
              name={name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeInformationPage;
