import "./App.css";
import { checkLoggedIn } from "./actions/actions";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./themes/default";
import React, { useState, useEffect } from "react";
import HomePage from "./pages/home/HomePage";
import Calendar from "./pages/calendar/CalendarView";
import AuthForm from "./pages/auth/AuthForm";
import Profile from "./pages/profile/Profile";

export default function App() {
  const [uid, setUid] = useState("");
  useEffect(() => {
    checkLoggedIn(setUid);
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage uid={uid} />} />
          <Route path="/calendar" element={<Calendar uid={uid} />} />
          <Route
            path="/login"
            element={<AuthForm uid={uid} setUid={setUid} showLogin />}
          />
          <Route
            path="/signup"
            element={<AuthForm uid={uid} setUid={setUid} showLogin={false} />}
          />
          <Route path="/profile" element={<Profile uid={uid} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
