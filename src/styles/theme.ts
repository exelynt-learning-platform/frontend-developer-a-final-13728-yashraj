import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: { main: '#0b7285' },
    background: { default: '#f5f7f9' },
  },
  shape: { borderRadius: 12 },
  typography: { fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
})
