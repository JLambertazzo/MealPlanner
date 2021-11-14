import "./App.css";
import { checkLoggedIn } from "./actions/actions";
import { BrowserRouter, Switch, Route } from "react-router-dom";
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
        <Switch>
          <Route exact path="/" render={() => <HomePage uid={uid} />} />
          <Route exact path="/calendar" render={() => <Calendar uid={uid} />} />
          <Route
            exact
            path="/login"
            render={(props) => <AuthForm {...props} uid={uid} setUid={setUid} showLogin />}
          />
          <Route
            exact
            path="/signup"
            render={(props) => (
              <AuthForm {...props} uid={uid} setUid={setUid} showLogin={false} />
            )}
          />
          <Route exact path="/profile" render={() => <Profile uid={uid} />} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}
