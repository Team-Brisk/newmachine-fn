"use client";
import { useState } from "react";
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
    Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EngineeringIcon from "@mui/icons-material/Engineering";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./DrawerLayout.module.scss";

const menuItems = [
    { text: "หน้าแรก", icon: <HomeIcon />, path: "/" },
    { text: "Job Pallet", icon: <EngineeringIcon />, path: "/workByPallet" },
    { text: "PM Check List", icon: <ListAltIcon />, path: "/pm" },
    { text: "Machine", icon: <EngineeringIcon />, path: "/machine" },
];

export default function DrawerLayout({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.clear(); // ✅ เคลียร์ข้อมูลทั้งหมดใน localStorage
        router.push("/login"); // ✅ นำทางไปที่หน้า Login
    };

    return (
        <div className={styles.container}>
            {/* AppBar ด้านบน */}
            <AppBar position="fixed" className={styles.appBar}>
                <Toolbar>
                    <IconButton sx={{ boxShadow:"none", width:"40px" }} edge="start" color="inherit" onClick={() => setOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={styles.title}>
                        MACHINE BRISK
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Drawer Sidebar */}
            <Drawer anchor="left" open={open} onClose={() => setOpen(false)} className={styles.drawer}>
                <div className={styles.drawerHeader}>
                    <Typography variant="h6">เมนู</Typography>
                    <IconButton  sx={{ boxShadow:"none", width:"40px" }} onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <List>
                    {menuItems.map((item, index) => (
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

                {/* ปุ่ม Log Out */}
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout} className={styles.logoutButton}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="ออกจากระบบ" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>

            {/* เนื้อหาหน้าเว็บ */}
            <main className={styles.content}>
                <Toolbar />
                {children}
            </main>
        </div>
    );
}
