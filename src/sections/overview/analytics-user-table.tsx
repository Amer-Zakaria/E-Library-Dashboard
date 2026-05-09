import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { fDateTime } from 'src/utils/format-time';

import { getUserStats } from 'src/api/stats';

import { useTable } from 'src/components/table';
import { Scrollbar } from 'src/components/scrollbar';
import TableLoader from 'src/components/table/table-loader';
import { TableNoData } from 'src/components/table/table-no-data';
import { CustomTableHead } from 'src/components/table/table-head';

// ----------------------------------------------------------------------

export function AnalyticsUserTable({ title, subheader, ...other }: any) {
  const [users, setUsers] = useState([]);
  const [state, setState] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const table = useTable({
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState('LOADING');
      try {
        const data = await getUserStats({ pageSize: rowsPerPage, pageNumber: page });
        setUsers((data as any).activities || []);
        setPage((data as any)?.paginationInfo.pageNumber);
        setRowsPerPage((data as any)?.paginationInfo.pageSize);
        setTotalItems((data as any)?.paginationInfo.totalItems);
        setState('SUCCESS');
      } catch (error) {
        console.error('Error fetching user stats:', error);
        setState('ERROR');
      }
    };

    fetchData();
  }, [rowsPerPage, page]);

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3, pl: 0 }} />

      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 640 }}>
            <CustomTableHead
              headLabel={[
                { id: 'userLabel', label: 'User' },
                { id: 'lastSeen', label: 'Last Seen' },
                { id: 'numberOfSessions', label: 'Sessions', align: 'center' },
                { id: 'sumOfDownloads', label: 'Downloads', align: 'center' },
                { id: 'sumOfViews', label: 'Views', align: 'center' },
              ]}
            />
            <TableBody sx={{ position: 'relative', ...(state === 'LOADING' && { height: 240 }) }}>
              {users.map((row: any) => (
                <TableRow key={row._id} hover>
                  <TableCell>{row.userLabel}</TableCell>
                  <TableCell>{row.lastSeen ? fDateTime(row.lastSeen) : 'N/A'}</TableCell>
                  <TableCell align="center">{row.numberOfSessions}</TableCell>
                  <TableCell align="center">{row.sumOfDownloads}</TableCell>
                  <TableCell align="center">{row.sumOfViews}</TableCell>
                </TableRow>
              ))}

              {state === 'LOADING' && <TableLoader />}
              {state === 'SUCCESS' && users.length === 0 && <TableNoData />}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        disabled={state !== 'SUCCESS'}
        component="div"
        page={page - 1}
        count={totalItems}
        rowsPerPage={rowsPerPage}
        onPageChange={table.onChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}
