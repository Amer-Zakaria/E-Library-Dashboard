import type IPagination from 'src/interfaces/IPagination';

import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { getUploaders } from 'src/api/uploader';
import { DashboardContent } from 'src/layouts/dashboard';

import { useTable } from 'src/components/table';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import TableLoader from 'src/components/table/table-loader';
import { TableNoData } from 'src/components/table/table-no-data';
import { CustomTableHead } from 'src/components/table/table-head';

import { TableToolbar } from '../table-toolbar';
import { UploaderTableRow } from '../table-row';
import PopupForm from '../components/popup-form';

interface IUploaderFilterWithPagination extends IPagination {
  searchKey?: string;
}

export function UploaderView() {
  const [uploaders, setUploaders] = useState([]);
  const [state, setState] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
  const [filterName, setFilterName] = useState('');

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
        const filters: IUploaderFilterWithPagination = {
          pageSize: rowsPerPage,
          pageNumber: page,
          searchKey: filterName,
        };
        const data = await getUploaders(filters);

        setUploaders((data as any).uploaders || []);
        setPage((data as any)?.paginationInfo.pageNumber);
        setRowsPerPage((data as any)?.paginationInfo.pageSize);
        setTotalItems((data as any)?.paginationInfo.totalItems);
        setState('SUCCESS');
      } catch {
        setState('ERROR');
        toast.error('Error fetching uploaders');
      }
    };

    fetchData();
  }, [rowsPerPage, page, refetch, filterName]);

  const handleFilterByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.onResetPage();
    setFilterName(event.target.value);
  };

  /* Starts - FORM */
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState('');
  /* ENDS - FORM */

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
          Uploaders
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => setOpen(true)}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Uploader
        </Button>
      </Box>

      <Card>
        <Scrollbar>
          <TableToolbar filterName={filterName} onFilterName={handleFilterByName} />
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomTableHead headLabel={[{ id: 'username', label: 'Username' }, { id: '' }]} />
              <TableBody sx={{ position: 'relative', ...(state === 'LOADING' && { height: 300 }) }}>
                {uploaders.map((row: any, i) => (
                  <UploaderTableRow
                    setEditId={setEditId}
                    setRefetch={setRefetch}
                    key={row.id}
                    row={row}
                    sx={{ ...(state === 'LOADING' && { visibility: 'hidden' }) }}
                  />
                ))}
                {state === 'LOADING' && <TableLoader />}
                {state === 'SUCCESS' && uploaders.length === 0 && <TableNoData />}
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

      <PopupForm setRefetch={setRefetch} open={open} onClose={() => setOpen(false)} />

      <PopupForm
        editId={editId}
        setRefetch={setRefetch}
        open={!!editId}
        onClose={() => setEditId('')}
        isEdit
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------
