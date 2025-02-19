"use client";
import axios from 'axios';
import React, { useState , useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for useRouter
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import './machine.scss';

export default function Machine() {
  const router = useRouter();
  const [site, setSite] = useState<string>("");
  useEffect(() => {
    const token = localStorage.getItem("token-nemachine");
    const user = localStorage.getItem("user-nemachine");
    if (!token ||  !user) {
      localStorage.clear();
      router.push("/login");
    }
  }, [router]);
  const handleChange = (event: SelectChangeEvent) => {
    setSite(event.target.value); // Keep value as string
    console.log(event.target.value);
  };

  const handleCardClick = (path: string) => {
    router.push(path); // Navigate to the selected page
  };

  return (
    <div className="container">
      <div className="container-title">
        <h1 className="title-01">MACHINE</h1>
      </div>

      <div className="contain-select-site">
        <FormControl fullWidth>
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
      </div>

      <div className="step2-select">
        {Number(site) === 1 && (
          <div className="esmart">
            <div className="shu-card" onClick={() => handleCardClick('/machine/esmart/shu')}>
              <div className="card-content">
                <h3>SHU (Shuttle Car)</h3>
              </div>
            </div>

            <div className="srm-card" onClick={() => handleCardClick('/machine/esmart/srm')}>
              <div className="card-content">
                <h3>SRM (Crane)</h3>
              </div>
            </div>
          </div>
        )}

        {Number(site) === 2 && (
          <div className="aai">
            <Box sx={{ fontSize: "1.5rem", color: "#333", fontWeight: "bold" }}>
              AAI
            </Box>
          </div>
        )}
      </div>
    </div>
  );
}
