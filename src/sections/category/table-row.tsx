import { toast } from 'react-toastify';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import TableRow, { type TableRowProps } from '@mui/material/TableRow';
import {
  Chip,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import constructUrl from 'src/utils/construct_url';

import { deleteCategory } from 'src/api/category';

import { Iconify } from 'src/components/iconify';

// ---------------------------- ------------------------------------------

export type CategoryTableRowProps = {
  row: any;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
} & TableRowProps;

export function CategoryTableRow({ row, setRefetch, ...rest }: CategoryTableRowProps) {
  const router = useRouter();

  /* POPOVER - STARTS */
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);
  /* POPOVER - ENDS */

  //Edit
  const handleEdit = useCallback(
    (id: string) => {
      router.push(`edit/${id}`);
    },
    [router]
  );

  /* Deletetion - STARTS */
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClickOpen = () => {
    setOpenDeleteDialog(true);
  };

  const handleClose = () => {
    setOpenDeleteDialog(false);
    setIsDeleting(false);
  };

  const handleOpenDeleteDialog = useCallback(() => {
    handleClosePopover();
    handleClickOpen();
  }, [handleClosePopover]);

  const handleDelete = useCallback(
    (id: string) => {
      setIsDeleting(true);

      (async () => {
        await deleteCategory(id as string).catch(() => setIsDeleting(false));
        setIsDeleting(false);
        toast.success('Category has been deleted successfully.');
        setOpenDeleteDialog(false);
        setRefetch((old) => !old);
      })();
    },
    [setRefetch]
  );
  /* Deletetion - ENDS */

  return (
    <>
      <TableRow {...rest} hover tabIndex={-1} role="checkbox">
        <TableCell component="th" scope="row">
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar alt={row.name} src={constructUrl(row.img)}>
              {row.name.split(/\t/)[0][0]}
            </Avatar>
            {row.name}
          </Box>
        </TableCell>

        <TableCell>{row.description}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={() => handleEdit(row._id)}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>

      {DeleteDialog(openDeleteDialog, handleClose, row, isDeleting, handleDelete)}
    </>
  );
}

function DeleteDialog(
  openDeleteDialog: boolean,
  handleClose: () => void,
  row: any,
  isDeleting: boolean,
  handleDelete: (id: string) => void
) {
  return (
    <Dialog
      open={openDeleteDialog}
      onClose={handleClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        id="delete-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pr: 1,
        }}
      >
        <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
          Delete Category
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography id="delete-dialog-description" variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete this category?
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={row.name}
            color="error"
            variant="outlined"
            size="medium"
            sx={{
              backgroundColor: 'error.light',
              color: 'error.contrastText',
              borderColor: 'error.main',
            }}
          />
        </Box>

        <Typography variant="body2" color="error.main" sx={{ fontWeight: 'medium' }}>
          This action cannot be undone. All contents in this category will remain but will have no
          category.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isDeleting} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={() => handleDelete(row._id)}
          disabled={isDeleting}
          color="error"
          variant="contained"
          startIcon={
            isDeleting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Iconify icon="solar:trash-bin-trash-bold" />
            )
          }
        >
          {isDeleting ? 'Deleting...' : 'Delete Category'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
