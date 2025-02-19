"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Button, Pagination } from '@mui/material';
import moment from 'moment';
import './srm.scss';
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
  const [filterOptions, setFilterOptions] = useState<any>({}); // Store filter options
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token-nemachine");
    const user = localStorage.getItem("user-nemachine");
    if (!token ||  !user) {
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);
  // Fetch data
  const fetchData = async () => {
    const params = {
      startDate,
      endDate,
      palletId,
      unitType,
      status,
      cmdNo,
      page,
      limit: 10, // Adjust this value for pagination
    };

    try {
      const response = await axios.get('http://159.65.216.202:9999/machine/srm', { params });
      setData(response.data.data);
      setTotalPages(response.data.totalPages);
      setFilterOptions(response.data.filter); // Save the filter options from the response
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, palletId, unitType, status, cmdNo, page]);

  return (
    <div className="container">
      <h1 className="title">SRM (CRANE)</h1>

      {/* Filter Section */}
      <Box sx={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div className="filter-card">
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
        </div>

        <div className="filter-card">
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
        </div>

        <div className="filter-card">
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
        </div>

        <div className="filter-card">
          <FormControl fullWidth sx={{ marginBottom: '15px' }}>
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
        </div>
      </Box>

      {/* Data Table */}
      <Box sx={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', boxShadow: 3, padding: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Start Position</th>
              <th>End Position</th>
              <th>Pre Bay</th>
              <th>Pre Level</th>
              <th>Job Status</th>
              <th>Run Pallet ID</th>
              <th>Status Description</th>
              <th>Command Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="table-row">
                <td>{item.timestamp}</td>
                <td>{item.startPos}</td>
                <td>{item.endPos}</td>
                <td>{item.preBay}</td>
                <td>{item.preLevel}</td>
                <td>{item.jobStatus}</td>
                <td>{item.run_palletId}</td>
                <td>{item.status_description}</td>
                <td>{item.command_description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          variant="outlined"
          shape="rounded"
          sx={{ fontWeight: 'bold' }}
        />
      </Box>
    </div>
  );
}
