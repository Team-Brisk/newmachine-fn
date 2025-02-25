"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Container, TextField, Typography, Paper, CircularProgress, Snackbar, Alert } from "@mui/material";
import { motion } from "framer-motion";

const GearAnimation = ({ size = 100 }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 579.16 579.16"
      xmlns="http://www.w3.org/2000/svg"
      fill="#d7d7d7"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
    >
      <g>
        <path d="M569.979,353.841h9.181v-9.18v-107.1v-9.18h-9.181H497.1c-4.287-14.669-10.128-28.859-17.433-42.338l51.46-51.46
            l6.49-6.49l-6.49-6.49l-75.731-75.732l-6.49-6.494l-6.491,6.494l-51.649,51.649c-12.781-6.848-26.182-12.399-39.985-16.561V9.182
            v-9.18h-9.18H234.5h-9.18v9.18v71.781c-13.109,3.954-25.839,9.146-37.993,15.49l-50.582-50.582l-6.49-6.494l-6.49,6.494
            L48.033,121.6l-6.49,6.49l6.49,6.491l49.483,49.483c-7.316,13.155-13.225,26.98-17.631,41.255H9.18H0v9.18v107.1v9.181h9.18H79
            c4.495,15.379,10.704,30.232,18.522,44.309l-49.489,49.489l-6.49,6.49l6.49,6.49l75.732,75.732l6.49,6.493l6.49-6.493
            l50.579-50.579c13.06,6.833,26.821,12.316,41.056,16.358v70.909v9.181h9.18H344.66h9.18v-9.181v-72.724
            c12.727-4.033,25.102-9.263,36.931-15.608l51.645,51.64l6.49,6.494l6.49-6.494l75.731-75.731l6.49-6.49l-6.49-6.49l-51.46-51.46
            c6.814-12.567,12.356-25.731,16.542-39.278h73.771V353.841z M418.1,289.582c0,71.711-58.339,130.05-130.05,130.05
            S158,361.292,158,289.582s58.339-130.05,130.05-130.05S418.1,217.871,418.1,289.582z"/>
      </g>
    </motion.svg>
  );
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token-nemachine");
    const user = localStorage.getItem("user-nemachine");
    if (token && user) router.push("/machine");
  }, [router]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const response = await axios.post("http://159.65.216.202:9999/auth/login", { username, password });
      localStorage.setItem("user-nemachine", JSON.stringify(response.data.user));
      localStorage.setItem("token-nemachine", response.data.token);
      window.dispatchEvent(new Event("storage"));
      router.push("/");
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      position: "relative"
    }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ duration: 2 }} style={{ position: "absolute", top: 80, left: 80, zIndex: 0 }}>
        <GearAnimation size={150} />
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ duration: 2 }} style={{ position: "absolute", bottom: 80, right: 80, zIndex: 0 }}>
        <GearAnimation size={100} />
      </motion.div>

      <Container maxWidth="xs" sx={{ zIndex: 1 }}>
        <Paper elevation={10} sx={{
          padding: "2.5rem",
          borderRadius: "16px",
          textAlign: "center",
          backgroundColor: "white",
          color: "black",
          boxShadow: "0px 8px 30px rgb(103 93 255 / 40%)",
          border: "1px solid #ddd"
        }}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }}>
            <GearAnimation size={80} />
          </motion.div>
          <Typography variant="h5" sx={{
            fontWeight: "bold",
            marginBottom: "1.5rem",
            color: "#333"
          }}>Machine Login</Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Username" variant="outlined" margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} InputLabelProps={{ shrink: true }} />
            
            <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{
              marginTop: "1.5rem",
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "#ff7000" }
            }}>
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Log in"}
            
            </Button>
            
          </form>
        </Paper>
      </Container>

      {/* 🔥 Snackbar Alert Popup 🔥 */}
      <Snackbar open={error} autoHideDuration={4000} onClose={() => setError(false)}>
        <Alert severity="error" sx={{ width: "100%" }}>
          ⚠️ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
        </Alert>
      </Snackbar>
    </Box>
  );
}
