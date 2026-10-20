import { useEffect, useState } from "react";
import type { Ticket } from "../types";
import API from "../services/api";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Link,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signedIn } = useAuth();

  useEffect(() => {
    if (signedIn) listTickets();
  }, [signedIn]);

  const listTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await API.listTickets();

      if (list) {
        setTickets(list);
        setLoading(false);
      } else {
        setError("Error loading tickets!");
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError("Error loading tickets!");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size="10rem" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "768px",
        mx: "auto",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Typography variant="h4">My Tickets</Typography>
        <Typography color="text.secondary">
          Support tickets you've submitted when a guide didn't fix your issue.
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => listTickets()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!error && tickets.length === 0 && (
        <Card elevation={4}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              textAlign: "center",
            }}
          >
            <Typography>You haven't submitted any tickets.</Typography>
            <Button variant="contained" onClick={() => navigate("/")}>
              Browse Articles
            </Button>
          </CardContent>
        </Card>
      )}

      {tickets.map((ticket) => {
        return (
          <Card key={ticket._id} elevation={4}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography variant="h6">
                  Ticket #{ticket._id.slice(-6).toUpperCase()}
                </Typography>
                <Chip
                  size="small"
                  label={ticket.status === "open" ? "Open" : "Closed"}
                  color={ticket.status === "open" ? "warning" : "default"}
                />
              </Box>

              <Typography variant="body2" color="text.secondary">
                Submitted {new Date(ticket.createdAt).toLocaleString()}
              </Typography>

              <Typography variant="body2">
                <Link
                  component="button"
                  onClick={() => navigate("/articles/" + ticket.slug)}
                >
                  {ticket.articleTitle}
                </Link>
                , page {ticket.page}
              </Typography>

              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {ticket.description}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
