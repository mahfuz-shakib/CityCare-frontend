import React from "react";
import Container from "../../container/Container";
import Banner from "./Banner/Banner";
import LatestResolvedIssues from "./ResolvedIssues/LatestResolvedIssues";
import Features from "./Features/Features";
import HowItWorks from "./HowItWorks/HowItWorks";
import Stats from "./Stats/Stats";
import Testimonials from "./Testimonials/Testimonials";

const Home = () => {
  return (
    <div className="bg-white">
      <title>CityCare - Home</title>
      <Banner />
      <Container>
        <LatestResolvedIssues />
      </Container>
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
    </div>
  );
};

export default Home;
