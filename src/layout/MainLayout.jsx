import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet, ScrollRestoration } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div className="md:min-h-[calc(100vh-374px)]">
        <Outlet></Outlet>
      </div>
      <Footer />
      <ToastContainer />
      <ScrollRestoration />
    </>
  );
};

export default MainLayout;
