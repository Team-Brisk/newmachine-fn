"use client";
import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Card, CardContent, CardHeader, Typography, MenuItem, Select, InputLabel, FormControl, Box } from "@mui/material";
import { motion } from "framer-motion";

export default function Register() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [accType, setAccType] = useState("customer");
  const [site, setSite] = useState("");
  const [errText, setErrText] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch(`http://159.65.216.202:9999/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, name, site, accType, role: "user" }),
      });

      const data = await response.json();
      if (data.error) {
        setErrText(data.error);
      } else {
        alert("สมัครสมาชิกสำเร็จ");
        router.push("/login");
      }
    } catch (error: any) {
      setErrText("⚠️ เกิดข้อผิดพลาดในการสมัครสมาชิก");
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #ffffff, #e6e6e6)",
        padding: "20px",
      }}
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card
          elevation={10}
          sx={{
            minWidth: 450,
            width: "100%",
            borderRadius: "20px",
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardHeader
            title={
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                สมัครสมาชิก
              </Typography>
            }
          />
          <CardContent>
            {errText && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {errText}
              </Typography>
            )}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <TextField
                label="ชื่อผู้ใช้"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <TextField
                label="ชื่อจริง"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <TextField
                label="รหัสผ่าน"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                  },
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <FormControl fullWidth>
                <InputLabel shrink>ประเภทบัญชี</InputLabel>
                <Select
                  value={accType}
                  onChange={(e) => setAccType(e.target.value)}
                  sx={{
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "black" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "black" },
                  }}
                >
                  <MenuItem value="0">AMW</MenuItem>
                  <MenuItem value="1">Customer</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel shrink>ไซต์ (Site)</InputLabel>
                <Select
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  sx={{
                    borderRadius: "10px",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "black" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "black" },
                  }}
                >
                  <MenuItem value="E-SMART">E-SMART</MenuItem>
                  <MenuItem value="AAI">AAI</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "10px",
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                  "&:hover": {
                    backgroundColor: "#333",
                    transform: "scale(1.05)",
                    transition: "all 0.3s ease-in-out",
                  },
                }}
              >
                สมัครสมาชิก
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
