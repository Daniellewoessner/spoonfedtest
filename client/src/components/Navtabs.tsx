import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const currentPage = window.location.pathname;
  const token = localStorage.getItem("id_token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("id_token");
    localStorage.removeItem("username");
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <nav className="w-full py-4 bg-gray-50">
      <div className="container mx-auto px-4 flex gap-8">
        <Link
          to="/"
          className={`text-xl transition-colors ${
            currentPage === "/"
              ? "text-blue-900 font-bold"
              : "text-gray-500 hover:text-blue-700"
          }`}
        >
          Home
        </Link>
        <Link
          to="/dashboard"
          className={`text-xl transition-colors ${
            currentPage === "/dashboard"
              ? "text-blue-900 font-bold"
              : "text-gray-500 hover:text-blue-700"
          }`}
        >
          Recipes
        </Link>

        <Link
          to="/profile"
          className={`text-xl transition-colors ${
            currentPage === "/profile"
              ? "text-blue-900 font-bold"
              : "text-gray-500 hover:text-blue-700"
          }`}
        >
          Profile
        </Link>

        {token ? (
          <>
            {/* Logout Button */}
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation
                handleLogout(); // Call logout function
              }}
              className={`text-xl transition-colors ${
                currentPage === "/logout"
                  ? "text-blue-900 font-bold"
                  : "text-gray-500 hover:text-blue-700"
              }`}
            >
              Logout
            </Link>

            {/* User Profile Link (Showing Username) */}
            <Link
              to="/profile"
              className={`text-xl transition-colors ${
                currentPage === "/profile"
                  ? "text-blue-900 font-bold"
                  : "text-gray-500 hover:text-blue-700"
              }`}
            >
              <span className="!text-green-600 font-semibold">{username}</span>
            </Link>
          </>
        ) : (
          /* Show Login Link if No Token */
          <Link
            to="/login"
            className={`text-xl transition-colors ${
              currentPage === "/login"
                ? "text-blue-900 font-bold"
                : "text-gray-500 hover:text-blue-700"
            }`}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
