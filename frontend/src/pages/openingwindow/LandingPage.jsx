import React from "react";
import LoginpageNavbar from "./components/LoginpageNavbar";
import Footer from "../../components/Footer";
import { Outlet } from "react-router-dom";

const LandingPage = () => {
  return (
    <>
      <LoginpageNavbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default LandingPage;
