import styled from "styled-components";

import Header from "../components/header/Header";
import { Outlet } from "react-router-dom";

// props: { children: React.ReactNode }
function MainLayout() {
  return (
    <Wrapper className="">
      <div>
        <Header />
      </div>

      <main className=" bg-[#ffffff] h-full  custom-scrollbar-for-menu "><Outlet /></main>
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
