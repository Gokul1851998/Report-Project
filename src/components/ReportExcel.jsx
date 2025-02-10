import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { values } from "lodash";

const profileDateFields = [
  "Created On",
  "Modified On",
  "CreatedOn",
  "ModifiedOn",
];
const rowsPerSheet = 100000;

const highlightColumns = [
  "Schedule Variance (SV)",
  "Schedule Performance Index (SPI)",
  "Cumulative of Cost Variance (CV)",
  "Cost Performance Index (CPI)",
];

const exportToExcel = async ({
  reportName,
  filteredRows = [],
  excludedFields = [],
}) => {
  try {
    if (!Array.isArray(filteredRows) || filteredRows.length === 0) {
      console.error("No valid data available for export.");
      return;
    }

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return isNaN(date) ? dateString : date.toLocaleDateString("en-GB");
    };

    const sanitizeSheetName = (name) =>
      name.replace(/[*?:\/[\]]/g, " ").substring(0, 31);

    const workbook = new ExcelJS.Workbook();
    let sheet = null;
    let currentRowCount = 0;
    let sheetNumber = 0;
    let allRows = [];

    const createNewSheet = () => {
      sheetNumber++;
      const sheetName = sanitizeSheetName(`${reportName} - ${sheetNumber}`);
      sheet = workbook.addWorksheet(sheetName);
      currentRowCount = 0;
      allRows = [];

      let headers = Object.keys(filteredRows[0] || {}).filter(
        (header) => !excludedFields.includes(header)
      );
      headers.push("Remark"); // Add extra column "Remark"

      // 🔴 Report Title + Subtitle (Merged in One Cell)
      const titleCell = `${reportName}\n`;
      const subTitleCell = "Earned Value Management Report";

      const titleRow = sheet.addRow([titleCell + subTitleCell]);

      titleRow.eachCell((cell) => {
        cell.font = {
          size: 12,
          bold: true,
          color: { argb: "FF0000" }, // Red for Report Name
        };

        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true, // Enables line breaks
        };
      });

      // 🔹 Merge First 3 Rows
      sheet.mergeCells(1, 1, 3, headers.length);
      titleRow.height = 50; // Adjust height for better visibility

      // 🔹 Apply Navy Blue & Underline to "Earned Value Management Report"
      const richText = [
        {
          text: `${reportName}\n`,
          font: { size: 12, bold: true, color: { argb: "FF0000" } }, // 🔴 Red
        },
        {
          text: "Earned Value Management Report",
          font: {
            size: 12,
            bold: true,
            underline: true,
            color: { argb: "000080" },
          }, // 🔵 Navy Blue & Underlined
        },
      ];

      titleRow.getCell(1).value = { richText }; // Assign rich text

      // 🔹 Add Header Row (Light Gray Background, Bold)
      const headerRow = sheet.addRow(headers);
      headerRow.font = { bold: true };
      headerRow.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true,
      };

      headerRow.eachCell((cell, colNumber) => {
        const fieldName = headers[colNumber - 1]; // Get actual field name
        const isHighlighted = highlightColumns.includes(fieldName);

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: isHighlighted ? "ADD8E6" : "D3D3D3" }, // Light Blue for specific, Gray for others
        };

        cell.font = { bold: true, color: { argb: "311b92" } };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      headerRow.height = 50;

      allRows.push(headers);
      currentRowCount += 3; // Increase by 3 due to merged title rows
    };

    createNewSheet();

    filteredRows.forEach((row) => {
      if (currentRowCount >= rowsPerSheet) {
        createNewSheet();
      }

      const formatNumberWithCommas = (value) => {
        if (
          typeof value === "number" ||
          (typeof value === "string" && !isNaN(value))
        ) {
          return Number(value).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          });
        }
        return value;
      };

      let rowData = Object.keys(row)
        .filter((header) => !excludedFields.includes(header))
        .map((header) => {
          let value = row[header] ?? "";

          // Format numbers to have commas (Indian format)
          value = formatNumberWithCommas(value);

          return profileDateFields.includes(header) ? formatDate(value) : value;
        });

      // Compute "Remark" column value
      let remarkText = "";
      let remarkColor = "000000"; // Default black
      if (row["Cost Performance Index (CPI)"] <= 0) {
        remarkText = "Behind the Schedule and Over Budget";
        remarkColor = "FF0000"; // Red
      } else {
        remarkText = "Ahead the Schedule and Under Budget";
        remarkColor = "008000"; // Green
      }

      rowData.push(remarkText);
      allRows.push(rowData);

      const excelRow = sheet.addRow(rowData);

      excelRow.eachCell((cell, colNumber) => {
        const fieldName = Object.keys(row).filter(
          (header) => !excludedFields.includes(header)
        )[colNumber - 1]; // Get actual field name

        // Apply border to all cells
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Apply light blue background to specific columns
        if (highlightColumns.includes(fieldName)) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ADD8E6" }, // Light Blue
          };
        }

        // const isNumber = (value) => {
        //   return (
        //     typeof value === "number" ||
        //     (typeof value === "string" &&
        //       value.trim() !== "" &&
        //       isFinite(value))
        //   );
        // };
        // console.log(fieldName);

        cell.alignment = {
          horizontal: ["Remark", "MonthYear"].includes(fieldName) ? "center" : "right",
          vertical: "middle",
        };
         // Center-align text

        cell.font = { color: { argb: "311b92" } };
      });

      // Apply color formatting to "Remark" column
      const remarkCell = excelRow.getCell(rowData.length);
      remarkCell.font = { color: { argb: remarkColor } };
      remarkCell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true, // Ensure text wrapping
      };
      currentRowCount++;
    });
    // 🔹 Auto-Fit Column Width
    // 🔹 Auto-Fit Column Width Based on Longest Data Value (Not Header)
    sheet.columns.forEach((column, colIndex) => {
      let maxWidth = 10; // Minimum width

      allRows.slice(1).forEach((row) => {
        // Skip header row
        if (row[colIndex]) {
          const cellValue = row[colIndex].toString();
          maxWidth = Math.max(maxWidth, cellValue.length + 2); // +2 for padding
        }
      });

      column.width = maxWidth; // Apply width based on data, not header name
    });

    const formatDateTimeForFilename = () => {
      const now = new Date();
      return `${String(now.getDate()).padStart(2, "0")}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${now.getFullYear()}_${String(
        now.getHours()
      ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(
        now.getSeconds()
      ).padStart(2, "0")}`;
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const dateTimeStringForFilename = formatDateTimeForFilename();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `${reportName}_${dateTimeStringForFilename}.xlsx`
    );
  } catch (error) {
    console.error("Error exporting to Excel:", error);
  }
};

export default exportToExcel;
