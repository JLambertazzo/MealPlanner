import React, { useState, useEffect } from "react";
import {
  Button,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  Typography,
  ButtonGroup,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  Person,
  ExitToApp,
  PersonAdd,
  CalendarToday,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import { getUserById } from "../../actions/actions";
import "./NavBar.css";
import { useNavigate, Link } from "react-router-dom";
import { Box } from "@mui/system";

export default function NavBar(props: { uid: string }) {
  const [uid, setUid] = useState<string | null>(null);
  useEffect(() => {
    setUid(props.uid);
    getName(props.uid).then((res) => setUsername(res));
  }, [props.uid]);
  const [userAnchorEl, setUserAnchorEl] = useState<Element | null>(null);
  const [authAnchorEl, setAuthAnchorEl] = useState<Element | null>(null);
  const [username, setUsername] = useState("Profile");

  const navigate = useNavigate();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  const getRightSide = () => {
    if (!uid) {
      return (
        <div id="authButtons">
          <Box sx={{ display: isMediumScreen ? "flex" : "none" }}>
            <ButtonGroup className="authButtons">
              <Button variant="contained" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
              <Button variant="contained" onClick={() => navigate("/login")}>
                Log In
              </Button>
            </ButtonGroup>
          </Box>
          <Box sx={{ display: isMediumScreen ? "none" : "flex" }}>
            <IconButton
              edge="end"
              aria-label="Navigation Menu"
              aria-controls="auth-menu"
              aria-haspopup="true"
              color="inherit"
              onClick={(event) => setAuthAnchorEl(event.target as Element)}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="auth-menu"
              anchorEl={authAnchorEl}
              keepMounted
              open={Boolean(authAnchorEl)}
              onClose={() => setAuthAnchorEl(null)}
            >
              <MenuItem>
                <Link to="/login" className="iconTextMix">
                  <Person />
                  Log In
                </Link>
              </MenuItem>
              <MenuItem>
                <Link to="/signup" className="iconTextMix">
                  <PersonAdd />
                  Sign Up
                </Link>
              </MenuItem>
            </Menu>
          </Box>
        </div>
      );
    } else {
      return (
        <div style={{ marginLeft: "auto" }}>
          <Button
            id="menuAnchor"
            variant="contained"
            color="secondary"
            aria-controls="user-menu"
            aria-haspopup="true"
            startIcon={<Person />}
            onClick={(event) => setUserAnchorEl(event.target as Element)}
          >
            {username}
          </Button>
          <Menu
            id="user-menu"
            anchorEl={userAnchorEl}
            keepMounted
            open={Boolean(userAnchorEl)}
            onClose={() => setUserAnchorEl(null)}
          >
            <MenuItem>
              <Link to="/profile" className="iconTextMix">
                <Person />
                My Profile
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/calendar" className="iconTextMix">
                <CalendarToday />
                My Calendar
              </Link>
            </MenuItem>
            <MenuItem>
              <a href="/logout" className="iconTextMix">
                <ExitToApp />
                Log Out
              </a>
            </MenuItem>
          </Menu>
        </div>
      );
    }
  };

  return (
    <AppBar className="navBar" position="static">
      <Toolbar className="nav-wrapper">
        <Link to="/" id="logo" className="brand-logo">
          <Typography variant="h1">MealPlanner</Typography>
        </Link>
        {getRightSide()}
      </Toolbar>
    </AppBar>
  );
}

const getName = (uid: string) => {
  if (!uid) {
    return Promise.resolve("Profile");
  }
  return getUserById(uid).then((res) => {
    if (res) {
      return res.username;
    } else {
      return "Profile";
    }
  });
};
