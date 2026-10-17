import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import { Box } from "@mui/material";

export default function Layout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 4,
        mt: 4,
      }}
    >
      <Navigation />
      <main>
        <Outlet />
      </main>
    </Box>
  );
}
