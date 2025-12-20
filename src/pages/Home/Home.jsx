import React from "react";
import { Link } from "react-router";
import Container from "../../container/Container";
import { motion } from "framer-motion";
import Banner from "./Banner/Banner";
import LatestResolvedIssues from "./ResolvedIssues/LatestResolvedIssues";
const Home = () => {
  return (
    <div className="bg-gray-0">
      <title>CityCare/Home</title>
      <Container>
        <h1>hellow home</h1>
        <Banner/>
        <LatestResolvedIssues/>
      </Container>
    </div>
  );
};

export default Home;
