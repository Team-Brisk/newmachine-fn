"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import Reordering from "../components/Reordering";
import * as motion from "motion/react-client"

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
            <Box sx={{
                display: "flex",
                justifyContent: "center"
            }}>
                <motion.div drag  >
                    <Reordering />
                </motion.div>
            </Box>

            <Box sx={{
                maxWidth: "900px",
                margin: "0 auto",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
            }}>
                {/* Header */}
                <Box sx={{
                    background: "none",
                    padding: "15px",
                    color: "#ff6300",
                    textAlign: "center",
                    fontSize: "4.5rem",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    marginBottom: "20px",
                }}>
                    PM<br />CHECK <br />LIST
                </Box>


            </Box>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                padding: "20px 0",
                marginBottom: "10px",
            }}>


                {/* File List */}
                <Paper sx={{ padding: "15px", borderRadius: "10px", boxShadow:  "none", background: "none", display: "flex", flexDirection: "column", gap: "30px" }}>
                    {myPdf.length > 0 ? (
                        myPdf.map((pdf) => (
                            <motion.div
                                key={pdf._id}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.8 }}

                            >
                                <Box key={pdf._id} sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "20px 40px 40px",
                                    boxShadow: "#d0d0d0 0px 2px 8px 0px",
                                    transition: "all 0.3s",
                                    backgroundColor: "#f8f8f8",
                                    borderRadius: "15px",
                                    "&:hover": { background: "#f8f8f8" }
                                }}>
                                    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                                        <Typography

                                            sx={{ cursor: "pointer", color: "#f87c01", fontWeight: "bold", fontSize: "16px", }}
                                            onClick={() => handleOpenPdf(pdf.pdfName)}
                                        >
                                            {pdf.pdfName}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "black", fontSize: "13px" }}>
                                            {new Date(pdf.uploadAt).toLocaleString()} | <span style={{ color: "black" }}> {pdf.uploadBy}</span>
                                        </Typography>
                                        {pdf.machine && Object.keys(pdf.machine).length > 0 && (
                                            <Box sx={{ marginTop: "5px", color: "black", fontSize: "13px" }}>
                                                <strong style={{ color: "black" }}>MACHINE:</strong>{" "}
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
                                        {/* <Button
                                        variant="contained"
                                        sx={{
                                            background: "none",
                                            boxShadow: "none",
                                            color: "white",
                                            "&:hover": {
                                                fontSize: "20px",
                                                background: "none",
                                                boxShadow: "none",
                                                transform: "scale(1.05)",
                                            }
                                        }}
                                        onClick={() => handleOpenPdf(pdf.pdfName)}
                                    >
                                        OPEN
                                    </Button> */}

                                        <Button
                                            variant="contained"
                                            sx={{
                                                background: "none",
                                                boxShadow: "none",
                                                color: "black",
                                                "&:hover": {
                                                    fontSize: "20px",
                                                    background: "none",
                                                    boxShadow: "none",
                                                    color: "red",
                                                    transform: "scale(1.05)",
                                                }
                                            }}
                                            onClick={() => handleDelete(pdf.pdfName)}
                                        >
                                            DELETE
                                        </Button>
                                    </Box>
                                </Box>
                            </motion.div>
                        ))
                    ) : (
                        <Typography>❌ ไม่มีไฟล์ PM Check List</Typography>
                    )}
                </Paper>

                {/* Machine Count Summary */}
                {/* <motion.div drag  > */}
              
                <motion.div
                             
                                whileHover={{ scale: 1.5 }}
                                whileTap={{ scale: 0.8 }}

                            >  
                <Box sx={{ marginTop: "20px" }}>
                    <Typography variant="h5" sx={{color:"black" }}>รายงาน PM Check List ต่อเครื่องจักร</Typography>
                    {Object.keys(machineCount).length > 0 ? (
                        <TableContainer component={Paper} sx={{ marginTop: "15px", borderRadius: "8px", boxShadow: "#d0d0d0 0px 2px 8px 0px"}}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#f8f8f8", color: "black", fontFamily: "TT Hoves Regular" }}>
                                        <TableCell sx={{ color: "black" }}> เครื่องจักร</TableCell>
                                        <TableCell sx={{ color: "black" }}> จำนวนไฟล์</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ backgroundColor: "#f8f8f8" }}>
                                    {Object.entries(machineCount).map(([machiness, countss]) => (
                                        <TableRow key={machiness} sx={{ color: "black" }} >
                                            <TableCell sx={{ fontFamily: "TT Hoves Regular", color: "black" }}>{machiness}</TableCell>
                                            <TableCell sx={{ fontFamily: "TT Hoves Regular", color: "black" }}>{countss} ไฟล์</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography>ไม่มีข้อมูลการเช็ค PM ต่อเครื่องจักร</Typography>
                    )}
                </Box>
                </motion.div>
            
                {/* </motion.div> */}
            </Box>
            </Box>
        </>
    );
}
