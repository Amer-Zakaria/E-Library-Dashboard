import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

import { getUploader, createUploader } from 'src/api/uploader';
import { createUploaderSchema, type ICreateUploader } from 'src/schema/uploader';

export default ({ open, onClose, isEdit = false, setRefetch, editId = '' }) => {
  const [initData, setInitData] = useState();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ICreateUploader>({
    resolver: zodResolver(createUploaderSchema),
    defaultValues: initData,
  });
  useEffect(() => {
    if (initData) {
      reset(initData);
    }
  }, [initData, reset]);

  useEffect(() => {
    if (open && isEdit) {
      setLoading(true);

      (async () => {
        const { _id, ...uploaderPruned } = (await getUploader(editId)) as any;
        setInitData(uploaderPruned);
        setLoading(false);
      })();
    } else if (open && !isEdit) {
      reset({ username: '', password: '' });
      setLoading(false);
    }
  }, [open, isEdit, reset, editId]);

  const handleFormSubmit = async (data) => {
    await createUploader(data).then(() => {
      toast.success('Uploader has been created successfully.');
      setRefetch((o) => !o);
    });
    handleClose();
  };

  const handleClose = () => {
    reset({ username: '', password: '' });
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ minHeight: 200 }}>
      <DialogTitle>{isEdit ? 'Edit Uploader' : 'Add Uploader'}</DialogTitle>

      <DialogContent>
        {isEdit && loading && initData && Object.keys(watch()).length > 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <Box component="form" sx={{ mt: 1 }}>
            <Controller
              name="username"
              control={control}
              rules={{
                required: 'Username is required',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  autoFocus
                  margin="dense"
                  label="Username"
                  type="text"
                  fullWidth
                  variant="outlined"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: !isEdit && 'Password is required',
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  required={!isEdit}
                  margin="dense"
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        {!(isEdit && loading) && (
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Save'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
