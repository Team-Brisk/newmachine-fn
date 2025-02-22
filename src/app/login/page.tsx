"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Container, TextField, Typography, Paper, CircularProgress } from "@mui/material";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ ถ้ามี Token และ User → Redirect ไปหน้า "/machine"
  useEffect(() => {
    const token = localStorage.getItem("token-nemachine");
    const user = localStorage.getItem("user-nemachine");

    if (token && user) {
      router.push("/machine");
    }
  }, [router]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://159.65.216.202:9999/auth/login", {
        username,
        password,
      });

      // ✅ บันทึก Token & User
      localStorage.setItem("user-nemachine", JSON.stringify(response.data.user));
      localStorage.setItem("token-nemachine", response.data.token);

      // ✅ แจ้งให้เมนู UI ใน `DrawerLayout.tsx` อัปเดต
      window.dispatchEvent(new Event("storage"));

      // ✅ Redirect ไป "/machine"
      router.push("/machine");
    } catch (error: any) {
      console.error("Login failed:", error);
      setError("⚠️ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#fff",
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ padding: "2rem", borderRadius: "8px", textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "1rem" }}>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!error}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
            />

            {error && (
              <Typography color="error" sx={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                marginTop: "1rem",
                fontWeight: "bold",
                backgroundColor: "black",
                color: "white",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Log in"}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
