import { useEffect, useState } from "react";
import axios from "axios";
import ReportSummary from "./components/ReportSummary";
import Header from "./components/Header";
import { Box } from "@mui/material";
import ReportChart from "./components/ReportChart";
import { baseUrl } from "./config";
const currentDate = new Date().toISOString().split("T")[0];

function App() {
  const [formData, setFormData] = useState({ Project: 0, Date: currentDate });
  const [rowData, setRowData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}GetErnMgmtRep?Project=${formData?.Project}&Date=${formData?.Date}`
      );
  
      if (response?.status === 200) {
        let myObject = JSON.parse(response?.data?.ResultData);
  
        // Update each object with new calculated fields
        const updatedData = myObject.map((item) => ({
          ...item, 
          "Planed Value (PV)":item.PV,
          "Earned Value (EV)":item.EV,
          "Actual Cost (AC)":item.AC,
          "Schedule Variance (SV)": item.EV - item.PV,       // Schedule Variance
          "Schedule Performance Index (SPI)": item.PV !== 0 ? item.EV / item.PV : 0, // Schedule Performance Index (avoid division by zero)
          "Cumulative of Cost Variance (CV)": item.EV - item.AC,       // Cost Variance
          "Cost Performance Index (CPI)": item.AC !== 0 ? item.EV / item.AC : 0  // Cost Performance Index (avoid division by zero)
        }));
        setRowData(updatedData); // Update state with modified array
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

  useEffect(() => {
      fetchData();
  }, [formData]);

  return (
    <>
    
    <Header />
    <Box p={1} >
      <ReportSummary
        rowData={rowData}
        formData={formData}
        setFormData={setFormData}
      />
    
    
      </Box>
      <ReportChart rowData={rowData} />
    </>
  );
}

export default App;
