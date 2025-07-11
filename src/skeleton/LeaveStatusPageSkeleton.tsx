import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const LeaveStatusPageSkeleton = () => {
  return (
    <Box
      sx={{
        width: "100%",
        p: 4,
        overflow: "hidden",
        height: "85vh",
      }}
    >
      <div className="w-100 grid grid-cols-3  place-items-center">
        <Skeleton variant="rounded" width={100} height={40} />
      </div>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "76vh",
          height: "76vh",
          overflow: "auto",
          pb: 1.5,
          mt: 2,
        }}
        className="custom-scrollbar-for-menu "
      >
        <Table>
          <TableHead>
            <TableRow>
              {Array.from({ length: 4 }).map((_, index) => (
                <TableCell key={index}>
                  <Skeleton variant="text" width={100} height={28} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 9 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={100} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width={80} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LeaveStatusPageSkeleton;
