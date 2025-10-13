import React from "react";
import NavbarUser from "../components/user/NavbarUser";

const UserLayout = ({ children, darkMode, user }) => {
  return (
    <div
      className={`${darkMode ? "dark" : ""} min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900`}
    >
      {/* Navbar fixed di atas */}
      <NavbarUser darkMode={darkMode} user={user} />

      {/* Konten utama */}
      <main
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20"
      >
        {children}
      </main>
    </div>
  );
};

export default UserLayout;
