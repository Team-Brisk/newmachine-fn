"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from "@mui/material";
import "./dashboard.scss";

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
      <Box className="dashboard-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="dashboard-container">
      <Typography variant="h4" className="dashboard-title">
         Dashboard
      </Typography>

      <Typography variant="h6" className="welcome-text">
        สวัสดี, {user?.name || "Guest"} 
      </Typography>

      <Grid container spacing={3} className="dashboard-grid">
        <Grid item xs={12} sm={6} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" className="card-title">
                 PM Check List
              </Typography>
              <Typography variant="body2" className="card-desc">
                จัดการและตรวจสอบ PM Check List ของคุณได้ที่นี่
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" className="card-title">
                 Machine Overview
              </Typography>
              <Typography variant="body2" className="card-desc">
                ดูรายละเอียดของเครื่องจักรทั้งหมดในระบบ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="dashboard-card">
            <CardContent>
              <Typography variant="h6" className="card-title">
                 Maintenance Status
              </Typography>
              <Typography variant="body2" className="card-desc">
                ตรวจสอบสถานะการบำรุงรักษาและแจ้งเตือน
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
