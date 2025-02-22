"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from "@mui/material";
import style from "./dashboard.module.scss";

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
      <Box className= { style.dashboardcontainer }>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className= { style.dashboardcontainer }>
      <Typography variant="h4" className={style.dashboardtitle}>
         Dashboard
      </Typography>

      <Typography variant="h6" className={style.welcometext}>
        สวัสดี, {user?.name || "Guest"} 
      </Typography>

      <Grid container spacing={3} className={style.dashboardgrid}>
        <Grid item xs={12} sm={6} md={4}>
          <Card className={style.dashboardcard}>
            <CardContent>
              <Typography variant="h6" className={style.cardtitle}>
                 PM Check List
              </Typography>
              <Typography variant="body2" className={style.carddesc}>
                จัดการและตรวจสอบ PM Check List ของคุณได้ที่นี่
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className={style.dashboardcard}>
            <CardContent>
              <Typography variant="h6" className={style.cardtitle}>
                 Machine Overview
              </Typography>
              <Typography variant="body2" className= {style.carddesc}>
                ดูรายละเอียดของเครื่องจักรทั้งหมดในระบบ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className={style.dashboardcard}>
            <CardContent>
              <Typography variant="h6" className={style.cardtitle}>
                 Maintenance Status
              </Typography>
              <Typography variant="body2" className={style.carddesc}>
                ตรวจสอบสถานะการบำรุงรักษาและแจ้งเตือน
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
