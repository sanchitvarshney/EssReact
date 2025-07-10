import styled from "styled-components";

import Header from "../components/header/Header";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

// props: { children: React.ReactNode }
function MainLayout() {

  const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}, []);
  return (
    <Wrapper className="">
      {!isOnline && <div className="absolute top-10 text-white  bg-[red] w-full z-99"><Typography textAlign={"center"}>No Internet Connection</Typography></div>}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className=" relative bottom-0 bg-[#ffffff] h-full  custom-scrollbar-for-menu "><Outlet /></main>
    </Wrapper>
  );
}
const Wrapper = styled.div` 
  .btn {
    overflow: hidden;
    position: relative;

    span {
      position: absolute;
      background-color: #d1d101a3;
      height: 100px;
      width: 10px;
      rotate: 30deg;
      left: -20px;
      transition: all 1.3s;
    }
    &:hover {
      span {
        left: 120px;
        transition: all 1.3s;
      }
    }
  }
`;
export default MainLayout;
