import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import ThemeProvider, { useThemeProvider } from "./contexts/ThemeProvider";
import TicketScanner from "./Pages/TicketScanner";
import TicketSales from "./components/TicketSales";
import TicketValidation from "./components/TicketValidation";
import TicketStats from "./components/TicketStats";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import UserLayout from "./layouts/UserLayout";

import ProtectRoutes from "./components/ProtectRoutes";
import PageNotFound from "./components/PageNotFound";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useCurrentPath = () => {
  const location = useLocation();
  return location.pathname;
};

function AppContent() {
  const { currentTheme } = useThemeProvider();
  const currentPath = useLocation().pathname;

  const hiddenPaths = ["/", "/forgot-password", "/reset-password/:token"];
  const showNavbarAndFooter = !hiddenPaths.includes(currentPath);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route element={<ProtectRoutes />}>
          <Route
            element={<UserLayout showNavbarAndFooter={showNavbarAndFooter} />}
          >
            <Route path="/home" element={<TicketSales />} />
            <Route path="/validate" element={<TicketValidation />} />
            <Route path="/stats" element={<TicketStats />} />
            <Route path="/ticket" element={<TicketScanner />} />
          </Route>
        </Route>
        {/* Page Not Found route */}
        <Route path="/pagenotfound" element={<PageNotFound />} />
        {/* Fallback route for undefined paths */}
        <Route path="*" element={<Navigate to="/pagenotfound" replace />} />
      </Routes>

      {/* {showNavbarAndFooter && <Footer currentTheme={currentTheme} />} */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark" // You can use "light" or "colored" too
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
