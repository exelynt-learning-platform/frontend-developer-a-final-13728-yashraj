import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

const drawerWidth = 248;
const collapsedDrawerWidth = 76;
interface SidebarProps {
  mobileOpen: boolean;
  collapsed: boolean;
  isMobileOrTablet: boolean;
  onClose: () => void;
  onAddEmployee: () => void;
}

export function Sidebar({
  mobileOpen,
  collapsed,
  isMobileOrTablet,
  onClose,
  onAddEmployee,
}: SidebarProps) {
  const width = collapsed ? collapsedDrawerWidth : drawerWidth;
  const content = (
    <Stack sx={{ height: "100%", bgcolor: "#15263d", color: "#f8fafc" }}>
      <Box
        sx={{
          px: collapsed ? 1.5 : 3,
          py: 3,
          minHeight: 88,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography aria-hidden sx={{ fontSize: 28, mr: collapsed ? 0 : 1.5 }}>
          👥
        </Typography>
        {!collapsed && (
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.15}>
            Employee
            <br />
            Management
          </Typography>
        )}
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <List sx={{ px: 1.5, py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected
            onClick={onClose}
            sx={{
              minHeight: 44,
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 1.5,
              color: "inherit",
              "&.Mui-selected": { bgcolor: "#1769e0", color: "#fff" },
              "&.Mui-selected:hover": { bgcolor: "#125dcc" },
            }}
          >
            <Typography
              aria-hidden
              sx={{ fontSize: 18, mr: collapsed ? 0 : 1.5 }}
            >
              ♟
            </Typography>
            {!collapsed && (
              <ListItemText
                primary="Employees"
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            )}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mt: 1 }}>
          <ListItemButton
            onClick={onAddEmployee}
            sx={{
              minHeight: 44,
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 1.5,
              color: "inherit",
            }}
          >
            <Typography
              aria-hidden
              sx={{ fontSize: 18, mr: collapsed ? 0 : 1.5 }}
            >
              ＋
            </Typography>
            {!collapsed && <ListItemText primary="Add Employee" />}
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ mt: "auto", p: 2 }}>
        {!collapsed && (
          <Button
            fullWidth
            variant="outlined"
            sx={{
              justifyContent: "flex-start",
              color: "inherit",
              borderColor: "rgba(255,255,255,0.16)",
              mb: 2,
            }}
            aria-label="Current theme: Light"
          >
            ☼&nbsp;&nbsp; Light
          </Button>
        )}
        <Typography
          variant="caption"
          color="rgba(255,255,255,0.62)"
          sx={{ display: "block", textAlign: collapsed ? "center" : "left" }}
        >
          {collapsed ? "©" : "© 2026 Your Company"}
        </Typography>
      </Box>
    </Stack>
  );
  if (isMobileOrTablet)
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}
      >
        {content}
      </Drawer>
    );
  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
          borderRight: 0,
          transition: "width 180ms ease",
          overflowX: "hidden",
        },
      }}
    >
      {content}
    </Drawer>
  );
}
