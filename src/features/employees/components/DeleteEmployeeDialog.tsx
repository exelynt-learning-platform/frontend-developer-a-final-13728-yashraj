import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { Employee } from "../types/employee.types";

export function DeleteEmployeeDialog({
  employee,
  isDeleting,
  onCancel,
  onConfirm,
}: {
  employee: Employee | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={!!employee}
      onClose={isDeleting ? undefined : onCancel}
      aria-labelledby="delete-title"
    >
      <DialogTitle id="delete-title">Delete Employee?</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete {employee?.name}?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
