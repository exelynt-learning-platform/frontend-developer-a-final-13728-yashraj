import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#0b7285", contrastText: "#ffffff" },
    secondary: { main: "#334155" },
    error: { main: "#c2413b" },
    background: { default: "#f5f7f9", paper: "#ffffff" },
    text: { primary: "#17212b", secondary: "#5f6b76" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.03em" },
    h2: { fontWeight: 700, letterSpacing: "-0.025em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 650, textTransform: "none" },
    overline: { fontWeight: 700, letterSpacing: "0.09em" },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0 1px 0 rgba(23, 33, 43, 0.08)",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, minHeight: 40, paddingInline: 16 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
    },
    MuiSelect: {
      defaultProps: { size: "small" },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { color: "#5f6b76", fontWeight: 700, backgroundColor: "#f8fafb" },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 14, margin: 16 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});
