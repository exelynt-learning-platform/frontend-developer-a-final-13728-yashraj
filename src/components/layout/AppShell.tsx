import { useState, type ReactNode } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
  onAddEmployee: () => void;
}

export function AppShell({ children, onAddEmployee }: AppShellProps) {
  const theme = useTheme();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const handleMenuClick = () =>
    isMobileOrTablet
      ? setMobileOpen((open) => !open)
      : setDesktopCollapsed((collapsed) => !collapsed);
  const handleAddEmployee = () => {
    onAddEmployee();
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (currentTheme) => currentTheme.zIndex.drawer + 1,
          ml: { md: desktopCollapsed ? "76px" : "248px" },
          width: {
            xs: "100%",
            md: desktopCollapsed ? "calc(100% - 76px)" : "calc(100% - 248px)",
          },
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: "0 1px 0 rgba(15, 23, 42, 0.08)",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 72 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleMenuClick}
            aria-label={
              isMobileOrTablet
                ? "Open navigation menu"
                : "Toggle navigation sidebar"
            }
            sx={{ mr: 2 }}
          >
            <Typography
              component="span"
              aria-hidden
              sx={{ fontSize: 24, lineHeight: 1 }}
            >
              ☰
            </Typography>
          </IconButton>
          <Typography variant="h6" component="h1" fontWeight={700}>
            {/* Employee Management */}
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar
        mobileOpen={mobileOpen}
        collapsed={desktopCollapsed}
        isMobileOrTablet={isMobileOrTablet}
        onClose={() => setMobileOpen(false)}
        onAddEmployee={handleAddEmployee}
      />
      <Box
        component="main"
        sx={{ flexGrow: 1, minWidth: 0, pt: { xs: 8, sm: 9 } }}
      >
        {children}
      </Box>
    </Box>
  );
}
