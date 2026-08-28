import { Alert, Button, CircularProgress, Stack, Typography } from '@mui/material'

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return <Stack alignItems="center" direction="row" gap={1} role="status" sx={{ py: 4, justifyContent: 'center' }}><CircularProgress size={22} /><Typography>{label}</Typography></Stack>
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <Alert severity="error" action={onRetry ? <Button color="inherit" onClick={onRetry}>Retry</Button> : undefined}>{message}</Alert>
}
