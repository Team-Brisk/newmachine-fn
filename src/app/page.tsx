"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import Rotate from "./components/CycleOption";
import ScrollTriggered from "./components/ScrollTriggered";
import './styles/dashboard.css'
import PathDrawing from "./components/PathDrawing";
export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token-nemachine");
    const userData = localStorage.getItem("user-nemachine");

    if (!token || !userData) {
      localStorage.clear();
      router.push("/login");
    } else {
      setUser(JSON.parse(userData));
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundImage: `
          radial-gradient(circle, rgb(255 138 4 / 18%) 2px, transparent 2px), radial-gradient(circle, rgb(255 255 255 / 20%) 3px, transparent 3px)
          `,
          backgroundSize: "40px 40px", // ขนาดจุด
          backgroundPosition: "0 0, 20px 20px", // ตำแหน่งของจุด
          perspective: "1000px", // ให้ดูมีมิต
        }}>

        


        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100vh",
            padding: "40px 20px",

          }}
        >
          {/* Title Section */}
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              textAlign: "center",
              marginBottom: "30px",
              padding: "20px",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",


            }}
          >

            <Typography
              variant="h3"
              sx={{
                marginTop: "100px",
                fontFamily: "TT Hoves Regular",
                fontSize: "10rem",
                fontWeight: "bold",
                letterSpacing: "6rem", // เพิ่มระยะห่างระหว่างตัวอักษร
                background: "linear-gradient(90deg, #f54242, #e9b000)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0px 0px 10px rgb(255 137 0 / 60%)",
              }}
            >
              ZXXBRISK
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "#666666",
                marginTop: "10px",
                fontFamily: "TT Hoves Regular",
                fontSize: "2.25rem"
              }}
            >
              สวัสดี, {user?.name || "Guest"}
            </Typography>

          </motion.div>


          {/* Dashboard Cards */}

          <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "150px"
          }}>
            <Rotate />
          </Box>
          <ScrollTriggered />
        </Box>

      </Box>
    </>
  );
}
