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
    Badge,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import styles from "./styles.module.scss"; // Import SCSS file for custom styles

export default function WorkByPalletPage() {
    const [data, setData] = useState([]);
    const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [SHUstatus, setSHUStatus] = useState<any[]>([])
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
            const res = await fetch(`http://159.65.216.202:9999/machine/shu/status`).then((res) => res.json())
            setSHUStatus(res.status)
 
                
        } catch (error) {
          
        } finally {
            console.log('Fetching SHU status complete', SHUstatus.length)
        }
    }
    useEffect(() => {
        fetchData();
        fetchSHUStatus();
    }, [date]);

    const formatJobStatus = (status: any) => {
        switch (status) {
            case 99:
                return { label: "จบงาน", className: styles.completed };
            case 1:
                return { label: "กำลังทำงาน", className: styles.inProgress };
            default:
                return { label: "ไม่มีงาน", className: styles.notAvailable };
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setModalData(null);
    };

    // 🔍 ค้นหา Pallet ID และเรียงลำดับล่าสุดก่อน
    const filteredData = data
        .filter((item: any) => item._id?.palletId?.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a: any, b: any) => moment(b.data[b.data.length - 1]?.timestamp).valueOf() - moment(a.data[a.data.length - 1]?.timestamp).valueOf());

    return (
        <Box className={styles.container}>
            <h1 className={styles.title}>งานตามพาเลท</h1>

            <Box className={styles.datePickerContainer}>
                <TextField
                    label="เลือกวันที่"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    className={styles.datePicker}
                />
                <Button variant="contained" className={styles.fetchButton} onClick={fetchData}>
                    ค้นหาข้อมูล
                </Button>
            </Box>

            {/* 🔍 ช่องค้นหา Pallet ID */}
            <Box className={styles.searchContainer}>
                <TextField
                    label="ค้นหา Pallet ID"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                />
            </Box>

            {loading && <CircularProgress className={styles.loadingSpinner} />}

            {!loading && filteredData.length > 0 && (
                <TableContainer component={Paper} className={styles.tableContainer}>
                    <Table>
                        <TableHead className={styles.tableHead}>
                            <TableRow>
                                <TableCell>รหัสพาเลท</TableCell>
                                <TableCell>สถานะ</TableCell>
                                <TableCell>ตำแหน่ง</TableCell>
                                <TableCell>เวลาเริ่มต้น</TableCell>
                                <TableCell>เวลาสิ้นสุด</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.map((item: any, index) => {
                                const latestData = item.data[item.data.length - 1];
                                const { label, className } = formatJobStatus(latestData.jobStatus);

                                return (
                                    <TableRow key={index} className={styles.tableRow} onClick={() => handleRowClick(item._id.palletId)}>
                                        <TableCell>{item._id.palletId}</TableCell>
                                        <TableCell>
                                            <Badge className={className}>{label}</Badge>
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

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
                <DialogTitle>รายละเอียดของพาเลท {modalData?._id?.palletId}</DialogTitle>
                <DialogContent>
                    {modalData && (
                        <TableContainer component={Paper} className={styles.modalTableContainer}>
                            <Table>
                                <TableHead className={styles.tableHead}>
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
                                        const { label, className } = formatJobStatus(subItem.jobStatus);

                                        let timeDiff = "--";
                                        if (idx < array.length - 1) {
                                            const currentTimestamp = moment(subItem.timestamp);
                                            const nextTimestamp = moment(array[idx + 1].timestamp);
                                            const diffSeconds = currentTimestamp.diff(nextTimestamp, 'seconds');

                                            const minutes = Math.floor(diffSeconds / 60);
                                            const seconds = diffSeconds % 60;
                                            timeDiff = `${minutes} นาที ${seconds} วินาที`;
                                        }

                                        return (
                                            <TableRow key={idx} className={styles.modalTableRow}>
                                                <TableCell>{moment(subItem.timestamp).format("YYYY-MM-DD HH:mm:ss")}</TableCell>
                                                <TableCell>{subItem.palletId}</TableCell>
                                                <TableCell>{subItem.location}</TableCell>
                                                <TableCell>{subItem.curBank}</TableCell>
                                                <TableCell>{subItem.curBay}</TableCell>
                                                <TableCell>{subItem.curLevel}</TableCell>
                                                <TableCell>{subItem.source}</TableCell>
                                                <TableCell>
                                                    <Badge className={className}>{label}</Badge>
                                                </TableCell>
                                                <TableCell>
                {SHUstatus.find((s) => s.no === subItem.statusNo)?.description || "ไม่พบข้อมูล"}
            </TableCell>
                                                <TableCell>{timeDiff}</TableCell>
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
