"use client";
import { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
    Chip,
    Typography
} from "@mui/material";
import axios from "axios";
import moment from "moment";

export default function WorkByPalletPage() {
    const [data, setData] = useState([]);
    const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [SHUstatus, setSHUStatus] = useState<any[]>([]);

    const handleRowClick = (palletId: string) => {
        const selectedData = data.find((item: any) => item._id.palletId === palletId);
        setModalData(selectedData);
        setOpenModal(true);
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://159.65.216.202:9999/machine/workByPalletId", {
                params: { date },
            });
            setData(response.data.data);
        } catch (error) {
            console.log("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSHUStatus = async () => {
        try {
            const res = await fetch(`http://159.65.216.202:9999/machine/shu/status`).then((res) => res.json());
            setSHUStatus(res.status);
        } catch (error) {
            console.error("Error fetching SHU status:", error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchSHUStatus();
    }, [date]);

    const formatJobStatus = (status: number): { label: string; color: string } => {
        switch (status) {
            case 99:
                return { label: "จบงาน", color: "#2e7d32" }; // สีเขียวเข้มแบบ light mode
            case 1:
                return { label: "กำลังทำงาน", color: "#ed6c02" }; // สีส้มเข้มแบบ light mode
            default:
                return { label: "ไม่มีงาน", color: "#757575" }; // สีเทาปานกลาง
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setModalData(null);
    };

    const filteredData = data
        .filter((item: any) => item._id?.palletId?.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a: any, b: any) => moment(b.data[b.data.length - 1]?.timestamp).valueOf() - moment(a.data[a.data.length - 1]?.timestamp).valueOf());

    return (
        <>
        <Box
            sx={{
                backgroundImage: "radial-gradient(circle, rgb(220 240 255) 10%, rgba(255, 255, 255, 1) 90%)",
                backgroundSize: "cover",
                minHeight:"100vh"
            }}
        >
            <Box
                sx={{
                    padding: "32px",
                    borderRadius: "16px",
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "1400px",
                    margin: "auto",
                    
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: "20px",
                        color: "#333333",
                        letterSpacing: "1px",
                    }}
                >
                    งานตามพาเลท
                </Typography>

                {/* Date Picker */}
                <Box sx={{ display: "flex", gap: "16px", marginBottom: "24px", alignItems: "center", justifyContent: "center" }}>
                    <TextField
                        label="เลือกวันที่"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{
                            input: { color: "#333333", backgroundColor: "rgba(245, 245, 245, 0.9)", borderRadius: "8px" },
                            label: { color: "#333333" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "rgba(0, 0, 0, 0.2)" },
                                "&:hover fieldset": { borderColor: "#ff9800" },
                            },
                        }}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            background: "linear-gradient(135deg, #ff9800, #ff5722)",
                            color: "white",
                            padding: "12px 24px",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            transition: "0.3s",
                            "&:hover": {
                                background: "linear-gradient(135deg, #ff5722, #ff9800)",
                                boxShadow: "0px 0px 12px rgba(255, 87, 34, 0.8)",
                            },
                        }}
                        onClick={fetchData}
                    >
                        ค้นหาข้อมูล
                    </Button>
                </Box>

                {/* Search Bar */}
                <Box sx={{ width: "50%", margin: "0 auto", marginBottom: "30px" }}>
                    <TextField
                        label="ค้นหา Pallet ID"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                        sx={{
                            input: {
                                color: "#333333",
                                backgroundColor: "rgba(245, 245, 245, 0.9)",
                                borderRadius: "8px",
                            },
                            label: { color: "#333333" },
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "rgba(0, 0, 0, 0.2)" },
                                "&:hover fieldset": { borderColor: "#ff9800" },
                            },
                        }}
                    />
                </Box>

                {loading && <CircularProgress sx={{ display: "block", margin: "auto" }} />}

                {!loading && filteredData.length > 0 && (
                    <TableContainer
                        component={Paper}
                        sx={{
                            background: "#fafafa",
                            borderRadius: "16px",
                            overflow: "hidden",
                            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
                            border: "1px solid rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Table>
                            <TableHead sx={{ background: "linear-gradient(135deg, #e0e0e0, #f5f5f5)" }}>
                                <TableRow>
                                    {["รหัสพาเลท", "สถานะ", "ตำแหน่ง", "เวลาเริ่มต้น", "เวลาสิ้นสุด"].map((header, index) => (
                                        <TableCell
                                            key={index}
                                            sx={{
                                                color: "#333333",
                                                fontWeight: "bold",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((item: any, index) => {
                                    const latestData = item.data[item.data.length - 1];
                                    const { label, color } = formatJobStatus(latestData.jobStatus);

                                    return (
                                        <TableRow
                                            key={index}
                                            hover
                                            onClick={() => handleRowClick(item._id.palletId)}
                                            sx={{
                                                transition: "0.3s",
                                                "&:hover": {
                                                    backgroundColor: "#e0e0e0",
                                                    boxShadow: "0px 0px 10px rgba(255, 152, 0, 0.5)",
                                                },
                                            }}
                                        >
                                            <TableCell sx={{ color: "#333333", fontWeight: "bold" }}>{item._id.palletId}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={label}
                                                    sx={{
                                                        backgroundColor: color,
                                                        color: "#ffffff",
                                                        fontWeight: "bold",
                                                        textTransform: "uppercase",
                                                        borderRadius: "8px",
                                                        padding: "4px 12px",
                                                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ color: "#333333" }}>{latestData.location}</TableCell>
                                            <TableCell sx={{ color: "#333333" }}>
                                                {moment(item.data[0].timestamp).format("YYYY-MM-DD HH:mm:ss")}
                                            </TableCell>
                                            <TableCell sx={{ color: "#333333" }}>
                                                {latestData.jobStatus !== 99 ? "--:--" : moment(latestData.timestamp).format("YYYY-MM-DD HH:mm:ss")}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {/* Modal */}
                <Dialog
                    open={openModal}
                    onClose={handleCloseModal}
                    maxWidth="lg"
                    fullWidth
                    sx={{
                        "& .MuiPaper-root": {
                            background: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "16px",
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            color: "#333333",
                            fontWeight: "bold",
                            textAlign: "center",
                        }}
                    >
                        📦 รายละเอียดของพาเลท {modalData?._id?.palletId}
                    </DialogTitle>
                    <DialogContent>
                        {modalData && (
                            <TableContainer
                                component={Paper}
                                sx={{
                                    marginTop: "15px",
                                    background: "#ffffff",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    boxShadow: "0px 0px 12px rgba(0, 0, 0, 0.1)",
                                    border: "1px solid rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <Table>
                                    <TableHead sx={{ background: "linear-gradient(135deg, #e0e0e0, #f5f5f5)" }}>
                                        <TableRow>
                                            {["เวลา", "รหัสพาเลท", "ตำแหน่ง", "Bank", "Bay", "Level", "Machine", "สถานะงาน", "สถานะ"].map((header, idx) => (
                                                <TableCell key={idx} sx={{ color: "#333333", fontWeight: "bold" }}>
                                                    {header}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {modalData.data.slice().reverse().map((subItem: any, idx: number) => {
                                            const { label, color } = formatJobStatus(subItem.jobStatus);
                                            const statusDescription = SHUstatus.find((s) => s.no === subItem.statusNo)?.description || "ไม่พบข้อมูล";

                                            return (
                                                <TableRow
                                                    key={idx}
                                                    hover
                                                    sx={{
                                                        transition: "0.3s",
                                                        background:"#f0f0f0",
                                                        "&:hover": {
                                                            backgroundColor: "rgba(255, 152, 0, 0.2)",
                                                            boxShadow: "0px 0px 10px rgba(255, 152, 0, 0.5)",
                                                        },
                                                    }}
                                                >
                                                    <TableCell sx={{ color: "#333333" }}>{moment(subItem.timestamp).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                                                    <TableCell sx={{ color: "#333333" }}>{subItem.palletId}</TableCell>
                                                    <TableCell sx={{ color: "#333333" }}>{subItem.location}</TableCell>
                                                    <TableCell sx={{ color: "#333333" }}>{subItem.curBank}</TableCell>
                                                    <TableCell sx={{ color: "#333333" }}>{subItem.curBay}</TableCell>
                                                    <TableCell sx={{ color: "#333333" }}>{subItem.curLevel}</TableCell>
                                                    <TableCell sx={{ color: "#333333" }}>{subItem.source}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={label}
                                                            sx={{
                                                                backgroundColor: color,
                                                                color: "#ffffff",
                                                                fontWeight: "bold",
                                                                textTransform: "uppercase",
                                                                borderRadius: "8px",
                                                                padding: "4px 12px",
                                                                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ color: "#333333" }}>{statusDescription}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleCloseModal}
                            sx={{
                                background: "linear-gradient(135deg, #ff9800, #ff5722)",
                                color: "white",
                                fontWeight: "bold",
                                padding: "12px 24px",
                                textTransform: "uppercase",
                                transition: "0.3s",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #ff5722, #ff9800)",
                                    boxShadow: "0px 0px 12px rgba(255, 87, 34, 0.8)",
                                },
                            }}
                        >
                            ❌ ปิด
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box> 
        </Box>
        </>
    );
}
