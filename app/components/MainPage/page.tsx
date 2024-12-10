import React from "react";
import Footer from "../footer";
import HeroSection from "../HeroSection/page";
import Description from "../HeroSection/description/description";
import Navbar from "../HeroSection/Navbare/page";
function landingPage() {
  return (
    <div className="app">
      <Navbar />
      <HeroSection />
      <Description />
      <Footer />
    </div>
  );
}

export default landingPage;
