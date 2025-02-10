import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

export default function ReportChart({ rowData }) {
  if (!rowData || rowData.length === 0) {
    return (
      <p style={{ textAlign: "center", fontWeight: "bold" }}>
        No data available
      </p>
    );
  }

  // Extract data safely
  const xLabels = rowData.map((item) => item?.MonthYear || "N/A"); // X-axis: MonthYear
  const pvData = rowData.map((item) => Number(item?.PV) || 0); // Planned Value
  const evData = rowData.map((item) => Number(item?.EV) || 0); // Earned Value
  const acData = rowData.map((item) => Number(item?.AC) || 0); // Actual Cost

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        paddingBottom: 5,
      }}
    >
      <div style={{ maxWidth: "100%", overflowX: "auto" }}>
        <LineChart
          width={Math.max(1000, xLabels.length * 50)} // Dynamic width
          height={400}
          series={[
            {
              data: pvData,
              label: "Planned Value (PV)",
              color: "blue",
              showMark: true,
            },
            {
              data: evData,
              label: "Earned Value (EV)",
              color: "green",
              showMark: true,
            },
            {
              data: acData,
              label: "Actual Cost (AC)",
              color: "red",
              showMark: true,
            },
          ]}
          xAxis={[
            {
              scaleType: "point",
              data: xLabels,
              label: "Month-Year",
            },
          ]}
          yAxis={[
            {
              // Add Y-axis label

              tickPlacement: "auto", // Ensures ticks are placed correctly
              tickFormatter: (value) => value.toLocaleString("en-US"), // Formats large numbers
            },
          ]}
          margin={{ left: 80, right: 30, top: 30, bottom: 40 }} // Increase left margin for Y-axis labels
          sx={{
            "& .MuiChartsAxis-tickLabel": { fontSize: 12 }, // Improve readability
          }}
        />
      </div>
    </div>
  );
}
