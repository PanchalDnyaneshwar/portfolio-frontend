import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdmin(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdmin(false);
    window.location.href = "/";
  };

  return (
    <nav className="fixed w-full z-50 bg-dark-100/90 backdrop-blur-sm py-4 px-8 shadow-md">
      <div className="container mx-auto flex justify-between items-center">

        {/* Logo */}
        <div>
          <a href="/" className="text-3xl font-bold text-white">
            Dnyaneshwar <span className="text-purple">Panchal</span>
          </a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10 items-center">

          {/* Main Links */}
          {["home", "skills", "about", "projects", "experience", "contact"].map((link) => (
            <a
              key={link}
              href={`#${link}`}
              className="relative text-white/80 transition duration-300 hover:text-purple group"
            >
              <span>{link.charAt(0).toUpperCase() + link.slice(1)}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-purple transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}

          {/* Admin Button */}
          {!isAdmin && (
            <a
              href="/admin-login"
              className="px-4 py-2 rounded-full bg-purple text-white text-sm font-semibold hover:bg-purple/80 shadow-sm"
            >
              Admin
            </a>
          )}

          {/* Dashboard + Logout when logged in */}
          {isAdmin && (
            <>
              <a
                href="/admin"
                className="px-4 py-2 rounded-full bg-purple text-white text-sm font-semibold hover:bg-purple/80 shadow-sm"
              >
                Dashboard
              </a>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-500 shadow-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          {showMenu ? (
            <FaXmark className="text-2xl cursor-pointer text-white" onClick={() => setShowMenu(false)} />
          ) : (
            <FaBars className="text-2xl cursor-pointer text-white" onClick={() => setShowMenu(true)} />
          )}
        </div>

      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden mt-4 bg-dark-400 h-screen rounded-lg p-4 flex flex-col space-y-4 text-center justify-center">

          {["home", "skills", "about", "projects", "experience", "contact"].map((link) => (
            <a
              key={link}
              onClick={() => setShowMenu(false)}
              href={`#${link}`}
              className="text-white text-lg hover:text-purple"
            >
              {link.charAt(0).toUpperCase() + link.slice(1)}
            </a>
          ))}

          {!isAdmin && (
            <a
              onClick={() => setShowMenu(false)}
              href="/admin-login"
              className="mt-4 inline-block px-6 py-2 rounded-full bg-purple text-white text-lg hover:bg-purple/80"
            >
              Admin
            </a>
          )}

          {isAdmin && (
            <>
              <a
                onClick={() => setShowMenu(false)}
                href="/admin"
                className="mt-4 inline-block px-6 py-2 rounded-full bg-purple text-white text-lg hover:bg-purple/80"
              >
                Dashboard
              </a>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleLogout();
                }}
                className="inline-block px-6 py-2 rounded-full bg-red-600 text-white text-lg hover:bg-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
