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
  Switch,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import constructUrl from 'src/utils/construct_url';

import { deleteContent, activationContent } from 'src/api/content';

import { Iconify } from 'src/components/iconify';

// ---------------------------- ------------------------------------------

export type ContentTableRowProps = {
  row: any;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
} & TableRowProps;

export function ContentTableRow({ row, setRefetch, ...rest }: ContentTableRowProps) {
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
      router.push(`contents/edit/${id}`);
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
        await deleteContent(id as string).catch(() => setIsDeleting(false));
        setIsDeleting(false);
        toast.success('Content has been deleted successfully.');
        setOpenDeleteDialog(false);
        setRefetch((old) => !old);
      })();
    },
    [setRefetch]
  );
  /* Deletetion - ENDS */

  const handleActivation = useCallback(async () => {
    await activationContent(row._id, !row.isActive);
    setRefetch((old) => !old);
  }, [row._id, row.isActive, setRefetch]);

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
            <Avatar alt={row.title} src={constructUrl(row.mainImage)}>
              {row.title.split(/\t/)[0][0]}
            </Avatar>
            {row.title}
          </Box>
        </TableCell>

        <TableCell>
          <Chip label={row.category} size="small" variant="outlined" />
        </TableCell>

        <TableCell>{row.author}</TableCell>

        <TableCell>{row.uploader}</TableCell>

        <TableCell align="center">
          <Switch
            color={row.isActive ? 'success' : 'default'}
            checked={!!row.isActive}
            onClick={handleActivation}
          />
        </TableCell>

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
          Delete Content
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography id="delete-dialog-description" variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete this content?
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={row.title}
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
          This action cannot be undone. All files and data will be permanently deleted.
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
          {isDeleting ? 'Deleting...' : 'Delete Content'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
