import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { checkLoggedIn } = useAuth();

  const login = async () => {
    if (loading) return false;

    setLoading(true);
    try {
      const res = await API.login(email, password);

      if (res) {
        console.log("Logged in!");
        await checkLoggedIn();
        navigate("/");
      } else {
        setError("Error logging in - check your username and password!");
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError("Error logging in - check your username and password!");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography variant="h4">Login</Typography>

      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          width: "20rem",
          maxWidth: "25rem",
        }}
      >
        <TextField
          label="Email Address"
          type="email"
          disabled={loading}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextField
          label="Password please"
          type="password"
          disabled={!email || !email.includes("@") || loading}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
          }}
        >
          <Button fullWidth onClick={() => navigate("/signup")}>
            Sign Up
          </Button>

          <Button
            fullWidth
            variant="contained"
            disabled={
              loading ||
              !password ||
              password.length < 6 ||
              password.length > 20 ||
              !email ||
              !email.includes("@")
            }
            onClick={() => login()}
          >
            Login
          </Button>
        </Box>

        <Typography color="error">{error}</Typography>
      </Box>
    </Box>
  );
}
