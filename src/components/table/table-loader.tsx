import { TableRow, TableCell, CircularProgress } from '@mui/material';

export default function TableLoader() {
  return (
    <TableRow
      key="loader"
      sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <TableCell>
        <CircularProgress size={30} sx={{ color: '#cccccc' }} />
      </TableCell>
    </TableRow>
  );
}
