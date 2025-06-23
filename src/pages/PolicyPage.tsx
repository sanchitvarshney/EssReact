import { Typography } from "@mui/material";
import PolicyCard from "../components/reuseable/PolicyCard";
import { useState } from "react";
import DocView from "../components/reuseable/DocView";

const PolicyPage = () => {
    const [viewDoc, setViewDoc] = useState<boolean>(false)
  return (
    <div className="w-full p-4">
      <Typography variant="h5" fontWeight={"bold"} py={2}>
        HR Policy
      </Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full lg:grid-cols-5 xl:grid-cols-3 gap-8 px-4  mx-auto ">
        <PolicyCard  open={()=>setViewDoc(true)}/>
        {/* <PolicyCard />
        <PolicyCard />
        <PolicyCard />
        <PolicyCard />
        <PolicyCard /> */}
      </div>
      {viewDoc && <DocView open={viewDoc} close={()=> setViewDoc(false) } ><h1>Doc View</h1></DocView>}
    </div>
  );
};

export default PolicyPage;
