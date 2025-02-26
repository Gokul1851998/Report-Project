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
        let myObject;
        try {
          myObject = JSON.parse(response?.data?.ResultData);

        } catch (error) {
          console.error("JSON Parse Error:", error);
          return;
        }
  
        if (!Array.isArray(myObject)) {
          console.error("Parsed data is not an array:", myObject);
          return;
        }
  
        // Initialize cumulative sums
        let cumulativePV = 0;
        let cumulativeEV = 0;
        let cumulativeAC = 0;
        let cumulativeExV = 0;
  
        // Process all items (without filtering out zero values)
        const updatedData = myObject.map((item) => {
          cumulativePV += item.PV; // Add current PV to cumulative sum
          cumulativeEV += item.EV;
          cumulativeAC += item.AC;
          cumulativeExV += item.ExecutedValue;
  
          return {
            "MonthYear":item?.MonthYear,
            "Executed Value": cumulativeExV,
            "Selling Price": item["SellingPrice"],
            "Planned Value (PV)": cumulativePV, // Cumulative PV
            "Earned Value (EV)": cumulativeEV, // Cumulative EV
            "Actual Cost (AC)": cumulativeAC, // Cumulative AC
            "Schedule Variance (SV)": cumulativeEV - cumulativePV, // SV
            "Schedule Performance Index (SPI)":
              cumulativePV !== 0 ? cumulativeEV / cumulativePV : 0, // Avoid division by zero
            "Cumulative of Cost Variance (CV)": cumulativeEV - cumulativeAC, // CV
            "Cost Performance Index (CPI)":
              cumulativeAC !== 0 ? cumulativeEV / cumulativeAC : 0, // Avoid division by zero
          };
        });
  
   
        setRowData(updatedData);
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
