import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets"; 
import { NavLink, useNavigate, useLocation } from "react-router-dom"; 
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken, userData} = useContext(AppContext);
  const [mobnav, setMobnav] = useState(false);

  // Automatically close mobile menu when user navigates to a different route
  useEffect(() => {
    setMobnav(false);
  }, [location.pathname]);

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="flex justify-between py-4 border-b-[1.5px] border-slate-400 relative">
      
      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="logo"
      />

      {/* Mobile: Profile/Account button  */}
      <div className="flex sm:hidden gap-2">
        {token ? (
          // If user is logged in , show profile dropdown
          <div className="flex gap-2 items-center sm:hidden cursor-pointer group relative">
            <img className="w-10 rounded-full" src={userData.image} alt="Profile" />
            <img className="w-3" src={assets.dropdown_icon} alt="Dropdown icon" />
            <div className="absolute top-0 right-0 pt-16 hidden group-hover:block">
              <div className="px-3 min-w-40 text-gray-600 bg-stone-100">
                <p onClick={() => navigate('/my-profile')} className="py-1 hover:text-black">My Profile</p>
                <p onClick={() => navigate('/my-appointments')} className="py-1 hover:text-black">My Appointments</p>
                <p onClick={logout} className="py-1 hover:text-black">Logout</p>
              </div>
            </div>
          </div>
        ) : (
          // If not logged in, show login button
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 sm:hidden border-[1px] px-3 rounded-full border-[grey] text-white"
          >
            Sign In
          </button>
        )}

        {/* Mobile menu toggle button */}
        <img
          className="sm:hidden w-8 cursor-pointer"
          onClick={() => setMobnav(!mobnav)}
          src={mobnav ? assets.cross_icon : assets.menu_icon}
          alt="menu-icon"
        />
      </div>

      {/* Mobile navigation links */}
      <div className="max-sm:absolute pt-2 top-0 right-0 max-sm:mt-20">
        <ul className={` ${mobnav ? 'max-sm:block' : 'max-sm:hidden'} flex max-sm:w-32 max-sm:flex-col max-sm:bg-stone-100 max-sm:gap-2 items-center max-sm:items-start gap-4 max-sm:pl-2 max-sm:py-2`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? 'underline text-blue-500' : ''} underline-offset-4 decoration-black`
              }
            >
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Doctors"
              className={({ isActive }) =>
                `${isActive ? 'underline text-blue-600' : ''} underline-offset-4 decoration-black`
              }
            >
              ALL DOCTORS
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${isActive ? 'underline text-blue-600' : ''} underline-offset-4 decoration-black`
              }
            >
              ABOUT
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${isActive ? 'underline text-blue-600' : ''} underline-offset-4 decoration-black`
              }
            >
              CONTACT
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Desktop: Profile or Login button */}
      {token ? (
        <div className="flex gap-2 items-center max-sm:hidden cursor-pointer group relative">
          <img className="w-10 rounded-full" src={userData.image} alt="Profile" />
          <img className="w-3" src={assets.dropdown_icon} alt="Dropdown icon" />
          <div className="absolute top-0 right-0 pt-16 hidden group-hover:block">
            <div className="px-3 min-w-40 text-gray-600 bg-stone-100">
              <p onClick={() => navigate('/my-profile')} className="py-1 hover:text-black">My Profile</p>
              <p onClick={() => navigate('/my-appointments')} className="py-1 hover:text-black">My Appointments</p>
              <p onClick={logout} className="py-1 hover:text-black">Logout</p>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-500 max-sm:hidden border-[1px] px-3 rounded-full border-[grey] text-white"
        >
          Sign In
        </button>
      )}
    </nav>
  );
};

export default Navbar;
