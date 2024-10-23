import React from "react";

import HomeNavbar from "../components/navbar/landing";
import { NavItem } from "../components/navbar/landing";
import Footer from "../components/footer";
import { FooterItem } from "../components/footer";
import WaitlistForm from "../components/waitlistForm";

const Template: React.FC = () => {
  const navItems: NavItem[] = [];
  const footerItems: FooterItem[] = [
    {
      label: "Try now",
      href: "#",
    },
    {
      label: "Features",
      href: "#",
    },
    {
      label: "Contact Us",
      href: "#",
    },
    {
      label: "Templates",
      href: "#",
    },
  ];

  return (
    <>
      <HomeNavbar navItems={navItems} />
      <div className="flex flex-col navbar-margin items-center justify-center mx-36">
        <h1 className="text-6xl font-bold">Templates</h1>
        <p className="text-lg py-4 px-36">
          Whether you're starting a business, building an empire, or have
          business-related administration to carry out, we're here to help with
          our range of professional business contracts. From service agreements
          to NDAs, we've got the legal documents you need to make your
          day-to-day easier. Explore our business legal documents, forms, and
          contracts below.
        </p>
        <button className="flex flex-row bg-transparent text-apprvd-secondary rounded-lg max-w-lg px-16 my-16 font-light hover:shadow-lg transition-all duration-500 border-black">
          <span>
            <svg
              width={20}
              height={20}
              className="mr-2"
              aria-labelledby="title desc"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 19.9 19.7"
            >
              <title id="title">Search Icon</title>
              <desc id="desc">A magnifying glass icon.</desc>
              <g fill="none" stroke="#848F91">
                <path strokeLinecap="square" d="M18.5 18.3l-5.4-5.4" />
                <circle cx="8" cy="8" r="7" />
              </g>
            </svg>
          </span>
          Search for a document template
        </button>
        <div className="flex flex-row flex-wrap justify-center items-center">
          <div className="w-[320px] rounded-3xl overflow-hidden shadow-lg m-4 hover:cursor-pointer">
            <div className="flex flex-row px-6 pt-10 pb-12">
              <img
                className="w-16 h-16 object-cover"
                src="https://framerusercontent.com/images/W06wYzAwPUIM6YUgU9D2AoGT3vg.png"
              ></img>
              <p className="text-xl font-bold ml-4">Terms and Conditions</p>
            </div>
          </div>
          <div className="w-[320px] rounded-3xl overflow-hidden shadow-lg m-4 hover:cursor-pointer">
            <div className="flex flex-row px-6 pt-10 pb-12">
              <img
                className="w-16 h-16 object-cover"
                src="https://framerusercontent.com/images/W06wYzAwPUIM6YUgU9D2AoGT3vg.png"
              ></img>
              <p className="text-xl font-bold ml-4">Service Agreement</p>
            </div>
          </div>
          <div className="w-[320px] rounded-3xl overflow-hidden shadow-lg m-4 hover:cursor-pointer">
            <div className="flex flex-row px-6 pt-10 pb-12">
              <img
                className="w-16 h-16 object-cover"
                src="https://framerusercontent.com/images/W06wYzAwPUIM6YUgU9D2AoGT3vg.png"
              ></img>
              <p className="text-xl font-bold ml-4">Privacy Policy</p>
            </div>
          </div>
          <div className="w-[320px] rounded-3xl overflow-hidden shadow-lg m-4 hover:cursor-pointer">
            <div className="flex flex-row px-6 pt-10 pb-12">
              <img
                className="w-16 h-16 object-cover"
                src="https://framerusercontent.com/images/W06wYzAwPUIM6YUgU9D2AoGT3vg.png"
              ></img>
              <p className="text-xl font-bold ml-4">Non-Disclosure Agreement</p>
            </div>
          </div>
          <div className="w-[320px] rounded-3xl overflow-hidden shadow-lg m-4 hover:cursor-pointer">
            <div className="flex flex-row px-6 pt-10 pb-12">
              <img
                className="w-16 h-16 object-cover"
                src="https://framerusercontent.com/images/W06wYzAwPUIM6YUgU9D2AoGT3vg.png"
              ></img>
              <p className="text-xl font-bold ml-4">Freelance Agreement</p>
            </div>
          </div>
          <div className="w-[320px] rounded-3xl overflow-hidden shadow-lg m-4 hover:cursor-pointer">
            <div className="flex flex-row px-6 pt-10 pb-12">
              <img
                className="w-16 h-16 object-cover"
                src="https://framerusercontent.com/images/W06wYzAwPUIM6YUgU9D2AoGT3vg.png"
              ></img>
              <p className="text-xl font-bold ml-4">
                Data Processing Agreement (GDPR)
              </p>
            </div>
          </div>
        </div>
        {/* Waitlist form */}
        <WaitlistForm />
      </div>
      {/* Footer */}
      <Footer footerItems={footerItems} />
    </>
  );
};

export default Template;
