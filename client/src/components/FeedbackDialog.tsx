import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { Feedback } from "../types";

type FeedbackDialogProps = {
  open: boolean;
  title: string;
  error: string | null;
  onClose: () => void;
  onSubmit: (feedback: Feedback) => Promise<void>;
};

export default function FeedbackDialog({
  open,
  title,
  error,
  onClose,
  onSubmit,
}: FeedbackDialogProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!rating || loading) return;

    setLoading(true);
    await onSubmit({ rating, comments });
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography>How helpful was this guide?</Typography>
            <Rating value={rating} onChange={(_, val) => setRating(val)} />
          </Box>

          <TextField
            label="Comments (optional)"
            multiline
            minRows={3}
            value={comments}
            disabled={loading}
            slotProps={{ htmlInput: { maxLength: 1000 } }}
            helperText={`${comments.length}/1000`}
            onChange={(e) => {
              setComments(e.target.value);
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
          disabled={!rating || loading}
          onClick={() => submit()}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
