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

    const formatJobStatus = (status: number): { label: string; color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" } => {
        switch (status) {
            case 99:
                return { label: "จบงาน", color: "success" }; // ✅ ใช้ "success" ที่รองรับ
            case 1:
                return { label: "กำลังทำงาน", color: "warning" }; // ✅ ใช้ "warning" ที่รองรับ
            default:
                return { label: "ไม่มีงาน", color: "default" }; // ✅ ใช้ "default" ที่รองรับ
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
        <Box sx={{
            padding: "24px",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            maxWidth: "1200px",
            margin: "auto",
        }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: "20px", color: "#333" }}>
                งานตามพาเลท
            </Typography>

            {/* Date Picker */}
            <Box sx={{ display: "flex", gap: "16px", marginBottom: "20px", alignItems: "center", justifyContent: "center" }}>
                <TextField
                    label="เลือกวันที่"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <Button variant="contained" sx={{ backgroundColor: "#414141", color: "white", "&:hover": { backgroundColor: "#0d47a1" } }} onClick={fetchData}>
                    ค้นหาข้อมูล
                </Button>
            </Box>

            {/* Search Bar */}
            <Box sx={{ width: "40%", margin: "0 auto", marginBottom: "30px" }}>
                <TextField
                    label="ค้นหา Pallet ID"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                />
            </Box>

            {loading && <CircularProgress sx={{ display: "block", margin: "auto" }} />}

            {!loading && filteredData.length > 0 && (
                <TableContainer component={Paper} sx={{ borderRadius: "12px", overflow: "hidden", boxShadow: 3 }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "rgb(241, 135, 35)" }}>
                            <TableRow>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>รหัสพาเลท</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>สถานะ</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ตำแหน่ง</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>เวลาเริ่มต้น</TableCell>
                                <TableCell sx={{ color: "white", fontWeight: "bold" }}>เวลาสิ้นสุด</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((item: any, index) => {
                                const latestData = item.data[item.data.length - 1];
                                const { label, color } = formatJobStatus(latestData.jobStatus);

                                return (
                                    <TableRow key={index} hover onClick={() => handleRowClick(item._id.palletId)}>
                                        <TableCell>{item._id.palletId}</TableCell>
                                        <TableCell>
                                            <Chip label={label} color={color} />
                                        </TableCell>
                                        <TableCell>{latestData.location}</TableCell>
                                        <TableCell>{moment(item.data[0].timestamp).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                                        <TableCell>
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
            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
                <DialogTitle>รายละเอียดของพาเลท {modalData?._id?.palletId}</DialogTitle>
                <DialogContent>
                    {modalData && (
                        <TableContainer component={Paper} sx={{ marginTop: "15px", borderRadius: "10px", overflow: "hidden", boxShadow: 3 }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: "#f4f4f9" }}>
                                    <TableRow>
                                        <TableCell>เวลา</TableCell>
                                        <TableCell>รหัสพาเลท</TableCell>
                                        <TableCell>Location</TableCell>
                                        <TableCell>Bank</TableCell>
                                        <TableCell>Bay</TableCell>
                                        <TableCell>Level</TableCell>
                                        <TableCell>Machine</TableCell>
                                        <TableCell>สถานะงาน</TableCell>
                                        <TableCell>สถานะ</TableCell>
                                        <TableCell>เวลาแตกต่าง</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {modalData.data.slice().reverse().map((subItem: any, idx: number, array: any[]) => {
                                        const { label, color } = formatJobStatus(subItem.jobStatus);
                                        const statusDescription = SHUstatus.find((s) => s.no === subItem.statusNo)?.description || "ไม่พบข้อมูล";

                                        return (
                                            <TableRow key={idx} hover>
                                                <TableCell>{moment(subItem.timestamp).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                                                <TableCell>{subItem.palletId}</TableCell>
                                                <TableCell>{subItem.location}</TableCell>
                                                <TableCell>{subItem.curBank}</TableCell>
                                                <TableCell>{subItem.curBay}</TableCell>
                                                <TableCell>{subItem.curLevel}</TableCell>
                                                <TableCell>{subItem.source}</TableCell>
                                                <TableCell>
                                                    <Chip label={label} color={color} />
                                                </TableCell>
                                                <TableCell>{statusDescription}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>ปิด</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
