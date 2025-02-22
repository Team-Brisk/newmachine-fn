"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Box, 
    TextField, 
    MenuItem, 
    Select, 
    InputLabel, 
    FormControl, 
    Pagination, 
    Typography, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow 
} from '@mui/material';
import moment from 'moment';
import { useRouter } from 'next/navigation';

export default function ShuPage() {
    const [data, setData] = useState<any[]>([]);
    const [startDate, setStartDate] = useState<string>(moment().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState<string>(moment().format('YYYY-MM-DD'));
    const [palletId, setPalletId] = useState<string>('');
    const [unitType, setUnitType] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [cmdNo, setCmdNo] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [filterOptions, setFilterOptions] = useState<any>({});
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
        const params = {
            startDate,
            endDate,
            palletId,
            unitType,
            status,
            cmdNo,
            page,
            limit: 10,
        };

        try {
            const response = await axios.get('http://159.65.216.202:9999/machine/shu', { params });
            setData(response.data.data);
            setTotalPages(response.data.totalPages);
            setFilterOptions(response.data.filter);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate, palletId, unitType, status, cmdNo, page]);

    return (
        <Box sx={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#fafafa",
            display: "flex",
            flexDirection: "column",
        }}>
            {/* Title */}
            <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: "30px", color: "#333" }}>
                SHU (Shuttle Car)
            </Typography>

            {/* Filter Section */}
            <Box sx={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <Paper sx={{ padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", width: "300px" }}>
                    <TextField
                        label="Start Date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: '100%', marginBottom: '15px' }}
                    />
                    <TextField
                        label="End Date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: '100%' }}
                    />
                </Paper>

                <Paper sx={{ padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", width: "300px" }}>
                    <FormControl fullWidth sx={{ marginBottom: '15px' }}>
                        <InputLabel>Unit Type</InputLabel>
                        <Select
                            value={unitType}
                            onChange={(e) => setUnitType(e.target.value)}
                            sx={{ width: '100%' }}
                        >
                            <MenuItem value="">All</MenuItem>
                            {filterOptions.unitType?.map((unit: number) => (
                                <MenuItem key={unit} value={unit}>
                                    {`Unit Type ${unit}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            sx={{ width: '100%' }}
                        >
                            <MenuItem value="">All</MenuItem>
                            {filterOptions.statusNo?.map((status: number) => (
                                <MenuItem key={status} value={status}>
                                    {`Status ${status}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>

                <Paper sx={{ padding: "20px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", width: "300px" }}>
                    <FormControl fullWidth sx={{ marginBottom: '15px' }}>
                        <InputLabel>Pallet ID</InputLabel>
                        <Select
                            value={palletId}
                            onChange={(e) => setPalletId(e.target.value)}
                            sx={{ width: '100%' }}
                        >
                            <MenuItem value="">All</MenuItem>
                            {filterOptions.palletId?.map((id: string) => (
                                <MenuItem key={id} value={id}>
                                    {id}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>CMD No</InputLabel>
                        <Select
                            value={cmdNo}
                            onChange={(e) => setCmdNo(e.target.value)}
                            sx={{ width: '100%' }}
                        >
                            <MenuItem value="">All</MenuItem>
                            {filterOptions.cmdNo?.map((cmd: number) => (
                                <MenuItem key={cmd} value={cmd}>
                                    {`CMD No. ${cmd}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Paper>
            </Box>

            {/* Data Table */}
            <TableContainer component={Paper} sx={{ marginBottom: '20px', borderRadius: '8px', boxShadow: 3, padding: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f4f4f9" }}>
                            <TableCell><b>Timestamp</b></TableCell>
                            <TableCell><b>Pallet ID</b></TableCell>
                            <TableCell><b>Unit Type</b></TableCell>
                            <TableCell><b>Weight</b></TableCell>
                            <TableCell><b>Location</b></TableCell>
                            
                            <TableCell><b>Command</b></TableCell>
                            <TableCell><b>Status Description</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{item.timestamp}</TableCell>
                                <TableCell>{item.palletId}</TableCell>
                                <TableCell>{item.unitType}</TableCell>
                                <TableCell>{item.weight}</TableCell>
                                <TableCell>{item.location}</TableCell>
                                <TableCell>{item.statusNo}</TableCell>
                                <TableCell>{item.statusDescription}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    variant="outlined"
                    shape="rounded"
                />
            </Box>
        </Box>
    );
}
