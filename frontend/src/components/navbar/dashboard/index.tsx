import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext"; // Add this import
import { useContentToShow, useContractSelected, useCurrentDocId } from "../../../store";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from "../../Loader";

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
  const { created, name, status, version } = useContractSelected();
  const { content } = useContentToShow();
  const { user, logout } = useAuth();
  const { id } = useCurrentDocId();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [isFinalized, setIsFinalized] = useState(false)

  const successFinalize = () => {
    toast.success('Success: Finalize Document!', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }

  function onClick() {
    setNavBarOpen(!navBarOpen);
  }
  const toastError = () => {
    toast.error('Error: Something went wrong!', {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by AuthContext
    } catch (error) {
      toastError()
      console.error("Failed to logout:", error);
    }
  };

  const handleFinalizeDoc = async () => {
    setIsFinalized(true)
    try {
      if (!userInfo?.email) {
        alert("Please login!");
        return navigate('/');
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/document/${id}/finalize`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'business-id': userInfo?.email
        },
      });

      if (!response.ok) {
        throw new Error('Failed to finalize document');
      }

      successFinalize()
      setIsFinalized(false)
      useContractSelected.setState({ status: 'FINAL' })
    } catch (error) {
      toastError()
      setIsFinalized(false)
      console.error("Error finalizing document:", error);
    }
  }

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
        {content === 'editor' && <div className="flex flex-col gap-y-2 items-start justify-center pt-2 pl-4">
          <div className="flex flex-row gap-x-4">
            <div>{name ?? ''}</div>
            <div className="bg-slate-400 text-white text-xs px-2 py-1 rounded-md">{version ?? ''}</div>
            <div className={`px-3 py-1 rounded-3xl text-xs ${status.toLowerCase() === 'draft' ? 'bg-blue-100 text-blue-700' : status.toLowerCase() === 'review' ? 'bg-yellow-100 text-yellow-700' : status.toLowerCase() === 'final' ? 'bg-green-100 text-green-700' : ''}`}>{status ?? ''}</div>
          </div>
          <div className="flex flex-row gap-x-2">
            <div className="text-sm">
              Created {created
                ? new Intl.DateTimeFormat('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  }).format(created)
                : ''}
            </div>
          </div>
        </div>}
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
          {content === 'editor' && status !== 'FINAL' && <div className="pr-4">
            <button className="bg-green-100 text-green-700 disabled:pointer-events-none" onClick={handleFinalizeDoc} disabled={isFinalized}>{isFinalized ? <Loader /> :  'Finalize doc'}</button>
          </div>}
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
