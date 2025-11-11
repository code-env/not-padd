import React from "react";
import Navbar from "@/components/waitlist/navbar";
import Hero from "@/components/waitlist/hero";
import Features from "@/components/waitlist/features";
import Footer from "@/components/waitlist/footer";
import Preview from "@/components/waitlist/preview";
import Others from "@/components/waitlist/others";
import Cta from "@/components/waitlist/cta";
import JoinWaitlistEmail from "@/components/waitlist/email";

const Waitlist = () => {
  return (
    <div className="flex flex-col ">
      <Navbar />
      <Hero />
      <Others>
        <Preview />
        <Features />
        <Cta />
      </Others>
      <Footer />
      <JoinWaitlistEmail />
    </div>
  );
};

export default Waitlist;
