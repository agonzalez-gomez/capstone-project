import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

type TicketDialogProps = {
  open: boolean;
  articleTitle: string;
  page: number;
  error: string | null;
  onClose: () => void;
  onSubmit: (description: string) => Promise<void>;
};

export default function TicketDialog({
  open,
  articleTitle,
  page,
  error,
  onClose,
  onSubmit,
}: TicketDialogProps) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!description.trim() || loading) return;

    setLoading(true);
    await onSubmit(description);
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Submit a Support Ticket</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: 1,
          }}
        >
          <Typography color="text.secondary">
            Sorry this guide didn't fix your issue. Describe what's happening
            and our support team will follow up. We'll include that you were on{" "}
            <strong>{articleTitle}</strong>, page {page}.
          </Typography>

          <TextField
            label="Describe the issue"
            multiline
            minRows={4}
            required
            value={description}
            disabled={loading}
            slotProps={{ htmlInput: { maxLength: 2000 } }}
            helperText={`${description.length}/2000`}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />

          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!description.trim() || loading}
          onClick={() => submit()}
        >
          Submit Ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
}
