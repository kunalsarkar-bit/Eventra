import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Header";
import EventBanner from "../components/EventBanner";
import NavigationTabs from "../components/NavigationTabs";
import Footer from "../components/Footer";
import { useThemeProvider } from "../contexts/ThemeProvider";

const UserLayout = ({ showNavbarAndFooter = true }) => {
  const { currentTheme, changeCurrentTheme } = useThemeProvider();

  return (
    <div className="user-layout">
      {showNavbarAndFooter && (
        <>
          <Navbar />
          <EventBanner />
          <NavigationTabs />
        </>
      )}
      <div className="main-content">
        <main>
          <Outlet />
        </main>
      </div>
      {showNavbarAndFooter && <Footer currentTheme={currentTheme} />}
    </div>
  );
};

export default UserLayout;
