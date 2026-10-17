import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [email2, setEmail2] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const register = async () => {
    if (loading) return false;

    setLoading(true);
    try {
      const res = await API.register(email, password);

      if (res === true) {
        console.log("Registered!");
        navigate("/login");
      } else {
        setError("Error registering! " + res);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError("Error registering!");
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
      <Typography variant="h4">Sign Up</Typography>

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
          label="Confirm Your Email Address"
          type="email"
          disabled={loading}
          onChange={(e) => {
            setEmail2(e.target.value);
          }}
          error={
            email && email2 &&
            email !== email2 ? true: false
          }
          helperText={
            email && email2 &&
            email !== email2 ? 'Emails do not match!': false
          }
        />
        <TextField
          label="Password please"
          type="password"
          disabled={!email || !email.includes("@") || loading}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <TextField
          label="Confirm Your Password"
          type="password"
          disabled={!email || !email.includes("@") || loading}
          onChange={(e) => {
            setPassword2(e.target.value);
          }}
           error={
            password && password2 &&
            password !== password2 ? true : false
          }
          helperText={
            password && password2 &&
            password !== password2 ? 'Passwords do not match!': false
          }
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
          }}
        >
          <Button fullWidth
            onClick={() => navigate('/login')}
          >Back</Button>

          <Button
            fullWidth
            variant="contained"
            disabled={
              loading ||
              !password ||
              password.length < 6 ||
              password.length > 20 ||
              !email ||
              !email.includes("@") ||
              password !== password2 || 
              email !== email2
            }
            onClick={() => register()}
          >
            Register
          </Button>
        </Box>

        <Typography color="error">{error}</Typography>
      </Box>
    </Box>
  );
}
