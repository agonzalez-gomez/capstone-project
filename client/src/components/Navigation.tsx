import { AppBar, Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const { signedIn, logout } = useAuth();

  useEffect(() => {
    if (
      signedIn &&
      (location.pathname == "/login" || location.pathname == "/signup")
    ) {
      navigate("/");
    }
  }, [signedIn, location.pathname]);

  return (
    <nav>
      <AppBar
        sx={{
          display: "flex",
          flexDirection: "row",
          p: 1,
        }}
      >
        <Typography variant="h6">Troubleshooting App</Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <Button
            variant={location.pathname == "/" ? "outlined" : "text"}
            color="inherit"
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button
            variant={location.pathname == "/about" ? "outlined" : "text"}
            color="inherit"
            onClick={() => navigate("/about")}
          >
            About
          </Button>
        </Box>

        {!signedIn && (
          <Button
            variant={location.pathname == "/login" ? "outlined" : "text"}
            color="inherit"
            onClick={() => navigate("/login")}
          >
            Log In
          </Button>
        )}

        {signedIn && (
          <Button
            color="inherit"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Log Out
          </Button>
        )}
      </AppBar>
    </nav>
  );
}
