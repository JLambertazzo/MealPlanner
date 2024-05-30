import React, { FormEvent, useEffect, useState } from "react";
import NavBar from "../../components/general/NavBar";
import { login, createUser } from "../../actions/actions";
import { Button, TextField, FormControl, Typography } from "@mui/material";
import { Person, PersonAdd } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import "./AuthForm.css";
import { User } from "../../types/dbtypes";

interface Props {
  uid: string;
  setUid: (uid: string) => void;
  showLogin: boolean;
}

export default function AuthForm(props: Props) {
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [showLogin, setShowLogin] = useState(props.showLogin);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setShowLogin(location.pathname.includes("login"));
  }, [location]);

  const loginSuccess = (res?: User) => {
    if (res && res._id) {
      props.setUid(res._id);
      navigate("/calendar");
    }
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      username: username,
      password: pass,
    };
    try {
      const res = await login(payload);
      return res;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    if (pass !== confPass) {
      return;
    }
    const payload = {
      username: username,
      password: pass,
    };
    try {
      await createUser(payload);
      const res = await login(payload);
      console.log("sing+log res is", res);
      return res;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };

  const getConfPassField = () => {
    if (!showLogin) {
      return (
        <FormControl className="input-field">
          <TextField
            label="Confirm Password"
            type="password"
            onChange={(event) => setConfPass(event.target.value)}
            inputProps={{ minLength: 8 }}
            required
            id="confpass-input"
            // @ts-ignore
            InputLabelProps={{ for: "confpass-input" }}
          />
        </FormControl>
      );
    }
  };

  return (
    <div id="authForm">
      <NavBar uid={props.uid} />
      <form
        className="container"
        onSubmit={
          showLogin
            ? (event) => handleLogin(event).then(loginSuccess)
            : (event) => handleSignup(event).then(loginSuccess)
        }
      >
        <Typography variant="h2">
          {showLogin ? <Person /> : <PersonAdd />}{" "}
          {showLogin ? "Log In" : "Sign Up"}
        </Typography>
        <FormControl className="input-field">
          <TextField
            label="Username"
            id="username-input"
            // @ts-ignore
            InputLabelProps={{ for: "username-input" }}
            onChange={(event) => setUsername(event.target.value)}
            inputProps={{ minLength: 5 }}
            required
          />
        </FormControl>
        <FormControl className="input-field">
          <TextField
            label="Password"
            id="pass-input"
            // @ts-ignore
            InputLabelProps={{ for: "pass-input" }}
            type="password"
            onChange={(event) => setPass(event.target.value)}
            inputProps={{ minLength: 8 }}
            required
          />
        </FormControl>
        {getConfPassField()}
        <FormControl className="input-field">
          <Button type="submit" variant="contained">
            {showLogin ? "Log In" : "Sign Up"}
          </Button>
        </FormControl>
      </form>
    </div>
  );
}
