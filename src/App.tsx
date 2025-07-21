import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.tsx";
import SignUpPage from "@/pages/auth/SignUpPage.tsx";
import PrivateRoute from "@/pages/auth/PrivateRoute.tsx";
import DailyLog from "@/pages/daily-log/DailyLog.tsx";
import Calendar from "@/pages/calendar/Calendar.tsx";
import Layout from "@/layouts/Layout.tsx";
import AuthRedirect from "@/pages/auth/AuthRedirect.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

function App() {
  return (
    <BrowserRouter>
      <Toaster />

      <Routes>
        <Route path="/" element={<AuthRedirect />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/daily" element={<DailyLog />} />
          <Route path="/calendar" element={<Calendar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
