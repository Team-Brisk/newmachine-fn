"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Divider,
    Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EngineeringIcon from "@mui/icons-material/Engineering";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";

const defaultMenu = [{ text: "Dashboard", icon: <HomeIcon />, path: "/" }];

const authMenu = [
    { text: "Job Pallet", icon: <EngineeringIcon />, path: "/workByPallet" },
    { text: "PM Check List", icon: <ListAltIcon />, path: "/pm" },
    { text: "Machine", icon: <EngineeringIcon />, path: "/machine" },
];

export default function DrawerLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const checkAuth = () => {
        const token = localStorage.getItem("token-nemachine");
        const user = localStorage.getItem("user-nemachine");
        setIsAuthenticated(!!token && !!user);
    };

    useEffect(() => {
        checkAuth();
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        window.dispatchEvent(new Event("storage"));
        router.push("/login");
    };

    return (
        <Box sx={{ display: "flex", backgroundColor: "white", minHeight: "100vh" }}>
            <AppBar
                position="fixed"
                sx={{
                    background: "linear-gradient(236deg, #262626 11%, #4d4d4d 53%, #212121 93%)",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                }}
            >
                <Toolbar>
                    <IconButton sx={{ color: "white" }} edge="start" onClick={() => setOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "#f5f5f5" }}>
                        MACHINE BRISK
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={open}
                onClose={() => setOpen(false)}
                sx={{ "& .MuiDrawer-paper": { width: 260, backgroundColor: "#1f1f1f", color: "white" } }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px" }}>
                    <Typography variant="h6">เมนู</Typography>
                    <IconButton sx={{ color: "white" }} onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ backgroundColor: "#444" }} />
                <List>
                    {defaultMenu.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton onClick={() => { router.push(item.path); setOpen(false); }}>
                                <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    {!isAuthenticated && (
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => { router.push("/login"); setOpen(false); }}>
                                <ListItemIcon sx={{ color: "white" }}><LoginIcon /></ListItemIcon>
                                <ListItemText primary="Login" />
                            </ListItemButton>
                        </ListItem>
                    )}
                    {isAuthenticated &&
                        authMenu.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton onClick={() => { router.push(item.path); setOpen(false); }}>
                                    <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                </List>
                <Divider sx={{ backgroundColor: "#444" }} />
                {isAuthenticated && (
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout} sx={{ backgroundColor: "#d32f2f", color: "white", "&:hover": { backgroundColor: "#b71c1c" } }}>
                                <ListItemIcon sx={{ color: "white" }}><LogoutIcon /></ListItemIcon>
                                <ListItemText primary="ออกจากระบบ" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                )}
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, padding: "20px", color: "white" }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}