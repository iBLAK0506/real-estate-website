import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const currentUser = useSelector((state) => state.user?.currentUser);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="font-bold text-sm sm:text-xl flex-wrap">
            <span className="text-slate-500">Sahand</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>

        {/* Search */}
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <button type="submit">
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        {/* Navigation */}
        <ul className="flex gap-4 items-center">
          <li className="hidden sm:inline">
            <Link to="/" className="text-slate-700 hover:underline">
              Home
            </Link>
          </li>
          <li className="hidden sm:inline">
            <Link to="/about" className="text-slate-700 hover:underline">
              About
            </Link>
          </li>
          <li>
            <Link to="/profile">
              {currentUser ? (
                <img
                  src={currentUser?.avatar}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <span className="text-slate-700 hover:underline">Sign in</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
