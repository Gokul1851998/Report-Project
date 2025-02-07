import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function ReportChart({ rowData }) {
  if (!rowData || rowData.length === 0) {
    return <p style={{ textAlign: 'center' }}>No data available</p>;
  }

  // Extract data for the chart
  const xLabels = rowData.map((item) => item.MonthYear); // X-axis: MonthYear
  const pvData = rowData.map((item) => item.PV); // Planned Value
  const evData = rowData.map((item) => item.EV); // Earned Value
  const acData = rowData.map((item) => item.AC); // Actual Cost

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <LineChart
          width={1000} // Ensures the chart maintains its width
          height={400}
          series={[
            { data: pvData, label: 'Planned Value (PV)', color: 'blue' },
            { data: evData, label: 'Earned Value (EV)', color: 'green' },
            { data: acData, label: 'Actual Cost (AC)', color: 'red' },
          ]}
          xAxis={[{ scaleType: 'point', data: xLabels }]}
        />
      </div>
    </div>
  );
}
