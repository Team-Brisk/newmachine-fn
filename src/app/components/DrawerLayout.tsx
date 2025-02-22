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

    // ✅ ตรวจสอบ token/user ใหม่ทุกครั้งที่ router เปลี่ยนแปลง & localStorage เปลี่ยน
    useEffect(() => {
        checkAuth();
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, [router]);

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        window.dispatchEvent(new Event("storage")); // ✅ แจ้งให้ Component อื่นรู้ว่ามีการเปลี่ยนแปลง
        router.push("/login");
    };

    return (
        <Box sx={{ display: "flex" }}>
            {/* AppBar ด้านบน */}
            <AppBar
                position="fixed"
                sx={{
                    background: "linear-gradient(135deg, #ff7000, #ff9900)",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Toolbar>
                    <IconButton
                        sx={{ boxShadow: "none", width: "40px" }}
                        edge="start"
                        color="inherit"
                        onClick={() => setOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                        MACHINE BRISK
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Drawer Sidebar */}
            <Drawer
                anchor="left"
                open={open}
                onClose={() => setOpen(false)}
                sx={{ "& .MuiDrawer-paper": { width: 240 } }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 16px",
                        backgroundColor: "#ff7000",
                        color: "white",
                    }}
                >
                    <Typography variant="h6">เมนู</Typography>
                    <IconButton sx={{ boxShadow: "none", width: "40px" }} onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <List>
                    {/* ✅ แสดง Dashboard */}
                    {defaultMenu.map((item, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    router.push(item.path);
                                    setOpen(false);
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}

                    {/* ✅ แสดงปุ่ม Login เฉพาะตอนที่ยังไม่ได้เข้าสู่ระบบ */}
                    {!isAuthenticated && (
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    router.push("/login");
                                    setOpen(false);
                                }}
                            >
                                <ListItemIcon>
                                    <LoginIcon />
                                </ListItemIcon>
                                <ListItemText primary="Login" />
                            </ListItemButton>
                        </ListItem>
                    )}

                    {/* ✅ ถ้าล็อกอินแล้ว แสดงเมนูเพิ่ม */}
                    {isAuthenticated &&
                        authMenu.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        router.push(item.path);
                                        setOpen(false);
                                    }}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                </List>

                <Divider />

                {/* ✅ แสดงปุ่ม Log Out ถ้าล็อกอินแล้ว */}
                {isAuthenticated && (
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleLogout}
                                sx={{
                                    backgroundColor: "#d32f2f",
                                    color: "white",
                                    "&:hover": { backgroundColor: "#b71c1c" },
                                }}
                            >
                                <ListItemIcon>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary="ออกจากระบบ" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                )}
            </Drawer>

            {/* เนื้อหาหน้าเว็บ */}
            <Box component="main" sx={{ flexGrow: 1, padding: "20px" }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}
