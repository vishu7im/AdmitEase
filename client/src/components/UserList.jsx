import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";

const Team = () => {
  const [DataUser, setDataUser] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Diploma Engg");

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const fetch = async () => {
    let url = `http://localhost:8000/userlist/${selectedOption}`;
    try {
      const { data } = await axios.get(url);
      setDataUser(data.data);
    } catch (error) {}
  };

  //   const HandleView = (uuid) => {
  //     navigate(`/admin/tempuser/${uuid}`);
  //   };

  const columns = [
    { field: "id", headerName: "Rank", cellClassName: "name-column--cell" },
    {
      field: "Name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "Course",
      headerName: "Course",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "Cateogry",
      headerName: "Cateogry",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "Gender",
      headerName: "Gender",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "DOB",
      headerName: "DOB",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "Addhaar",
      headerName: "Addhaar",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "Percentage",
      headerName: "Percentage",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "Mobile",
      headerName: "Student MobileNo",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    // {
    //   field: "view",
    //   headerName: "View",
    //   flex: 1,
    //   renderCell: ({ row: { view } }) => {
    //     return (
    //       <Box
    //         width="60%"
    //         m="0 0"
    //         p="5px"
    //         display="flex"
    //         justifyContent="center"
    //         backgroundColor={"green"}
    //         borderRadius="4px"
    //         onClick={() => {
    //           HandleView(view);
    //         }}
    //       >
    //         {<RemoveRedEyeIcon />}

    //         <Typography color="grey" sx={{ ml: "5px" }}>
    //           {"View"}
    //         </Typography>
    //       </Box>
    //     );
    //   },
    // },
  ];

  useEffect(() => {
    fetch();
  }, [selectedOption]);

  return (
    <Box m="0px 10px 10px 10px">
      {/* <Header title="Alumni Request" subtitle="Managing the Member" /> */}
      <div className="m-4 flex justify-center">
        <div className="flex items-center space-x-4">
          <div
            className={`flex items-center p-2 rounded-lg border ${
              selectedOption === "Diploma Engg Lateral Entry"
                ? "border-green-500 bg-green-100"
                : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              id="lateralEntry"
              name="option"
              value="Diploma Engg Lateral Entry"
              checked={selectedOption === "Diploma Engg Lateral Entry"}
              onChange={() => handleOptionChange("Diploma Engg Lateral Entry")}
              className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded-full"
            />
            <label
              htmlFor="lateralEntry"
              className="ml-2 block text-sm text-gray-900"
            >
              Lateral Entry
            </label>
          </div>
          <div
            className={`flex items-center p-2 rounded-lg border ${
              selectedOption === "Diploma Engg"
                ? "border-green-500 bg-green-100"
                : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              id="diplomaEngg"
              name="option"
              value="Diploma Engg"
              checked={selectedOption === "Diploma Engg"}
              onChange={() => handleOptionChange("Diploma Engg")}
              className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded-full"
            />
            <label
              htmlFor="diplomaEngg"
              className="ml-2 block text-sm text-gray-900"
            >
              Diploma Engg
            </label>
          </div>
        </div>
      </div>
      <Box
        m="0px 5px 0 0"
        height="80vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: "#ffffff",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#963e96",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#74829ee1",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#963e96",
          },
          "& .MuiCheckbox-root": {
            color: `"#f51660" !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={DataUser} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;
