import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.tsx";
import SignUpPage from "@/pages/auth/SignUpPage.tsx";
import PrivateRoute from "@/pages/auth/PrivateRoute.tsx";
import Checklist from "@/pages/checklist/Checklist.tsx";
import ChecklistCalendar from "@/pages/calendar/Calendar.tsx";
import Layout from "@/layouts/Layout.tsx";
import AuthRedirect from "@/pages/auth/AuthRedirect.tsx";

function App() {
  return (
    <BrowserRouter>
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
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/calendar" element={<ChecklistCalendar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
