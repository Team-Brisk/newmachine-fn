"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import "./pm.scss";
import { useRouter } from "next/navigation";

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
        if (!token ||  !user) {
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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
        <div className="container">
            <div className="header">
                <h2> PM Check List</h2>
            </div>

            {/* ✅ รายการไฟล์ PDF */}
            <div className="file-list">
                {myPdf.length > 0 ? (
                    <ul>
                        {myPdf.map((pdf) => (
                            <li key={pdf._id} className="file-item">
                                <div className="file-info">
                                    <span className="file-name" onClick={() => handleOpenPdf(pdf.pdfName)}>
                                        📂 {pdf.pdfName}
                                    </span>
                                    <div className="file-meta">
                                         {new Date(pdf.uploadAt).toLocaleString()} | 👤 {pdf.uploadBy}
                                    </div>
                                    {/* ✅แสดงเครื่องจักรที่อยู่ในไฟล์ */}
                                    {pdf.machine && Object.keys(pdf.machine).length > 0 && (
                                        <div className="machine-list">
                                            🏭 <strong>เครื่องจักร:</strong>{" "}
                                            {Object.entries(pdf.machine).map(([machine, id]) => (
                                                <span key={id} className="machine-item">
                                                    {machine}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="file-actions">
                                    <button className="btn btn-open" onClick={() => handleOpenPdf(pdf.pdfName)}>
                                        เปิด
                                    </button>
                                    <button className="btn btn-delete" onClick={() => handleDelete(pdf.pdfName)}>
                                        ลบ
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>❌ ไม่มีไฟล์ PM Check List</p>
                )}
            </div>

            {/* ✅ แสดงจำนวนเครื่องจักรที่มีการเช็ค PM */}
            <div className="machine-count">
                <h3>📊 รายงาน PM Check List ต่อเครื่องจักร</h3>
                {Object.keys(machineCount).length > 0 ? (
                    <table className="summary-table">
                        <thead>
                            <tr>
                                <th>🏭 เครื่องจักร</th>
                                <th>📄 จำนวนไฟล์</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(machineCount).map(([machine, count]) => (
                                <tr key={machine}>
                                    <td>{machine}</td>
                                    <td>{count} ไฟล์</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>ไม่มีข้อมูลการเช็ค PM ต่อเครื่องจักร</p>
                )}
            </div>
        </div>
    );
}
