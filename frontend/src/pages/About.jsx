import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* About Us Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">ABOUT <span className="text-blue-600">US</span></h1>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <img src={assets.iphone} alt="About Us" className="w-full md:w-1/2 rounded-lg shadow-md" />
        <div className="md:w-1/2">
          <p className="text-gray-700">
            Welcome to <strong>SwapSmart</strong>, your trusted platform for buying and selling second-hand smartphones.
            We bridge the gap between sellers and buyers by providing a safe, reliable, and convenient marketplace.
          </p>
          <p className="mt-4 text-gray-700">
            At <strong>SwapSmart</strong>, we ensure that every transaction is seamless, secure, and backed by our commitment to quality.
            Our platform is built with cutting-edge technology to provide a user-friendly experience for both sellers and buyers.
          </p>
          <h2 className="mt-6 text-lg font-semibold">Our Mission</h2>
          <p className="mt-2 text-gray-700">
            Our mission is to make smartphone trading effortless, transparent, and accessible to everyone.
            We believe in sustainability by promoting the reuse of devices, reducing electronic waste, and helping people save money while getting quality gadgets.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="text-center mt-12 mb-6">
        <h1 className="text-4xl font-bold">WHY <span className="text-blue-600">CHOOSE US</span></h1>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">Quality Assurance</h3>
          <p className="mt-2 text-gray-700">
            Every listed smartphone undergoes thorough quality checks to ensure reliability.
            We only feature genuine listings from verified sellers, giving buyers peace of mind.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">Convenience</h3>
          <p className="mt-2 text-gray-700">
            Selling and buying phones has never been easier. Our platform allows users to list, browse, and purchase smartphones with just a few clicks.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold">Exceptional Customer Service</h3>
          <p className="mt-2 text-gray-700">
            Our dedicated support team is always ready to assist you with any queries or concerns, ensuring a smooth and hassle-free experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
