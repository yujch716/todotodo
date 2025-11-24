import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.tsx";
import SignUpPage from "@/pages/auth/SignUpPage.tsx";
import PrivateRoute from "@/pages/auth/PrivateRoute.tsx";
import DailyLogPage from "@/pages/daily-log/DailyLogPage.tsx";
import CalendarPage from "@/pages/calendar/CalendarPage.tsx";
import Layout from "@/layouts/Layout.tsx";
import AuthRedirect from "@/pages/auth/AuthRedirect.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import ChallengePage from "@/pages/challenge/ChallengePage.tsx";
import GoalDetail from "@/pages/goal/GoalDetail.tsx";
import ChallengeGroupPage from "@/pages/challenge/ChallengeGroupPage.tsx";

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
          <Route path="/daily" element={<DailyLogPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/challenge" element={<ChallengePage />} />
          <Route path="/challenge-groups" element={<ChallengeGroupPage />} />
          <Route path="/challenge-groups/:id" element={<GoalDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
