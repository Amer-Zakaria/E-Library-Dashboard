import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { getContents } from 'src/api/content';
import { DashboardContent } from 'src/layouts/dashboard';

import { useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import TableLoader from 'src/components/table/table-loader';
import { TableNoData } from 'src/components/table/table-no-data';
import { CustomTableHead } from 'src/components/table/table-head';

import { ContentTableRow } from '../table-row';

// ----------------------------------------------------------------------

export function ContentView() {
  const [contents, setContents] = useState([]);
  const [state, setState] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const context = {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
  };
  const table = useTable(context);

  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    setState('LOADING');
    const fetchData = async () => {
      try {
        const data = await getContents({ pageSize: rowsPerPage, pageNumber: page });

        setContents((data as any).contents || []);
        setPage((data as any)?.paginationInfo.pageNumber);
        setRowsPerPage((data as any)?.paginationInfo.pageSize);
        setTotalItems((data as any)?.paginationInfo.totalItems);
        setState('SUCCESS');
      } catch {
        setState('ERROR');
        toast.error('Error fetching contents');
      }
    };

    fetchData();
  }, [rowsPerPage, page, refetch]);

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Contents
        </Typography>
        <Link to="contents/create">
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Content
          </Button>
        </Link>
      </Box>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomTableHead
                headLabel={[
                  { id: 'title', label: 'Title' },
                  { id: 'category', label: 'Category' },
                  { id: 'author', label: 'Author' },
                  { id: 'uploader', label: 'Uploader' },
                  { id: 'status', label: 'Status', align: 'center' },
                  { id: '' },
                ]}
              />
              <TableBody sx={{ position: 'relative', ...(state === 'LOADING' && { height: 300 }) }}>
                {contents.map((row: any) => (
                  <ContentTableRow
                    setRefetch={setRefetch}
                    key={row._id}
                    row={row}
                    sx={{ ...(state === 'LOADING' && { visibility: 'hidden' }) }}
                  />
                ))}
                {state === 'LOADING' && <TableLoader />}
                {state === 'SUCCESS' && contents.length === 0 && <TableNoData />}
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
    </DashboardContent>
  );
}
