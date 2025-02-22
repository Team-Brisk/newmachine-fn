"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

interface IPmForm {
    _id: string;
    pdfName: string;
    uploadBy: string;
    uploadAt: string;
    machine?: Record<string, string>;
    __v: number;
}

interface IMachineCount {
    [key: string]: number;
}

export default function Pm() {
    const [myPdf, setMyPdf] = useState<IPmForm[]>([]);
    const [machineCount, setMachineCount] = useState<IMachineCount>({});
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token-nemachine");
        const user = localStorage.getItem("user-nemachine");
        if (!token || !user) {
            localStorage.clear();
            router.push("/login");
        }
    }, [router]);

    const fetchData = async () => {
        const token = localStorage.getItem("token-nemachine");
        if (!token) {
            console.error("Token not found in localStorage");
            return;
        }

        try {
            const response = await fetch("http://159.65.216.202:9999/pm/mine", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch PDF data.");
            }

            const data = await response.json();
            setMyPdf(data.data || []);
            setMachineCount(data.machineCount || {});
        } catch (error) {
            console.error("Error fetching PDFs:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (fileName: string) => {
        const token = localStorage.getItem("token-nemachine");
        if (!token) {
            alert("You are not authorized!");
            return;
        }

        const isConfirmed = window.confirm(`คุณต้องการลบไฟล์ "${fileName}" ใช่หรือไม่?`);
        if (!isConfirmed) return;

        try {
            const response = await fetch(`http://159.65.216.202:9999/pm/file/${fileName}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                setMyPdf((prevPdf) => prevPdf.filter((pdf) => pdf.pdfName !== fileName));
                alert(`ไฟล์ "${fileName}" ถูกลบเรียบร้อยแล้ว!`);
                fetchData();
            } else {
                const errorData = await response.json();
                alert(`ลบไฟล์ไม่สำเร็จ: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            alert("เกิดข้อผิดพลาดในการลบไฟล์");
        }
    };

    const handleOpenPdf = async (pdfName: string) => {
        const token = localStorage.getItem("token-nemachine");
        if (!token) {
            alert("You are not authorized!");
            return;
        }

        try {
            const response = await fetch(`http://159.65.216.202:9999/pm/files/${pdfName}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch PDF file.");
            }

            const blob = await response.blob();
            const pdfUrl = URL.createObjectURL(blob);
            window.open(pdfUrl, "_blank");
        } catch (error) {
            console.error("Error fetching PDF:", error);
            alert("Error opening PDF file.");
        }
    };

    return (
        <Box sx={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
        }}>
            {/* Header */}
            <Box sx={{
                background: "linear-gradient(135deg, #ff7000, #ff9900)",
                padding: "15px",
                color: "white",
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: "bold",
                borderRadius: "8px",
                marginBottom: "20px",
            }}>
                PM Check List
            </Box>

            {/* File List */}
            <Paper sx={{ padding: "15px", borderRadius: "10px", boxShadow: 3 }}>
                {myPdf.length > 0 ? (
                    myPdf.map((pdf) => (
                        <Box key={pdf._id} sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1px solid #ddd",
                            padding: "10px 0",
                            transition: "all 0.3s",
                            "&:hover": { background: "#f5f5f5" }
                        }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="h6"
                                    sx={{ cursor: "pointer", color: "#007bff", fontWeight: "bold" }}
                                    onClick={() => handleOpenPdf(pdf.pdfName)}
                                >
                                    📂 {pdf.pdfName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#666" }}>
                                    {new Date(pdf.uploadAt).toLocaleString()} | 👤 {pdf.uploadBy}
                                </Typography>
                                {pdf.machine && Object.keys(pdf.machine).length > 0 && (
                                    <Box sx={{ marginTop: "5px", color: "#333" }}>
                                        🏭 <strong>เครื่องจักร:</strong>{" "}
                                        {Object.entries(pdf.machine).map(([machine, id]) => (
                                            <Typography key={id} component="span" sx={{
                                                background: "#e2e2e2",
                                                padding: "3px 8px",
                                                borderRadius: "5px",
                                                marginRight: "5px",
                                                fontSize: "12px",
                                            }}>
                                                {machine}
                                            </Typography>
                                        ))}
                                    </Box>
                                )}
                            </Box>
                            <Box sx={{ display: "flex", gap: "10px" }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        background: "linear-gradient(135deg, #28a745, #45c657)",
                                        color: "white",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #218838, #3ebd4d)",
                                            transform: "scale(1.05)",
                                        }
                                    }}
                                    onClick={() => handleOpenPdf(pdf.pdfName)}
                                >
                                    เปิด
                                </Button>

                                <Button
                                    variant="contained"
                                    sx={{
                                        background: "linear-gradient(135deg, #dc3545, #ff5c6c)",
                                        color: "white",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #c82333, #ff444e)",
                                            transform: "scale(1.05)",
                                        }
                                    }}
                                    onClick={() => handleDelete(pdf.pdfName)}
                                >
                                    ลบ
                                </Button>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography>❌ ไม่มีไฟล์ PM Check List</Typography>
                )}
            </Paper>

            {/* Machine Count Summary */}
            <Box sx={{ marginTop: "20px" }}>
                <Typography variant="h5">📊 รายงาน PM Check List ต่อเครื่องจักร</Typography>
                {Object.keys(machineCount).length > 0 ? (
                    <TableContainer component={Paper} sx={{ marginTop: "15px", borderRadius: "8px", boxShadow: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f4f4f9" }}>
                                    <TableCell>🏭 เครื่องจักร</TableCell>
                                    <TableCell>📄 จำนวนไฟล์</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(machineCount).map(([machine, count]) => (
                                    <TableRow key={machine}>
                                        <TableCell>{machine}</TableCell>
                                        <TableCell>{count} ไฟล์</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>ไม่มีข้อมูลการเช็ค PM ต่อเครื่องจักร</Typography>
                )}
            </Box>
        </Box>
    );
}
