import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography} from "@mui/material";
import AutoComplete from "./AutoComplete";
import TextBox from "./TextBox";
import ActionButton from "./ActionButton";
import exportToExcel from "./ReportExcel";

const style = {
  display: "flex",
  alignItems: "center",
  fontSize: "1.2rem",
  color: "gray",
  "@media (max-width: 600px)": {
    fontSize: "1rem", // Reduce font size on smaller screens
  },
  fontWeight: "bold",
};

export default function ReportSummary({ rowData, formData, setFormData }) {
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [columns, setColumns] = React.useState([]);
  const IdName = "Id";
  const excludedFields = [IdName, "Month", "Year", "PV", "AC", "EV"];
  const styleIcon = {
    color: "white",
  };
  //To apply some filters on table rows
  const initialColumns =
    rowData && rowData.length > 0
      ? Object.keys(rowData[0])
          .filter((key) => !excludedFields.includes(key))
          .map((key) => ({
            id: key,
            label:
              key.charAt(0).toUpperCase() +
              key
                .slice(1)

                .trim(), // Format label as readable text
            minWidth: 100, // Set default minWidth for all columns
            maxWidth: 200,
          }))
      : [];

  React.useEffect(() => {
    setColumns(initialColumns);
    setFilteredRows(rowData);
  }, [rowData]);

  //To expand column on mouse dragging
  const handleResize = (index, event) => {
    const startWidth = columns[index].minWidth;
    const startX = event.clientX;

    const handleMouseMove = (e) => {
      const currentX = e.clientX;
      const newWidth = Math.max(50, startWidth + (currentX - startX));
      setColumns((cols) =>
        cols.map((col, i) =>
          i === index ? { ...col, minWidth: newWidth, maxWidth: newWidth } : col
        )
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  //To expand double Clicked column
  const handleDoubleClick = (index) => {
    setColumns((cols) =>
      cols.map((col, i) =>
        i === index ? { ...col, maxWidth: col.maxWidth ? null : 200 } : col
      )
    );
  };


  const handleExcel = async () => {
    try {
      await exportToExcel({
        reportName:
          "REF. 4222300027 - RU/129/PRJ - INSTALLATION, TESTING AND COMMISSIONING OF DISTRIBUTION SUBSTATIONS & KIOSKS AND DISCONNECTION, RECOVERY AND REPLACEMENT OF EQUIPMENTS",
        filteredRows: rowData,
        excludedFields: ["Month", "Year", "PV", "AC", "EV"],
      });
    } catch (error) {
      console.error("Excel export failed:", error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between", // Push left and right elements apart
          paddingBottom: 1,
          gap: 1,
          flexWrap: "wrap",
          alignItems: "center", // Align items properly
        }}
      >
           <Box
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingLeft: 1.5,
            paddingRight: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Typography underline="hover" sx={style} key="1">
            Name of the Report
          </Typography>
        
        </Box>
        {/* Left-aligned elements */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <AutoComplete
            formData={formData}
            setFormData={setFormData}
            autoId={`project`}
            label={"Project"}
            formDataiId={"Project"}
          />
          <TextBox
            name={"Date"}
            type={"date"}
            label={"Date"}
            autoId={"date"}
            value={formData}
            setValue={setFormData}
          />
        </Box>

        {/* Right-aligned button */}

        <ActionButton
          icon={"fa-solid fa-file-excel"}
          iconsClick={handleExcel}
          caption={"Excel"}
        />
      </Box>

      {rowData && rowData.length > 0 ? (
        <Paper sx={{ width: "100%" }}>
          <TableContainer
            sx={{ maxHeight: "70vh", overflow: "auto", scrollbarWidth: "thin" }}
          >
            <Table stickyHeader sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow sx={{ position: "sticky", top: 0, zIndex: 2 }}>
                  {columns.map((column, index) => (
                    <TableCell
                      key={column.id}
                      style={{
                        minWidth: column.minWidth,
                        position: "relative",
                      }}
                      sx={{
                        padding: "0px",
                        paddingLeft: "4px",
                        border: `1px solid #ddd`,
                        fontWeight: "600",
                        font: "14px",
                        backgroundColor: "#0277bd",
                        color: "white",
                        paddingTop: "3px",
                        paddingBottom: "3px",
                      }}
                      onDoubleClick={() => handleDoubleClick(index)}
                    >
                      {column.label}
                      <span
                        style={{
                          position: "absolute",
                          height: "100%",
                          right: 0,
                          top: 0,
                          width: "5px",
                          cursor: "col-resize",
                          backgroundColor: "rgba(0,0,0,0.1)",
                        }}
                        onMouseDown={(e) => handleResize(index, e)}
                      />
                    </TableCell>
                  ))}
                  <TableCell
                    style={{
                      width: "20px",
                      position: "relative",
                      textAlign: "center",
                    }}
                    sx={{
                      padding: "0px",
                      paddingLeft: "4px",
                      border: `1px solid #ddd`,
                      fontWeight: "600",
                      font: "14px",
                      backgroundColor: "#0277bd",
                      color: "white",
                      paddingTop: "3px",
                      paddingBottom: "3px",
                    }}
                  >
                    Remark
                    <span
                      style={{
                        position: "absolute",
                        height: "100%",
                        right: 0,
                        top: 0,
                        width: "5px",
                        cursor: "col-resize",
                        backgroundColor: "rgba(0,0,0,0.1)",
                      }}
                      onMouseDown={(e) => handleResize(index, e)}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row, index) => {
                  return (
                    <TableRow
                      // onDoubleClick={() => handleAction(row[IdName], "edit")}
                      role="checkbox"
                      tabIndex={-1}
                      key={row["Month"] + row["Year"] + row["MonthYear"]}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: index % 2 === 1 ? "#b3e5fc" : null,
                      }}
                    >
                      {columns.map((column) => {
                        const cellValue = row[column.id];

                        // Determine if value is a number
                        const isNumber =
                          typeof cellValue === "number" ||
                          (typeof cellValue === "string" &&
                            cellValue.trim() !== "" &&
                            !isNaN(cellValue));

                        // Format numbers with commas and two decimal places
                        const formattedValue = isNumber
                          ? Number(cellValue).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }) // Adds commas & fixes decimal places
                          : cellValue || "--"; // Show "--" for empty values

                        return (
                          <TableCell
                            sx={{
                              backgroundColor: null,
                              padding: "0px 4px",
                              border: "1px solid #ddd",
                              minWidth: "100px",
                              maxWidth: column.maxWidth,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              textAlign: isNumber ? "right" : "left", // Right-align numbers
                            }}
                            key={column.id}
                            style={{ minWidth: column.minWidth }}
                          >
                            {formattedValue}
                          </TableCell>
                        );
                      })}

                      <TableCell
                        sx={{
                          backgroundColor: null,
                          padding: "0px",
                          paddingLeft: "4px",
                          paddingRight: "4px",
                          textAlign: "center",
                          border: `1px solid #ddd`,
                          minWidth: "100px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color:
                            row["Cost Performance Index (CPI)"] <= 0
                              ? "red"
                              : "green",
                        }}
                      >
                        {row["Cost Performance Index (CPI)"] <= 0
                          ? "Behind the Schedule and Over Budget"
                          : "Ahead the Schedule and Under Budget"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : (
        <>
          <Box sx={{ width: "100%", textAlign: "center", my: 4 }}>
            <Typography>No Data</Typography>
          </Box>
        </>
      )}
      {/* <ConfirmationAlert
        handleClose={handleConfrimClose}
        open={confirmAlert}
        data={confirmData}
        submite={handleDelete}
      /> */}
    </>
  );
}
