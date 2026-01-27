import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaOm,
  FaPlaceOfWorship,
  FaGift,
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaQuoteLeft
} from "react-icons/fa";

/**
 * AnimatedCounter Component
 * Simple hook-based counter for stats
 */
const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16); // 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count}+</span>;
};

/**
 * Home Component
 * Refactored for a clean, professional, and trustworthy appearance.
 *
 * Philosophy: "Less is More".
 * - Removed excessive floating animations.
 * - Used clear, high-contrast typography.
 * - structured grid layouts.
 */
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800">

      {/*
        HERO SECTION
        Clean, centered, impact.
      */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?q=80&w=2000&auto=format&fit=crop"
            alt="Spiritual Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight tracking-tight">
            Your Digital Gateway to <br />
            <span className="text-orange-400">Divine Blessings</span>
          </h1>

          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Book authentic Poojas, explore ancient temples, and offer Chadawa from the comfort of your home. Experience spirituality reimagined.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/poojas" className="bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold px-10 py-4 rounded-full transition-all shadow-lg hover:shadow-orange-900/20">
              Book a Pooja
            </Link>
            <Link to="/temples" className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white text-lg font-semibold px-10 py-4 rounded-full transition-all">
              Explore Temples
            </Link>
          </div>
        </div>
      </section>

      {/*
        STATS STRIP
        Standard clean row.
      */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            {[
              { number: 500, label: "Verified Pandits" },
              { number: 50, label: "Partner Temples" },
              { number: 15000, label: "Poojas Completed" },
              { number: 4.9, label: "User Rating", isFloat: true },
            ].map((stat, index) => (
              <div key={index} className="px-4">
                <div className="text-4xl font-bold text-gray-900 font-serif mb-1">
                  {stat.isFloat ? stat.number : <AnimatedCounter end={stat.number} />}
                  {stat.isFloat ? "" : "+"}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-widest font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*
        SERVICES SECTION
        Clean Card Grid.
      */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Our Core Services</h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Comprehensive spiritual solutions designed for your peace of mind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pooja Card */}
            <Link to="/poojas" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1629814249584-bd4d053cf0e7d?q=80&w=800&auto=format&fit=crop"
                  alt="Pooja"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm">
                  <FaOm className="text-2xl text-orange-600" />
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">Online Poojas</h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                  Connect with verified pandits for personalized Vedic rituals performed at auspicious times.
                </p>
                <div className="font-semibold text-orange-600 flex items-center gap-2 group-hover:gap-4 transition-all">
                  Book Now <FaArrowRight />
                </div>
              </div>
            </Link>

            {/* Temple Card */}
            <Link to="/temples" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop"
                  alt="Temples"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm">
                  <FaPlaceOfWorship className="text-2xl text-orange-600" />
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">Temple Connect</h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                  Discover historical temples, view darshan timings, and plan your spiritual visits effortlessly.
                </p>
                <div className="font-semibold text-orange-600 flex items-center gap-2 group-hover:gap-4 transition-all">
                  Explore <FaArrowRight />
                </div>
              </div>
            </Link>

            {/* Chadawa Card */}
            <Link to="/chadawas" className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1585640243160-b989679f0f35?q=80&w=800&auto=format&fit=crop"
                  alt="Chadawa"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-sm">
                  <FaGift className="text-2xl text-orange-600" />
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">E-Chadawa</h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                  Send offerings to deities across India and have the sacred Prasad delivered to your doorstep.
                </p>
                <div className="font-semibold text-orange-600 flex items-center gap-2 group-hover:gap-4 transition-all">
                  Send Offering <FaArrowRight />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/*
        WHY CHOOSE US
        Clean Split screen.
      */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://plus.unsplash.com/premium_photo-1682092591636-224424388dc8?q=80&w=800&auto=format&fit=crop"
                  alt="Why Choose Us"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative border element */}
              <div className="absolute inset-0 border-2 border-orange-500 rounded-3xl translate-x-4 translate-y-4 -z-10 bg-orange-50"></div>
            </div>

            <div>
              <div className="text-orange-600 font-bold uppercase tracking-wider text-sm mb-2">Why Choose ShyamSeva</div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                Bridging Tradition <br /> with Modern Convenience
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We ensure that your spiritual journey is seamless, authentic, and secure. Our platform connects you directly with trusted religious institutions and vedic experts.
              </p>

              <div className="space-y-6">
                {[
                  { title: "Authenticated Pandits", desc: "100% verified Vedic experts." },
                  { title: "Secure Transactions", desc: "Bank-grade security for all bookings." },
                  { title: "Live Streaming", desc: "Watch your rituals live in HD." },
                  { title: "Prompt Support", desc: "24/7 assistance for your queries." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <FaCheckCircle className="text-green-500 text-xl flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link to="/about" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                  Learn more about our mission &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
        TESTIMONIALS
      */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">What Devotees Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "ShyamSeva made it so easy to book a Pandit for my Griha Pravesh. The entire process was smooth and the Panditji was very knowledgeable.",
                author: "Anjali Gupta",
                location: "Bangalore"
              },
              {
                text: "I was looking for a way to offer Chadawa at Kashi Vishwanath while being in the US. This platform is a blessing.",
                author: "Rajesh Kumar",
                location: "USA"
              },
              {
                text: "Excellent service. The live streaming quality was great and I felt like I was physically present for the pooja.",
                author: "Sunita Reddy",
                location: "Hyderabad"
              }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex text-orange-400 gap-1 text-sm mb-4">
                  {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p className="text-gray-600 italic mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                    {t.author[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">{t.author}</h5>
                    <p className="text-xs text-gray-500">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*
        Simple Start Journey Banner
      */}
      <section className="bg-orange-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Begin Your Spiritual Journey Today</h2>
          <Link to="/bookings" className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
