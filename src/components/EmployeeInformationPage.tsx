const Information = ({ label, value }: { label: any; value: any }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-lg font-semibold">{label}</span>
      <span className="text-base">{value}</span>
    </div>
  );
};
const EmployeeInformationPage = () => {
  return (
    <div className=" my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-8 px-4 pl-10 ">
        <Information label={"Date of birth"} value={"14-july-2002"} />
        <Information label={"Office Mobile No."} value={`+91${"9876548888"}`} />
        <Information label={"Email ID"} value={"info@test.in"} />
        <Information
          label={"Current Office Location"}
          value={"Noida,UP,India"}
        />
        <Information label={"Date of joining"} value={"24-02-2022"} />

        <Information label={"Document"} value={"Doc"} />
        <Information label={"Blood Group"} value={"B+"} />
      </div>
    </div>
  );
};

export default EmployeeInformationPage;
