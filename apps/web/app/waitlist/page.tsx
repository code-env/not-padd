import React from "react";
import Navbar from "@/components/waitlist/navbar";
import Hero from "@/components/waitlist/hero";
import Features from "@/components/waitlist/features";
import Footer from "@/components/waitlist/footer";
import Preview from "@/components/waitlist/preview";
import Others from "@/components/waitlist/others";

const Waitlist = () => {
  return (
    <div className="flex flex-col ">
      <Navbar />
      <Hero />
      <Others>
        <Preview />
        <Features />
      </Others>
      <Footer />
    </div>
  );
};

export default Waitlist;
