import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.tsx";
import SignUpPage from "@/pages/auth/SignUpPage.tsx";
import DailyLogPage from "@/pages/daily-log/DailyLogPage.tsx";
import CalendarPage from "@/pages/calendar/CalendarPage.tsx";
import Layout from "@/layouts/Layout.tsx";
import AuthRedirect from "@/pages/auth/AuthRedirect.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import GoalGroupPage from "@/pages/goal/GoalGroupPage.tsx";
import GoalGroupDetailPage from "@/pages/goal/GoalGroupDetailPage.tsx";
import CategoryPage from "@/pages/setting/category/CategoryPage.tsx";
import DefaultContentLayout from "@/layouts/DefaultContentLayout.tsx";
import SettingContentLayout from "@/layouts/SettingContentLayout.tsx";
import PrivateRoute from "@/pages/auth/PrivateRoute.tsx";

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
          <Route element={<DefaultContentLayout />}>
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/daily/:id" element={<DailyLogPage />} />
            <Route path="/goal-groups" element={<GoalGroupPage />} />
            <Route path="/goal-groups/:id" element={<GoalGroupDetailPage />} />
          </Route>

          <Route path="/setting" element={<SettingContentLayout />}>
            <Route path="category" element={<CategoryPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
