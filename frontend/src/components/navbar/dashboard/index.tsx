import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext"; // Add this import
import { useContentToShow, useContractSelected, useCurrentDocId, useAutoSave, useContentPage } from "../../../store";
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
  const { created, name, status, version, shared_with } = useContractSelected();
  const { content } = useContentToShow();
  const { user, logout } = useAuth();
  const { id } = useCurrentDocId();
  const { isSave } = useAutoSave();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [isFinalized, setIsFinalized] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [sharedUsers, setSharedUsers] = useState<string[]>(shared_with);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const { contentPage } = useContentPage()

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

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tinymce/documents/${id}/finalize`, {
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

  useEffect(() => {
    console.log(shared_with);
    setSharedUsers(shared_with);
  }, [shared_with])

  const handleShareDoc = () => {
    setShowShareModal(true);
  }

  const handleAddUser = async () => {
    if (!emailInput.trim() || !userInfo?.email) return;
    setIsAddingUser(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tinymce/documents/${id}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'business-id': userInfo.email
        },
        body: JSON.stringify({ email: emailInput })
      });

      if (!response.ok) {
        throw new Error('Failed to share document');
      }

      setSharedUsers([...sharedUsers, emailInput]);
      useContractSelected.setState({ shared_with: [...sharedUsers, emailInput] });
      setEmailInput('');
    } catch (error) {
      toastError();
      console.error("Error sharing document:", error);
    } finally {
      setIsAddingUser(false);
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
            <div>{!isSave ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-loader-icon lucide-loader"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>:<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check-icon lucide-circle-check"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>}</div>
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
          {content === 'editor' && contentPage !== 'template' &&<div className="mr-4">
            <button className='bg-gray-100 text-green-700 disabled:pointer-events-none' onClick={handleShareDoc}>Share</button>
          </div>}
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

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Share Document</h2>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 border-1 border-gray-500 bg-transparent hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 p-2 border rounded bg-gray-100"
              />
              <button
                onClick={handleAddUser}
                disabled={isAddingUser}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
              >
                {isAddingUser ? <Loader /> : 'Add'}
              </button>
            </div>

            {sharedUsers.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Shared with:</h3>
                <ul className="space-y-2">
                  {sharedUsers.map((email, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      {email}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export type { NavItem };
export default HomeNavbar;
