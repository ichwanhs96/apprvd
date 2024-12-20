import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext"; // Add this import

interface NavItem {
  label: string;
  href: string;
}

interface DashboardNavbarProps {
  navItems: NavItem[];
}

const HomeNavbar: React.FC<DashboardNavbarProps> = ({ navItems }) => {
  const [navBarOpen, setNavBarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();

  function onClick() {
    setNavBarOpen(!navBarOpen);
  }

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by AuthContext
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-40 w-screen flex items-center justify-between flex-wrap bg-transparent p-4 border-b-2">
        <div className="flex items-center flex-shrink-0 text-black mr-6">
          <a
            href="/"
            className="flex items-center mx-12 mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img
              width={54}
              height={54}
              src="https://framerusercontent.com/images/kwlTL4WuegjLeIlxVMlWaU5MsJo.png"
            />
            <span className="font-semibold text-2xl ml-2 tracking-tight">
              Apprvd
            </span>
          </a>
        </div>
        <div className="block lg:hidden">
          <button className="group flex items-center px-6 py-4 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
            <svg
              className={`fill-current h-3 w-3 ${
                navBarOpen ? "hidden" : "block"
              }`}
              onClick={onClick}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
            <svg
              className={`fill-current h-3 w-3 ${
                navBarOpen ? "block" : "hidden"
              }`}
              onClick={onClick}
              viewBox="0 0 40 40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Close Menu</title>
              <path
                d="M 10,10 L 30,30 M 30,10 L 10,30"
                stroke="white"
                strokeWidth="4"
              />
            </svg>
          </button>
        </div>
        <div
          className={`w-full flex-grow lg:flex lg:items-center lg:w-auto ${
            navBarOpen ? "block" : "hidden"
          }`}
        >
          <div className="text-sm lg:flex-grow">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center bg-transparent"
              >
                <img 
                  src={user?.photoURL || '/default-avatar.png'} 
                  alt={`${user?.email || 'User'}'s profile`}
                  className="w-8 h-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full bg-white text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export type { NavItem };
export default HomeNavbar;
