"use client";
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Home,
  SportsEsports,
  Login,
  Logout,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

const theme = createTheme({
  palette: {
    primary: {
      main: "#333333",
    },
    secondary: {
      main: "#9e9e9e",
    },
    background: {
      default: "#f5f5f5",
    },
    text: {
      primary: "#ffffff",
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
    h6: {
      fontWeight: 700,
      color: "#ffffff",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#555555",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          backgroundColor: "#333333",
        },
      },
    },
  },
});

const Header = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    handleClose();
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUserId(null);
      router.push("/login");
    });
    handleClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}
          >
            <SportsEsports sx={{ mr: 1 }} />
            TOYPE
          </Typography>
          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleNavigation("/")}>
                  <Home sx={{ mr: 1 }} /> Home
                </MenuItem>
                {userId && (
                  <MenuItem
                    onClick={() => handleNavigation(`/mypage/${userId}`)}
                  >
                    <AccountCircle sx={{ mr: 1 }} /> Mypage
                  </MenuItem>
                )}
                <MenuItem onClick={() => handleNavigation("/level")}>
                  <SportsEsports sx={{ mr: 1 }} /> Game
                </MenuItem>
                {userId ? (
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                ) : (
                  <MenuItem onClick={() => handleNavigation("/login")}>
                    <Login sx={{ mr: 1 }} /> Login
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                color="inherit"
                startIcon={<Home />}
                onClick={() => handleNavigation("/")}
              >
                Home
              </Button>
              {userId && (
                <Button
                  color="inherit"
                  startIcon={<AccountCircle />}
                  onClick={() => handleNavigation(`/mypage/${userId}`)}
                >
                  Mypage
                </Button>
              )}
              <Button
                color="inherit"
                startIcon={<SportsEsports />}
                onClick={() => handleNavigation("/level")}
              >
                Game
              </Button>
              {userId ? (
                <Button
                  color="inherit"
                  startIcon={<Logout />}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  color="inherit"
                  startIcon={<Login />}
                  onClick={() => handleNavigation("/login")}
                >
                  Login
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
