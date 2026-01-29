import React from "react";
import HeroSection from "../components/home/HeroSection";
import PanchangSection from "../components/home/PanchangSection";
import PujaSection from "../components/home/PujaSection";
import LiveDarshanSection from "../components/home/LiveDarshanSection";
import ChadawaSection from "../components/home/ChadawaSection";

/**
 * Home Component
 * Redesigned to match ShyamPoja "Heritage Home" aesthetic.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-heritage-dark overflow-x-hidden">

      {/* HERO SECTION */}
      <HeroSection />

      {/* PANCHANG & SERVICES */}
      <PanchangSection />

      {/* PUJA SERVICES */}
      <PujaSection />

      {/* LIVE DARSHAN */}
      {/* <LiveDarshanSection /> */}

      {/* CHADAWA & BHOG */}
      <ChadawaSection />

    </div>
  );
}
