"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Pagination, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import moment from 'moment';
import { useRouter } from 'next/navigation';

export default function SrmPage() {
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
            const response = await axios.get('http://159.65.216.202:9999/machine/srm', { params });
            setData(response.data.data);
            setTotalPages(response.data.totalPages);
            setFilterOptions(response.data.filter);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate, palletId, unitType, status, cmdNo, page]);

    return (
        <Box sx={{
            maxWidth: "1600px",
            margin: "0 auto",
            backgroundColor: "#fafafa",
            display: "flex",
            flexDirection: "column",
        }}>
            {/* Title */}
            <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: "30px", color: "#333" }}>
                SRM (CRANE)
            </Typography>

            {/* Filter Section */}
            <Box sx={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* Date Filters */}
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

                {/* Unit Type & Status Filters */}
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

                    <FormControl fullWidth sx={{ marginBottom: '15px' }}>
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

                {/* Pallet ID & CMD No Filters */}
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
            <TableContainer
                component={Paper}
                sx={{
                    marginBottom: '20px',
                    borderRadius: '12px',
                    boxShadow: 4,
                    border: '1px solid #ddd',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f4f4f9" }}>
                            {[
                                "Run Pallet ID",
                                "Start Position",
                                "End Position",
                                "Pre Bay",
                                "Pre Level",
                                "Job Status",
                                "X Current",
                                "Y Current",
                                "Z Current",
                                "X Freq",
                                "Y Freq",
                                "Z Freq",
                                "X",
                                "Y",
                                "Unit Types",
                                "Status No",
                                "Status Description",
                                "Cmd No",
                                "Command Description",
                                "Timestamp",
                            ].map((header, index) => (
                                <TableCell key={index} sx={{ fontWeight: "bold", textAlign: "center", borderBottom: "2px solid #ccc" }}>
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: "#f9f9f9" } }}>
                                {[
                                    item.run_palletId,
                                    item.startPos,
                                    item.endPos,
                                    item.preBay,
                                    item.preLevel,
                                    item.jobStatus,
                                    item.xCurrent,
                                    item.yCurrent,
                                    item.zCurrent,
                                    item.xFreq,
                                    item.yFreq,
                                    item.zFreq,
                                    item.x,
                                    item.y,
                                    item.unitTypes,
                                    item.statusNo,
                                    item.status_description,
                                    item.cmdNo,
                                    item.command_description,
                                    item.timestamp,
                                ].map((value, idx) => (
                                    <TableCell key={idx} sx={{ textAlign: idx > 5 ? "center" : "left", borderBottom: "1px solid #ddd" }}>
                                        {value}
                                    </TableCell>
                                ))}
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
                    sx={{
                        "& .MuiPaginationItem-root": {
                            color: "#1976d2",
                            "&.Mui-selected": {
                                backgroundColor: "#1976d2",
                                color: "#fff",
                            },
                            "&:hover": {
                                backgroundColor: "#f0f0f0",
                            },
                        },
                    }}
                />
            </Box>

        </Box>
    );
}
