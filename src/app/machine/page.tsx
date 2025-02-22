"use client";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box, 
    Typography, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Paper 
} from '@mui/material';

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
        console.log(event.target.value);
    };

    const handleCardClick = (path: string) => {
        router.push(path);
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "1200px",
            width: "90%",
            margin: "0 auto",
            gap: "30px",
            padding: "30px 0",
        }}>
            {/* Title */}
            <Box sx={{ textAlign: "center" }}>
                <Typography variant="h3" sx={{ fontWeight: "bold", color: "#333" }}>
                    MACHINE
                </Typography>
            </Box>

            {/* Select Site */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <FormControl sx={{ width: "500px" }}>
                    <InputLabel id="site-select-label">เลือกไซต์งาน</InputLabel>
                    <Select
                        labelId="site-select-label"
                        id="site-select"
                        value={site}
                        onChange={handleChange}
                        sx={{
                            backgroundColor: "#f4f4f9",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <MenuItem value="1">E-SMART</MenuItem>
                        <MenuItem value="2">AAI</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Step 2: Show Machines */}
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                marginTop: "20px",
            }}>
                {Number(site) === 1 && (
                    <Box sx={{
                        display: "flex",
                        gap: "120px",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Paper
                            sx={{
                                backgroundColor: "#dedede",
                                color: "#696969",
                                borderRadius: "12px",
                                width: "300px",
                                height: "120px",
                                boxShadow: "0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                textAlign: "center",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-15px)",
                                    backgroundColor: "rgb(241, 135, 35)",
                                    color: "white",
                                },
                            }}
                            onClick={() => handleCardClick('/machine/esmart/shu')}
                        >
                            <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: "1px" }}>
                                SHU (Shuttle Car)
                            </Typography>
                        </Paper>

                        <Paper
                            sx={{
                                backgroundColor: "#dedede",
                                color: "#696969",
                                borderRadius: "12px",
                                width: "300px",
                                height: "120px",
                                boxShadow: "0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                textAlign: "center",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-15px)",
                                    backgroundColor: "#313131",
                                    color: "white",
                                },
                            }}
                            onClick={() => handleCardClick('/machine/esmart/srm')}
                        >
                            <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: "1px" }}>
                                SRM (Crane)
                            </Typography>
                        </Paper>
                    </Box>
                )}

                {Number(site) === 2 && (
                    <Box sx={{
                        fontSize: "1.5rem",
                        color: "#333",
                        fontWeight: "bold",
                    }}>
                        AAI
                    </Box>
                )}
            </Box>
        </Box>
    );
}
