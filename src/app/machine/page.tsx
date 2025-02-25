"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export default function Machine() {
  const router = useRouter();
  const [site, setSite] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token-nemachine");
    const user = localStorage.getItem("user-nemachine");
    if (!token || !user) {
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);

  const handleChange = (event: any) => {
    setSite(event.target.value);
  };

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "1200px",
        width: "90%",
        margin: "0 auto",
        gap: "30px",
        padding: "30px 0",
        textAlign: "center",
      }}
    >
      {/* Header */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          letterSpacing: "2px",
          color: "#222",
          textTransform: "uppercase",
        }}
      >
        MACHINE SELECTION
      </motion.h1>

      {/* Select Site */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <FormControl sx={{ width: "400px", margin: "0 auto" }}>
          <InputLabel id="site-select-label">เลือกไซต์งาน</InputLabel>
          <Select
            labelId="site-select-label"
            id="site-select"
            value={site}
            onChange={handleChange}
            sx={{
              background: "rgba(255, 255, 255, 0.7)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
              fontWeight: "bold",
            }}
          >
            <MenuItem value="1">E-SMART</MenuItem>
            <MenuItem value="2">AAI</MenuItem>
          </Select>
        </FormControl>
      </motion.div>

      {/* Machines Section with Motion */}
      <AnimatePresence mode="wait">
        {Number(site) === 1 && (
          <motion.div
            key="esmart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "40px",
              marginTop: "20px",
            }}
          >
            {[ 
              { title: "SHU (Shuttle Car)", path: "/machine/esmart/shu", color: "#ff9e42" },
              { title: "SRM (Crane)", path: "/machine/esmart/srm", color: "#5c5c5e" },
            ].map((machine, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.08, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  onClick={() => handleCardClick(machine.path)}
                  sx={{
                    background: "rgba(255, 255, 255, 0.8)",
                    color: "#333",
                    borderRadius: "16px",
                    width: "280px",
                    height: "120px",
                    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                    letterSpacing: "1px",
                    transition: "all 0.3s ease",
                    backdropFilter: "blur(8px)",
                    "&:hover": {
                      backgroundColor: machine.color,
                      color: "white",
                    },
                  }}
                >
                  {machine.title}
                </Paper>
              </motion.div>
            ))}
          </motion.div>
        )}

        {Number(site) === 2 && (
          <motion.div
            key="aai"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: "1.5rem",
              color: "#333",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            AAI
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
