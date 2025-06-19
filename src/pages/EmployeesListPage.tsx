import { Box, Typography } from "@mui/material";
import CustomSearch from "../components/reuseable/CustomSearch";
import React, { useRef } from "react";
import { AgGridReact } from "ag-grid-react";

import { ClientSideRowModelModule, CsvExportModule } from "ag-grid-community";
import { employees } from "../dummydata/EmployeelistData";
// import CustomLoadingCellRenderer from "../config/CustomLoadingCellRenderer";
// import CopyCellRenderer from "../components/reuseable/CopyCellRenderer";

const columnDefs = [
  {
    headerName: "Id",
    field: "id",
    editable: false,
    flex: 1,
    //   cellRenderer: (params: any) => <ActionMenuOfBom row={params.data} />,
    width: 120,
  },
  {
    headerName: "Name",
    field: "name",
    editable: false,
    flex: 1,
    // cellRenderer: (col: any) => {
    //   // return col?.value === 1 ? (
    //   //   <MdOutlineToggleOn
    //   //     size={34}
    //   //     color="green"
    //   //     onClick={() => handleStatusChange(0, col?.data?.subjectKey)}
    //   //   />
    //   // ) : (
    //   //   <MdOutlineToggleOff
    //   //     size={34}
    //   //     color="grey"
    //   //     onClick={() => handleStatusChange(1, col?.data?.subjectKey)}
    //   //   />
    //   // );
    // },
    maxWidth: 140,
  },
  { headerName: "#", valueGetter: "node.rowIndex + 1", maxWidth: 100 },

  {
    headerName: "Position",
    field: "position",

    minWidth: 250,
  },

  {
    headerName: "Email",
    field: "email",
    editable: false,
    // flex: 1,

    width: 200,
  },
];
export const EmployeesListPage = () => {
  const inputRef = React.useRef(null);
  const gridRef = useRef<AgGridReact<any>>(null);

  //   const loadingCellRenderer = useCallback(CustomLoadingCellRenderer, []);
  return (
    <div className="w-full">
      <div className="px-6 flex justify-between items-center flex-col sm:flex-row md:flex-row">
        <Typography className="py-4" variant="h5">
          Employees List
        </Typography>
        <Box
          sx={
            {
              // display: "flex",
              // flexDirection: { xs: "column", md: "row" },
              // alignItems: "center",
            }
          }
        >
          <CustomSearch
            width={"40ch"}
            placeholder={"Search by name, role, department....."}
            onChange={() => {}}
            ref={inputRef}
            bgColor={"#000"}
            textColor={"#000000"}
          />
        </Box>
      </div>
      <div className="ag-theme-quartz h-[calc(100vh-160px)]">
        <AgGridReact
          ref={gridRef}
          modules={[ClientSideRowModelModule, CsvExportModule]}
          overlayLoadingTemplate={"<span>Loading...</span>"}
          rowData={employees || []}
          columnDefs={columnDefs}
          defaultColDef={{ filter: true, sortable: true }}
          suppressCellFocus={true}
          //   components={{ copyCellRenderer: CopyCellRenderer }}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          pagination
          enableCellTextSelection={true}
        />{" "}
      </div>
    </div>
  );
};

const OverlayNoRowsTemplate = `<span style="padding: 10px; display: block;">No employees found</span>`;
