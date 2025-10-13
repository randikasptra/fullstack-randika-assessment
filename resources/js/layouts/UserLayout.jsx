import React from "react";
import NavbarUser from "../components/user/NavbarUser";

const UserLayout = ({ children, darkMode, user }) => {
  return (
    <div className={`${darkMode ? "dark" : ""} flex min-h-screen bg-gray-50 dark:bg-gray-900`}>
      <NavbarUser darkMode={darkMode} user={user} />
      <main className="flex-1 ml-64 p-6">{children}</main>
    </div>
  );
};

export default UserLayout;
