import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

type FinishDialogProps = {
  open: boolean;
  onClose: () => void;
  onResolved: () => void;
  onUnresolved: () => void;
};

export default function FinishDialog({
  open,
  onClose,
  onResolved,
  onUnresolved,
}: FinishDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>You've reached the end of this guide</DialogTitle>
      <DialogContent>
        <Typography>Did this guide fix your issue?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onUnresolved}>No, submit a ticket</Button>
        <Button variant="contained" color="success" onClick={onResolved}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
